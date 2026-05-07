'use client'
import styles from './Filters.module.scss'
import { useEffect } from 'react'
import Search from '@/components/ui/search/ui/Search'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useFiltersLogic } from '../hooks/useFiltersLogic'
import FilterGroup from './FilterGroup'
import { FiltersProps } from '../types/filtersTypes'

export default function Filters({ search, setSearch }: FiltersProps) {
	const { brandID, resetFilters } = useFiltersStore()
	const {
		selected,
		toggle,
		resetInternal,
		applyFilters,
		hasActive,
		isLoading,
		error,
		data,
	} = useFiltersLogic(resetFilters)

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
					title='Города'
					items={data.cities}
					groupKey='cities'
					selected={selected}
					toggle={toggle}
				/>
				<FilterGroup
					title='Страны'
					items={data.countries}
					groupKey='countries'
					selected={selected}
					toggle={toggle}
				/>
				<FilterGroup
					title='Языки'
					items={data.langs}
					groupKey='langs'
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
					items={data.source_types}
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
