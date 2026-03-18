'use client'

import { useState } from 'react'
import styles from './Accordion.module.scss'

interface AccordionProps {
	selected: 'day' | 'week' | 'month'
	onChange: (value: 'day' | 'week' | 'month') => void
}

export default function Accordion({ selected, onChange }: AccordionProps) {
	const [open, setOpen] = useState(false)

	const options: { label: string; value: 'day' | 'week' | 'month' }[] = [
		{ label: 'По дням', value: 'day' },
		{ label: 'По неделям', value: 'week' },
		{ label: 'По месяцам', value: 'month' },
	]

	return (
		<div className={styles.dropdown}>
			<div className={styles.header} onClick={() => setOpen(prev => !prev)}>
				{options.find(o => o.value === selected)?.label || 'Выберите'}{' '}
				<svg
					style={open ? { transform: 'rotate(180deg)' } : {}}
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
