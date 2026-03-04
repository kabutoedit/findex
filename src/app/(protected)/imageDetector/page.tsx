'use client'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import Filters from '@/src/components/filters/Filters'
import { useState } from 'react'

export default function imageDetector() {
	const [search, setSearch] = useState('')
	const [selectedRange, setSelectedRange] = useState<any>()

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar selectedRange={selectedRange} onChange={setSelectedRange} />
				</div>

				<h1>В разработке</h1>
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
