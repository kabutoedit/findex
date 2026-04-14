'use client'

import styles from '../style.module.scss'
import { useState } from 'react'
import NegativeSeriesChart from '@/components/negativeSeriesChart/NegativeSeriesChart'
import TopNegativeAuthors from '@/components/topNegativeAuthors/TopNegativeAuthors'
import Accordion from '@/components/ui/graphSorting/GraphSorting'
import SecondCalendar from '@/components/ui/secondCalendar/SecondCalendar'
import { Author, SeriesPoint, Tariff } from '@/types/types'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useQuery } from '@tanstack/react-query'
import {
	fetchNegativeSeries,
	fetchNegativeAuthorsFeed,
	fetchSortingBy,
} from '../../api/api'
import { SeriesResponseType } from '@/types/types'

interface AuthorsResponseType {
	items: Author[]
}

interface SortingByResponseType {
	brand_id: number
	from: string
	to: string
	group_by: string
	bucket_count: number
	available_groupings: {
		value: string
		label: string
	}[]
	series: any[]
}
const formatDate = (date: Date) => {
	const pad = (n: number) => n.toString().padStart(2, '0')
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate()
	)}`
}

export default function ImageDetector() {
	const { brandID, dateRange, tariff } = useFiltersStore()
	const [sortingBy, setSortingBy] = useState('day')

	const params: Record<string, any> = {
		brand_id: brandID,
		...(dateRange.from && { from: formatDate(dateRange.from) }),
		...(dateRange.to && { to: formatDate(dateRange.to) }),
	}

	const seriesQuery = useQuery<SeriesResponseType>({
		queryKey: ['negative-series', params, sortingBy],

		queryFn: () =>
			fetchNegativeSeries({
				...params,
				group_by: sortingBy,
				...((tariff as Tariff) === 'vip' && { include_forecast: true }),
			}),
		enabled: !!brandID,
	})

	console.log(seriesQuery.data)
	console.log(params)

	const authorsQuery = useQuery<AuthorsResponseType>({
		queryKey: ['negative-authors', params],
		queryFn: () => fetchNegativeAuthorsFeed(params),
		enabled: !!brandID,
	})

	const sortingByQuery = useQuery<SortingByResponseType>({
		queryKey: ['sorting-by', params],
		queryFn: () => fetchSortingBy(params),
		enabled: !!brandID,
	})

	const sortingOptions = sortingByQuery.data?.available_groupings

	const loading = seriesQuery.isLoading || authorsQuery.isLoading
	const error = seriesQuery.isError || authorsQuery.isError

	const series: SeriesPoint[] = seriesQuery.data?.points
		? seriesQuery.data.points.map(item => ({
				date: item.bucket_start.split('T')[0],
				negative_count: item.count ?? 0,
				change_percent: item.delta_percent,
				displayDate: item.bucket_label,
				fullDate: item.bucket_start,
				kind: item.kind,
		  }))
		: []

	const authors: Author[] = authorsQuery.data?.items ?? []

	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<div className={styles.imageDetector}>
				<div className={styles.header}>
					<div>
						<h3 className={styles.title}>Детектор имиджа</h3>
						<p className={styles.subtitle}>
							Анализ динамики негативных упоминаний бренда
						</p>
					</div>
					<div className={styles.tariff}>Тариф: {tariff}</div>
				</div>

				<div className={styles.CalendarAndAccordion}>
					<SecondCalendar tariff={tariff} />
					<Accordion
						options={sortingOptions ?? []}
						sortingBy={sortingBy}
						setSortingBy={setSortingBy}
					/>
				</div>

				<div className={styles.detector}>
					<NegativeSeriesChart
						sortingBy={sortingBy}
						tariff={tariff}
						series={series}
						loading={loading}
						brandId={brandID}
					/>
				</div>
			</div>

			<TopNegativeAuthors authors={authors} />
			{loading && <div style={{ marginTop: 16 }}>Loading...</div>}
			{error && <div style={{ marginTop: 16 }}>Ошибка при загрузке данных</div>}
		</div>
	)
}
