import styles from './Filters.module.scss'

interface FilterGroupProps {
	title: string
	items: any[]
	groupKey: string
	selected: Record<string, Set<string>>
	toggle: (group: any, value: string) => void
}

export default function FilterGroup({
	title,
	items,
	groupKey,
	selected,
	toggle,
}: FilterGroupProps) {
	if (!items?.length) return null

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
							checked={selected[groupKey].has(value)}
							onChange={() => toggle(groupKey, value)}
						/>
						{label}
					</label>
				)
			})}
		</div>
	)
}
