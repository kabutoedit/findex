'use client'
import styles from '../style.module.scss'
import { useState } from 'react'
import { Message } from '@/components/message/Message'
import Calendar from '@/components/ui/calendar/Calendar'
import DeleteBtn from '@/components/ui/deleteBtn/DeleteBtn'
import Filters from '@/components/filters/ui/Filters'
import ExportExel from '@/components/ui/exportExel/ExportExel'

export default function Home() {
	const [search, setSearch] = useState('')

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar />

					<div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
						<ExportExel />
						<DeleteBtn />
					</div>
				</div>

				<Message search={search} />
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
