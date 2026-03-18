'use client'

import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import NegativeSeriesChart from '../../../components/NegativeSeriesChart/NegativeSeriesChart'
import TopNegativeAuthors from '../../../components/TopNegativeAuthors/TopNegativeAuthors'
import { useEffect, useState } from 'react'
import { useFiltersStore } from '../../../store/useMessagesFilters.store'
import { api } from '../../../lib/api'
import axios from 'axios'
import Accordion from '@/src/components/ui/accordion/Accordion'

interface SeriesPoint {
	date: string
	negative_count: number
	change_percent?: number
	displayDate: string
	fullDate: string
}

interface Author {
	name: string
	platform: string
	negative_count: number
	last_activity: string
	avatar_url?: string
}

export default function ImageDetector() {
	const { brandID, dateRange } = useFiltersStore()

	const [series, setSeries] = useState<SeriesPoint[]>([])
	const [authors, setAuthors] = useState<Author[]>([])
	const [loading, setLoading] = useState(true)
	const [grouping, setGrouping] = useState<'day' | 'week' | 'month'>('day')

	const tariff = 'basic'

	useEffect(() => {
		if (!brandID) return

		const controller = new AbortController()

		const fetchData = async () => {
			setLoading(true)

			const formatDate = (date: Date) => {
				const pad = (n: number) => n.toString().padStart(2, '0')

				return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
					date.getDate()
				)}`
			}

			try {
				const params: Record<string, string | number> = { brand_id: brandID }
				if (dateRange.from) {
					params.from = formatDate(dateRange.from)
				}

				if (dateRange.to) {
					params.to = formatDate(dateRange.to)
				}

				const [seriesRes, authorsRes] = await Promise.all([
					api.get('/api/analytics/negative-series', {
						params,
						signal: controller.signal,
					}),
					api.get('/api/analytics/negative-authors-feed', {
						params: { ...params, authors_limit: 3, per_author_limit: 5 },
						signal: controller.signal,
					}),
				])

				setAuthors(authorsRes.data.items)

				const rawSeries = seriesRes.data.points || []
				const processedSeries: SeriesPoint[] = rawSeries.map((item: any) => {
					const d = new Date(item.date)
					return {
						date: item.date,
						negative_count: item.negative_count ?? item.count ?? 0,
						change_percent: item.change_percent,
						displayDate: d.toLocaleDateString('ru-RU', {
							day: '2-digit',
							month: '2-digit',
						}),
						fullDate: d.toLocaleDateString('ru-RU', {
							day: '2-digit',
							month: 'short',
							year: 'numeric',
						}),
					}
				})
				setSeries(processedSeries)

				// const rawAuthors = authorsRes.data.items || []
				// const processedAuthors: Author[] = rawAuthors.map((item: any) => ({
				// 	name: item.name,
				// 	platform: item.platform,
				// 	negative_count: item.negative_count,
				// 	last_activity: item.last_activity,
				// 	avatar_url: item.avatar_url,
				// }))
				// setAuthors(processedAuthors)
			} catch (err: any) {
				if (axios.isCancel(err)) return
				console.warn(
					'Analytics fetch error:',
					err.response?.data || err.message
				)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
		return () => controller.abort()
	}, [brandID, dateRange.from, dateRange.to])

	console.log(authors)

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
					<Calendar />
					<Accordion selected={grouping} onChange={setGrouping} />
				</div>

				<div className={styles.detector}>
					<NegativeSeriesChart
						tariff={tariff}
						series={series}
						loading={loading}
					/>
				</div>
			</div>

			<TopNegativeAuthors authors={authors as any} />
		</div>
	)
}
