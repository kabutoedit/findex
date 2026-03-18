'use client'
import { Message } from '@/src/components/message/Message'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import Filters from '@/src/components/filters/Filters'
import { useState, useMemo } from 'react'

import ExportExel from '@/src/components/ui/exportExel/ExportExel'
import DeleteBtn from '@/src/components/ui/deleteBtn/DeleteBtn'

import {
	TelegramIcon,
	ThreadsIcon,
	TikTokIcon,
	InstagramIcon,
	MineconomIcon,
	RutubeIcon,
	OkIcon,
	VkIcon,
	YouTubeIcon,
} from '@/public/icons'

export default function SourcesPage() {
	const [search, setSearch] = useState('')

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

	const sourceIcons: Record<string, React.ReactNode> = {
		telegram: <TelegramIcon />,
		threads: <ThreadsIcon />,
		tiktok: <TikTokIcon />,
		instagram: <InstagramIcon />,
		mineconom: <MineconomIcon />,
		rutube: <RutubeIcon />,
		ok: <OkIcon />,
		vk: <VkIcon />,
		youtube: <YouTubeIcon />,
	}

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

				<div className={styles.sourceTabs}>
					{allSources.map(src => {
						const key = formatSourceName(src).toLowerCase()
						return (
							<button
								key={src}
								className={activeSource === src ? styles.activeTab : styles.tab}
								onClick={() =>
									setActiveSource(src === activeSource ? null : src)
								}
							>
								{sourceIcons[key] || null}
								{formatSourceName(src)}
							</button>
						)
					})}
				</div>

				<Message
					search={search}
					forceSource={activeSource || undefined}
					onDataLoaded={handleDataLoaded}
				/>
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
