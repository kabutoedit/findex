'use client'
import styles from '../style.module.scss'
import { useState } from 'react'
import Message from '@/components/message/ui/Message'
import Calendar from '@/components/ui/calendar/ui/Calendar'
import DeleteBtn from '@/components/ui/deleteBtn/ui/DeleteBtn'
import Filters from '@/components/filters/ui/Filters'
import ExportExcel from '@/components/ui/exportExcel/ui/ExportExcel'

export default function Home() {
	const [search, setSearch] = useState('')

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar />

					<div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
						<ExportExcel />
						<DeleteBtn />
					</div>
				</div>

				<Message search={search} />
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
