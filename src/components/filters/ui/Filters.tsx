'use client'
import styles from './Filters.module.scss'
import { useEffect } from 'react'
import Search from '@/components/ui/search/Search'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useQuery } from '@tanstack/react-query'
import { fetchFilters } from '../api/filters.api'
import { useFiltersLogic } from '../hooks/useFiltersLogic'
import FilterGroup from './FilterGroup'

type FiltersProps = {
	search: string
	setSearch: (value: string) => void
}

export default function Filters({ search, setSearch }: FiltersProps) {
	const { brandID, resetFilters } = useFiltersStore()
	const { selected, toggle, resetInternal, applyFilters, hasActive } =
		useFiltersLogic(resetFilters)

	const { data, isLoading, error } = useQuery({
		queryKey: ['filters', brandID],
		queryFn: () => fetchFilters(brandID),
		enabled: !!brandID,
		staleTime: 1000 * 60 * 15,
	})

	useEffect(() => {
		if (brandID) {
			resetFilters()
			resetInternal()
		}
	}, [brandID])

	if (isLoading) return <div>Загрузка фильтров...</div>
	if (error) return error.message
	if (!data) return null

	return (
		<div className={styles.filters}>
			<Search search={search} setSearch={setSearch} />

			<div className={styles.panel}>
				<FilterGroup
					title='Страны'
					items={data.countries}
					groupKey='countries'
					selected={selected}
					toggle={toggle}
				/>
				<FilterGroup
					title='Тональность'
					items={data.tones}
					groupKey='tones'
					selected={selected}
					toggle={toggle}
				/>
				<FilterGroup
					title='Источники'
					items={data.sources}
					groupKey='sources'
					selected={selected}
					toggle={toggle}
				/>
				<FilterGroup
					title='Типы источников'
					items={data.sourceTypes}
					groupKey='sourceTypes'
					selected={selected}
					toggle={toggle}
				/>

				<div className={styles.btns}>
					<button
						className={`${styles.btn} ${hasActive ? styles.active : ''}`}
						onClick={applyFilters}
					>
						Отфильтровать
					</button>

					{hasActive && (
						<button
							onClick={resetInternal}
							className={`${styles.btn} ${styles.active}`}
						>
							Сбросить
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
