'use client'
import Calendar from '@/components/ui/calendar/ui/Calendar'
import styles from '../style.module.scss'
import Chat from '@/components/ui/chat/ui/Chat'
import Filters from '@/components/filters'
import { useState } from 'react'

export default function AiAssistant() {
	const [search, setSearch] = useState('')
	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar />
				</div>
				<Chat />
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
