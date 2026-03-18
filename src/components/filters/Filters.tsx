'use client'

import { useState, useEffect } from 'react'
import Search from '../ui/search/Search'
import styles from './Filters.module.scss'
import { api } from '@/src/lib/api'
import { useFiltersStore } from '../../store/useMessagesFilters.store'

interface FilterMetadata {
	countries: string[]
	tones: string[]
	sources: string[]
	source_types: string[]
}

type FiltersProps = {
	search: string
	setSearch: (value: string) => void
}

export default function Filters({ search, setSearch }: FiltersProps) {
	const { brandID, setFilters, resetFilters } = useFiltersStore()

	const [metadata, setMetadata] = useState<FilterMetadata>({
		countries: [],
		tones: [],
		sources: [],
		source_types: [],
	})

	const [loading, setLoading] = useState(false)

	const [selected, setSelected] = useState({
		countries: new Set<string>(),
		tone: new Set<string>(),
		source: new Set<string>(),
		sourceType: new Set<string>(),
	})

	useEffect(() => {
		if (!brandID) return

		const fetchFilters = async () => {
			try {
				setLoading(true)

				const { data } = await api.get('/api/messages/filters', {
					params: { brand_id: brandID },
				})

				setMetadata(data)

				setSelected({
					countries: new Set(),
					tone: new Set(),
					source: new Set(),
					sourceType: new Set(),
				})

				resetFilters()
			} catch (err: any) {
				console.error('Ошибка загрузки фильтров', err.response?.data)
			} finally {
				setLoading(false)
			}
		}

		fetchFilters()
	}, [brandID, resetFilters])

	const toggle = (group: keyof typeof selected, value: string) => {
		setSelected(prev => {
			const next = new Set(prev[group])

			if (next.has(value)) next.delete(value)
			else next.add(value)

			return { ...prev, [group]: next }
		})
	}

	const applyFilters = () => {
		setFilters({
			countries: [...selected.countries],
			tone: [...selected.tone],
			source: [...selected.source],
			sourceType: [...selected.sourceType],
		})
	}

	const reset = () => {
		setSelected({
			countries: new Set(),
			tone: new Set(),
			source: new Set(),
			sourceType: new Set(),
		})

		resetFilters()
	}

	const hasActive =
		!!selected.countries.size ||
		!!selected.tone.size ||
		!!selected.source.size ||
		!!selected.sourceType.size

	const renderGroup = (
		title: string,
		items: any[],
		key: keyof typeof selected
	) => {
		if (!items.length) return null

		return (
			<div className={styles.group}>
				<h3 className={styles.title}>{title}</h3>

				{items.map((item, index) => {
					const isObject = typeof item === 'object'

					const value = isObject ? item.value : item
					const label = isObject ? item.label : item

					return (
						<label key={`${value}-${index}`} className={styles.label}>
							<input
								type='checkbox'
								className={styles.checkbox}
								checked={selected[key].has(value)}
								onChange={() => toggle(key, value)}
							/>
							{label}
						</label>
					)
				})}
			</div>
		)
	}

	if (loading) return <div>Загрузка фильтров...</div>

	return (
		<div className={styles.filters}>
			<Search search={search} setSearch={setSearch} />

			<div className={styles.panel}>
				{renderGroup('Страны', metadata.countries, 'countries')}
				{renderGroup('Тональность', metadata.tones, 'tone')}
				{renderGroup('Источники', metadata.sources, 'source')}
				{renderGroup('Типы источников', metadata.source_types, 'sourceType')}

				<div className={styles.btns}>
					<button
						className={`${styles.btn} ${hasActive ? styles.active : ''}`}
						onClick={applyFilters}
					>
						Отфильтровать
					</button>

					{hasActive && (
						<button
							className={`${styles.btn} ${styles.active}`}
							onClick={reset}
						>
							Сбросить
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
