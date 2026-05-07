'use client'

import styles from './BaseFilters.module.scss'
import { BaseFiltersProps } from '../types/baseFiltersTypes'
import { useBaseFiltersLogic } from '../hooks/useBaseFiltersLogic'

export default function BaseFilters({ onChange }: BaseFiltersProps) {
	const { active, handleClick, filters } = useBaseFiltersLogic(onChange)

	return (
		<div className={styles.btns}>
			{filters.map(filter => (
				<button
					className={`${styles.btn} ${
						active === filter.value ? styles.active : ''
					}`}
					key={filter.value}
					onClick={() => handleClick(filter.value)}
				>
					{filter.label}
				</button>
			))}
		</div>
	)
}
