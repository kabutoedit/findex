'use client'
import { Message } from '@/src/components/message/Message'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import Filters from '@/src/components/filters/Filters'
import { useState, useMemo } from 'react'

export default function SourcesPage() {
	const [search, setSearch] = useState('')
	const [selectedRange, setSelectedRange] = useState<any>()
	const [refreshTrigger, setRefreshTrigger] = useState(0)

	const [allSources, setAllSources] = useState<string[]>([])
	const [activeSource, setActiveSource] = useState<string | null>(null)

	const formatSourceName = (name: string) => {
		return name.replace(/\.com|\.gov\.kg|\.org|\.ru/gi, '')
	}

	const handleDataLoaded = (messages: any[]) => {
		if (allSources.length === 0) {
			const sources = messages.map(m => m.source).filter(Boolean)
			const unique = Array.from(new Set(sources)) as string[]
			setAllSources(unique)
		}
	}

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar selectedRange={selectedRange} onChange={setSelectedRange} />
				</div>

				<div className={styles.sourceTabs}>
					{allSources.map(src => (
						<button
							key={src}
							className={activeSource === src ? styles.activeTab : styles.tab}
							onClick={() => setActiveSource(src === activeSource ? null : src)}
						>
							{formatSourceName(src)}
						</button>
					))}
				</div>

				<Message
					search={search}
					selectedRange={selectedRange}
					refreshTrigger={refreshTrigger}
					forceSource={activeSource || undefined}
					onDataLoaded={handleDataLoaded}
				/>
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
