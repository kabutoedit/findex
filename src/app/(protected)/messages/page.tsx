'use client'
import { Message } from '@/src/components/message/Message'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import DeleteBtn from '@/src/components/ui/deleteBtn/DeleteBtn'
import Filters from '@/src/components/filters/Filters'
import { useState } from 'react'
import ExportExel from '@/src/components/ui/exportExel/ExportExel'

export default function Home() {
	const [search, setSearch] = useState('')

	const [refreshTrigger, setRefreshTrigger] = useState(0)

	const handleRefresh = () => setRefreshTrigger(prev => prev + 1)

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar />

					<div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
						<ExportExel />
						<DeleteBtn onSuccess={handleRefresh} />
					</div>
				</div>

				<Message search={search} refreshTrigger={refreshTrigger} />
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
