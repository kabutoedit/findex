'use client'
import { Message } from '@/src/components/message/Message'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import DeleteBtn from '@/src/components/ui/deleteBtn/DeleteBtn'
import Filters from '@/src/components/filters/Filters'
import { useState } from 'react'
import ExportExel from '@/src/components/ui/exportExel/ExportExel'

type DateRangeOrSingle =
	| {
			from: Date
			to?: Date
	  }
	| undefined

export default function Home() {
	const [search, setSearch] = useState('')
	const [selectedRange, setSelectedRange] = useState<DateRangeOrSingle>()

	const [refreshTrigger, setRefreshTrigger] = useState(0)

	const handleRefresh = () => setRefreshTrigger(prev => prev + 1)

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar selectedRange={selectedRange} onChange={setSelectedRange} />

					<div style={{ display: 'flex', gap: '10px' }}>
						<DeleteBtn onSuccess={handleRefresh} />
						<ExportExel />
					</div>
				</div>

				<Message
					search={search}
					selectedRange={selectedRange}
					refreshTrigger={refreshTrigger}
				/>
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
