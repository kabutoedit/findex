'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import styles from './NegativeSeriesChart.module.scss'
import { useFiltersStore } from '@/src/store/useMessagesFilters.store'
import { SeriesPoint, SeriesResponseType } from '@/src/types/types'
import { useQuery } from '@tanstack/react-query'
import { fetchNegativeSeries } from '../../lib/api'
import {
	Area,
	AreaChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

interface NegativeSeriesChartProps {
	series: SeriesPoint[]
	loading: boolean
	tariff: 'basic' | 'standard' | 'vip'
	sortingBy: string
	brandId: number
}

function normalizeDate(d: Date) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(date: string | Date, days: number) {
	const result = new Date(date)
	result.setDate(result.getDate() + days)
	return result
}

function mapPoint(item: any): SeriesPoint {
	return {
		date: item.bucket_start.split('T')[0],
		negative_count: item.count,
		change_percent: item.delta_percent,
		displayDate: item.bucket_label,
		kind: item.kind,
	}
}

const CustomTooltip = ({ active, payload }: any) => {
	if (!active || !payload?.length || payload[0].payload.isFake) return null
	const point = payload[0].payload

	return (
		<div className={styles.tooltip}>
			<p className={styles.tooltipDate}>{point.date}</p>
			<div className={styles.tooltipValue}>
				<span>Негативных сообщений: </span>
				<p style={{ margin: 0 }}>{point.negative_count}</p>
			</div>
			{point.change_percent !== null && (
				<div className={styles.tooltipValue}>
					<span>Изменение: </span>
					<p style={{ margin: 0 }}>
						{point.change_percent != null
							? `${point.change_percent.toFixed(1)}%`
							: ''}
					</p>
				</div>
			)}
		</div>
	)
}

export default function NegativeSeriesChart({
	series,
	loading,
	tariff,
	sortingBy,
	brandId,
}: NegativeSeriesChartProps) {
	const chartContainerRef = useRef<HTMLDivElement>(null)
	const [overlayWidthPx, setOverlayWidthPx] = useState(0)
	const [fakeStartPercent, setFakeStartPercent] = useState(100)
	const { dateRange } = useFiltersStore()

	const [isInitialLoad, setIsInitialLoad] = useState(true)
	const initialDataRef = useRef<string | null>(null)

	useEffect(() => {
		if (!loading && series.length > 0) {
			const str = JSON.stringify(series)
			if (initialDataRef.current === null) {
				initialDataRef.current = str
			} else if (initialDataRef.current !== str) {
				setIsInitialLoad(false)
			}
		}
	}, [series, loading])

	const today = normalizeDate(new Date())
	const from = addDays(today, -37).toISOString().split('T')[0]
	const to = addDays(today, -30).toISOString().split('T')[0]

	const seriesQuery = useQuery<SeriesResponseType>({
		queryKey: [
			'negative-series-basic',
			{ brand_id: brandId, from, to },
			sortingBy,
		],
		queryFn: () =>
			fetchNegativeSeries({
				brand_id: brandId,
				from,
				to,
				group_by: sortingBy,
			}),
		enabled: tariff === 'basic' && isInitialLoad && !!brandId,
	})

	const basicData: SeriesPoint[] = useMemo(
		() => seriesQuery.data?.points?.map(mapPoint) ?? [],
		[seriesQuery.data]
	)

	const [chartData, setChartData] = useState<SeriesPoint[]>([])

	useEffect(() => {
		if (loading || series.length === 0) return

		let sourceData: SeriesPoint[]

		if (!isInitialLoad || tariff === 'vip') {
			sourceData = series
		} else if (tariff === 'basic') {
			if (basicData.length === 0) return
			sourceData = basicData
		} else {
			sourceData = series
		}

		if (isInitialLoad && tariff !== 'vip') {
			const last = sourceData[sourceData.length - 1]

			if (!last?.date) {
				setChartData(sourceData)
				return
			}

			const fakePoints: SeriesPoint[] = Array.from({ length: 14 }, (_, i) => {
				const fDate = addDays(new Date(last.date), i + 1)
				return {
					displayDate: fDate.toLocaleDateString('ru-RU', {
						day: '2-digit',
						month: '2-digit',
					}),
					date: fDate.toISOString(),
					change_percent: undefined,
					negative_count: null as any,
					isFake: true,
				}
			})
			setChartData([...sourceData, ...fakePoints])
		} else {
			setChartData(sourceData)
		}
	}, [series, loading, isInitialLoad, tariff, basicData, sortingBy, dateRange])

	useEffect(() => {
		const updateWidth = () => {
			if (
				!chartContainerRef.current ||
				!isInitialLoad ||
				tariff === 'vip' ||
				chartData.length <= 14
			) {
				setOverlayWidthPx(0)
				setFakeStartPercent(100)
				return
			}
			const fullWidth = chartContainerRef.current.getBoundingClientRect().width
			const effectiveWidth = Math.max(0, fullWidth - 65)
			const overlay = Math.floor(effectiveWidth * (14 / (chartData.length - 1)))
			setOverlayWidthPx(overlay)
			setFakeStartPercent(
				Math.round(((fullWidth - overlay - 65) / fullWidth) * 100)
			)
		}

		updateWidth()
		window.addEventListener('resize', updateWidth)
		return () => window.removeEventListener('resize', updateWidth)
	}, [chartData, isInitialLoad, tariff])

	const maxValue = Math.max(
		...chartData
			.map(p => p.negative_count)
			.filter((v): v is number => v !== null),
		0
	)
	const step = maxValue <= 10 ? 1 : maxValue <= 50 ? 5 : 10
	const ticksArray = Array.from(
		{ length: Math.ceil((maxValue + step) / step) + 1 },
		(_, i) => i * step
	)

	const lastActualIndex = chartData.findLastIndex(p => p.kind === 'actual')
	const splitPercent =
		chartData.length > 1
			? Math.round((lastActualIndex / (chartData.length - 1)) * 100)
			: 100

	return (
		<div className={styles.chartWrapper}>
			<div className={styles.chartContainer} ref={chartContainerRef}>
				{loading ? (
					<div className={styles.loading}>Загрузка...</div>
				) : (
					<ResponsiveContainer width='100%' height={280}>
						<AreaChart data={chartData} margin={{ left: -25 }}>
							{/* <defs>
								<linearGradient id='colorNeg' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor='#2563eb' stopOpacity={0.3} />
									<stop offset='95%' stopColor='#2563eb' stopOpacity={0} />
								</linearGradient>

								<linearGradient
									key={fakeStartPercent}
									id='lineGradientFake'
									x1='0'
									y1='0'
									x2='1'
									y2='0'
								>
									<stop
										offset={`${fakeStartPercent}%`}
										stopColor='#34547D'
										stopOpacity={1}
									/>
									<stop
										offset={`${fakeStartPercent}%`}
										stopColor='#fff'
										stopOpacity={0}
									/>
								</linearGradient>

								<linearGradient
									id='lineGradientVip'
									x1='0'
									y1='0'
									x2='1'
									y2='0'
								>
									<stop
										offset={`${splitPercent}%`}
										stopColor='#34547D'
										stopOpacity={1}
									/>
									<stop
										offset={`${splitPercent}%`}
										stopColor='#E16D1A'
										stopOpacity={1}
									/>
								</linearGradient>
							</defs> */}

							<CartesianGrid
								strokeDasharray='4 6'
								stroke='#e5e7eb'
								vertical
								horizontal
							/>

							<XAxis
								dataKey='displayDate'
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: '#273242', fontWeight: 500 }}
								padding={{ left: 40, right: 20 }}
								dy={10}
							/>

							<YAxis
								ticks={ticksArray}
								axisLine={false}
								tickLine={false}
								tick={({ x, y, payload, index }) => (
									<text
										x={x}
										y={Number(y) + 5}
										textAnchor='end'
										fill={index % 2 === 0 ? '#273242' : '#9ca3af'}
										fontSize={index % 2 === 0 ? 20 : 14}
										fontWeight={index % 2 === 0 ? 500 : 400}
									>
										{payload.value}
									</text>
								)}
							/>

							<Tooltip
								content={<CustomTooltip />}
								cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
								wrapperStyle={{ zIndex: 10 }}
							/>

							<Area
								type='linear'
								dataKey='negative_count'
								stroke='#34547D'
								strokeWidth={2}
								fill='none'
								connectNulls={true}
								dot={(props: any) => {
									if (props.value === null || props.payload.isFake)
										return <g key={props.key} />
									const isPredicted = props.payload.kind === 'predicted'
									return (
										<circle
											cx={props.cx}
											cy={props.cy}
											r={2}
											fill={isPredicted ? '#E16D1A' : '#34547D'}
										/>
									)
								}}
								activeDot={(props: any) => {
									if (props.value === null || props.payload.isFake)
										return <g key={props.key} />
									const isPredicted = props.payload.kind === 'predicted'
									return (
										<circle
											cx={props.cx}
											cy={props.cy}
											r={4}
											fill={isPredicted ? '#E16D1A' : '#34547D'}
										/>
									)
								}}
							/>

							{tariff === 'vip' && (
								<Area
									type='linear'
									dataKey='predicted_count'
									stroke='#E16D1A'
									strokeWidth={2}
									strokeDasharray='4 4'
									fill='none'
									connectNulls={false}
									dot={(props: any) => {
										if (props.value === null) return <g key={props.key} />
										return (
											<circle
												cx={props.cx}
												cy={props.cy}
												r={2}
												fill='#E16D1A'
											/>
										)
									}}
									activeDot={(props: any) => {
										if (props.value === null) return <g key={props.key} />
										return (
											<circle
												cx={props.cx}
												cy={props.cy}
												r={4}
												fill='#E16D1A'
											/>
										)
									}}
								/>
							)}
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>

			{!loading && isInitialLoad && tariff !== 'vip' && overlayWidthPx > 0 && (
				<div
					className={styles.overlay}
					style={{ width: `${overlayWidthPx}px`, marginLeft: 'auto' }}
				>
					<span>
						{tariff === 'basic'
							? 'Обновитесь до Standard для просмотра текущих данных'
							: 'Эта часть графика доступна только в тарифе VIP'}
					</span>
				</div>
			)}
		</div>
	)
}
