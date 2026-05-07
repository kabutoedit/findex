'use client'

import styles from '../style.module.scss'
import { useState } from 'react'
import NegativeSeriesChart from '@/components/negativeSeriesChart/ui/NegativeSeriesChart'
import TopNegativeAuthors from '@/components/topNegativeAuthors/index'
import GraphSorting from '@/components/ui/graphSorting/ui/GraphSorting'
import SecondCalendar from '@/components/ui/secondCalendar/ui/SecondCalendar'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useGraphSortingLogic } from '@/components/ui/graphSorting/hooks/useGraphSortingLogic'

export default function ImageDetector() {
	const { brandID, tariff } = useFiltersStore()
	const [sortingBy, setSortingBy] = useState('day')
	const { sortingOptions } = useGraphSortingLogic()

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
					<SecondCalendar />
					<GraphSorting
						options={sortingOptions ?? []}
						sortingBy={sortingBy}
						setSortingBy={setSortingBy}
					/>
				</div>

				<div className={styles.detector}>
					<NegativeSeriesChart
						sortingBy={sortingBy}
						tariff={tariff}
						brandId={brandID}
					/>
				</div>
			</div>

			<TopNegativeAuthors />
		</div>
	)
}
