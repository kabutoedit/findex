import { useMemo, useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
	SeriesResponseType,
	SeriesPoint,
} from '../types/negativeSeriesChartTypes'
import { fetchNegativeSeries } from '../api/negativeSeriesChart.api'
import { addDays, mapPoint, normalizeDate } from '../utils/chart.helpers'
import { UseChartDataProps } from '../types/negativeSeriesChartTypes'
import { useFiltersStore } from '@/store/useMessagesFilters.store'

export const useChartData = ({ sortingBy, brandId }: UseChartDataProps) => {
	const [isInitialLoad, setIsInitialLoad] = useState(true)
	const initialDataRef = useRef<string | null>(null)

	const { tariff, dateRange } = useFiltersStore()

	const { data: mainResponse, isLoading: isMainLoading } =
		useQuery<SeriesResponseType>({
			queryKey: [
				'negative-series',
				brandId,
				sortingBy,
				dateRange?.from,
				dateRange?.to,
			],
			queryFn: () =>
				fetchNegativeSeries({
					brand_id: brandId,
					group_by: sortingBy,
					from: dateRange?.from?.toISOString().split('T')[0],
					to: dateRange?.to?.toISOString().split('T')[0],
				}),
			enabled: !!brandId,
		})

	const mainSeries = useMemo(
		() => mainResponse?.points?.map(mapPoint) ?? [],
		[mainResponse]
	)

	const today = normalizeDate(new Date())
	const basicFrom = addDays(today, -37).toISOString().split('T')[0]
	const basicTo = addDays(today, -30).toISOString().split('T')[0]

	const { data: basicResponse, isLoading: isBasicLoading } =
		useQuery<SeriesResponseType>({
			queryKey: [
				'negative-series-basic',
				brandId,
				basicFrom,
				basicTo,
				sortingBy,
			],
			queryFn: () =>
				fetchNegativeSeries({
					brand_id: brandId,
					from: basicFrom,
					to: basicTo,
					group_by: sortingBy,
				}),
			enabled: tariff === 'basic' && isInitialLoad && !!brandId,
		})

	const basicData = useMemo(
		() => basicResponse?.points?.map(mapPoint) ?? [],
		[basicResponse]
	)

	const isLoading =
		isMainLoading || (tariff === 'basic' && isInitialLoad && isBasicLoading)

	useEffect(() => {
		if (!isLoading && mainSeries.length > 0) {
			const currentDataStr = JSON.stringify(mainSeries)

			if (initialDataRef.current === null) {
				initialDataRef.current = currentDataStr
			} else if (initialDataRef.current !== currentDataStr) {
				setIsInitialLoad(false)
			}
		}
	}, [mainSeries, isLoading])

	const chartData = useMemo(() => {
		if (isLoading) return []

		let sourceData: SeriesPoint[]

		if (!isInitialLoad || tariff === 'vip') {
			sourceData = mainSeries
		} else if (tariff === 'basic') {
			sourceData = basicData.length > 0 ? basicData : mainSeries
		} else {
			sourceData = mainSeries
		}

		if (isInitialLoad && (tariff === 'basic' || tariff === 'standard')) {
			const lastPoint = sourceData[sourceData.length - 1]
			if (!lastPoint?.date) return sourceData

			const fakePoints: SeriesPoint[] = Array.from({ length: 14 }, (_, i) => {
				const fDate = addDays(new Date(lastPoint.date), i + 1)
				return {
					displayDate: fDate.toLocaleDateString('ru-RU', {
						day: '2-digit',
						month: '2-digit',
					}),
					date: fDate.toLocaleDateString('ru-RU'),
					negative_count: null as any,
					isFake: true,
					change_percent: undefined,
				}
			})
			return [...sourceData, ...fakePoints]
		}

		return sourceData
	}, [mainSeries, basicData, isLoading, isInitialLoad, tariff])

	return {
		chartData,
		isInitialLoad,
		isLoading,
	}
}
