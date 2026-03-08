'use client'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import Filters from '@/src/components/filters/Filters'
import { useState } from 'react'
// import DeleteBtn from '@/src/components/ui/deleteBtn/DeleteBtn'

export default function imageDetector() {
	const [search, setSearch] = useState('')

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar />
					{/* <DeleteBtn /> */}
				</div>

				<h1>В разработке</h1>
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
