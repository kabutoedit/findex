'use client'

import styles from './AuthorsSorting.module.scss'
import { AuthorsSortProps } from '../types/authorsSortingTypes'
import { useAuthorsSortingLogic } from '../hooks/useAuthorsSortingLogic'

export default function AccordionSort({
	selected,
	onChange,
}: AuthorsSortProps) {
	const { open, setOpen, options } = useAuthorsSortingLogic()
	return (
		<div className={styles.dropdown}>
			<div className={styles.header} onClick={() => setOpen(prev => !prev)}>
				<p>Сортировка:</p>
				{options.find(o => o.value === selected)?.label || 'Выберите'}{' '}
				<svg
					width='19'
					height='11'
					viewBox='0 0 19 11'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M1 1L9.5 9L18 1'
						stroke='#767575'
						strokeWidth='2'
						strokeLinecap='round'
					/>
				</svg>
			</div>

			{open && (
				<div className={styles.options}>
					{options.map(option => (
						<div
							key={option.value}
							className={`${styles.option} ${
								selected === option.value ? styles.active : ''
							}`}
							onClick={() => {
								onChange(option.value)
								setOpen(false)
							}}
						>
							{option.label}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
