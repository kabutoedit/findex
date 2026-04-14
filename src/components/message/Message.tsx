'use client'
import styles from './Message.module.scss'
import { useState, useEffect, useMemo } from 'react'
import { useMessagesStore } from '@/store/useMessages.store'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { fetchMessages } from '@/app/api/api'
import BaseFilters from '@/components/ui/baseFilters/BaseFilters'
import ToneDropdown from '@/components/ui/toneDropdown/ToneDropdown'
import DetailsModal from '@/components/ui/detailsModal/DetailsModal'
import {
	AudienceIcon,
	RepostIcon,
	LikeIcon,
	EyeIcon,
	CommentIcon,
} from '../icons/icons'
import { MessageType } from '../../types/types'
import { useQuery } from '@tanstack/react-query'

type MessageProps = {
	forceSource?: string
	forceTone?: string
	search: string
	itemsPerPage?: number
	onDataLoaded?: (messages: MessageType[]) => void
}

export function Message({
	forceSource,
	forceTone,
	search,
	itemsPerPage = 30,
	onDataLoaded,
}: MessageProps) {
	const { selectedIds, toggle } = useMessagesStore()
	const {
		countries,
		tone: storeTone,
		source: storeSource,
		sourceType,
		dateRange,
		brandID,
	} = useFiltersStore()

	const [sortBy, setSortBy] = useState<string>('date')
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
		null
	)
	const { refreshTrigger } = useMessagesStore()

	const closeModal = () => setSelectedMessage(null)
	const TEXT_LIMIT = 120

	const messagesQuery = useQuery<MessageType[]>({
		queryKey: [
			'sorting-by',
			brandID,
			search,
			countries,
			storeTone,
			storeSource,
			sourceType,
			dateRange,
			forceSource,
			forceTone,
			refreshTrigger,
		],
		queryFn: () => {
			const params: any = { brand_id: brandID }
			if (search.trim()) params.q = search
			if (countries.length) params.country = countries.join(',')
			if (storeTone.length) params.tone = storeTone.join(',')
			if (storeSource.length) params.source = storeSource.join(',')
			if (sourceType.length) params.source_type = sourceType.join(',')
			if (forceSource) params.source = forceSource
			if (forceTone) params.tone = forceTone
			if (dateRange?.from) {
				const pad = (n: number) => n.toString().padStart(2, '0')
				const formatDate = (d: Date) =>
					`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
				params.from = formatDate(dateRange.from)
				params.to = dateRange.to
					? formatDate(dateRange.to)
					: formatDate(dateRange.from)
			}
			return fetchMessages(params).then(data => {
				return data.items
			})
		},
		enabled: !!brandID,
	})

	const [messages, setMessages] = useState<MessageType[]>([])

	useEffect(() => {
		if (messagesQuery.data) setMessages(messagesQuery.data)
		if (messagesQuery.data && onDataLoaded) onDataLoaded(messagesQuery.data)
	}, [messagesQuery.data, onDataLoaded])

	const processedMessages = useMemo(() => {
		const filtered = messages.filter(msg => {
			const matchesSearch = search
				? msg.text?.toLowerCase().includes(search.toLowerCase()) ||
				  msg.author?.toLowerCase().includes(search.toLowerCase()) ||
				  msg.source?.toLowerCase().includes(search.toLowerCase())
				: true

			const activeRange = dateRange || dateRange
			const matchesDate =
				activeRange?.from && msg.published_at
					? (() => {
							const msgDate = new Date(msg.published_at).getTime()
							const start = new Date(
								activeRange.from.getFullYear(),
								activeRange.from.getMonth(),
								activeRange.from.getDate(),
								0,
								0,
								0,
								0
							).getTime()
							const end = activeRange.to
								? new Date(
										activeRange.to.getFullYear(),
										activeRange.to.getMonth(),
										activeRange.to.getDate(),
										23,
										59,
										59,
										999
								  ).getTime()
								: new Date(
										activeRange.from.getFullYear(),
										activeRange.from.getMonth(),
										activeRange.from.getDate(),
										23,
										59,
										59,
										999
								  ).getTime()
							return msgDate >= start && msgDate <= end
					  })()
					: true

			return matchesSearch && matchesDate
		})

		const copy = [...filtered]
		switch (sortBy) {
			case 'date':
				return copy.sort(
					(a, b) =>
						(new Date(b.published_at || 0).getTime() || 0) -
						(new Date(a.published_at || 0).getTime() || 0)
				)
			case 'likes':
				return copy.sort((a, b) => (b.likes || 0) - (a.likes || 0))
			case 'views':
				return copy.sort((a, b) => (b.views || 0) - (a.views || 0))
			case 'comments':
				return copy.sort((a, b) => (b.comments || 0) - (a.comments || 0))
			case 'engagement':
				return copy.sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
			default:
				return copy
		}
	}, [messages, search, dateRange, sortBy])

	const totalPages = Math.ceil(processedMessages.length / itemsPerPage)
	const currentItems = processedMessages.slice(
		(currentPage - 1) * itemsPerPage,
		(currentPage - 1) * itemsPerPage + itemsPerPage
	)

	useEffect(() => setCurrentPage(1), [search, dateRange, sortBy])

	const highlightText = (text: string, search: string) => {
		if (!search.trim()) return text
		const regex = new RegExp(`(${search})`, 'gi')
		return text.split(regex).map((part, i) =>
			part.toLowerCase() === search.toLowerCase() ? (
				<span key={i} className={styles.highlight}>
					{part}
				</span>
			) : (
				part
			)
		)
	}

	useEffect(() => {
		document.body.style.overflow = selectedMessage ? 'hidden' : 'unset'
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [selectedMessage])

	return (
		<>
			<BaseFilters onChange={setSortBy} />
			<div className={styles.list}>
				{currentItems.map(msg => {
					const isChecked = selectedIds.includes(msg.external_id)
					const text = msg.text || ''

					return (
						<div
							key={msg.external_id}
							className={styles.card}
							style={{
								opacity: selectedIds.length === 0 ? 1 : isChecked ? 1 : 0.8,
								border:
									selectedIds.length === 0
										? '2px solid transparent'
										: isChecked
										? '2px solid #757C87'
										: '2px solid transparent',
								boxShadow:
									selectedIds.length === 0
										? 'none'
										: isChecked
										? 'none'
										: '-5px 6px 8.5px 0px #2E436E0D',
							}}
						>
							<div className={styles.left}>
								<input
									type='checkbox'
									className={styles.checkbox}
									checked={isChecked}
									onChange={() => toggle(msg.external_id)}
								/>
							</div>
							<div className={styles.content}>
								<div className={styles.header}>
									<img
										src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lvjjRAVDQ-nBDq_4dy1xCyRjjDaHV-Tqcw&s'
										alt='profilePhoto'
									/>
									<div>
										<div className={styles.nameBlock}>
											<a href={msg.author_url} className={styles.name}>
												{msg.author}
											</a>
											<div className={styles.audience}>
												<AudienceIcon />
												{msg.audience || 0}
											</div>
										</div>

										<span className={styles.meta}>
											<a href={msg.url || '#'} className={styles.link}>
												{msg.source}
											</a>
											<p>{msg.message_type}</p>
											<p className={styles.date}>
												{msg.published_at
													? new Date(msg.published_at).toLocaleString('ru-RU', {
															day: '2-digit',
															month: '2-digit',
															year: 'numeric',
															hour: '2-digit',
															minute: '2-digit',
													  })
													: ''}
											</p>
										</span>
									</div>
								</div>

								<p className={styles.text}>
									{highlightText(
										text.slice(0, TEXT_LIMIT) +
											(text.length > TEXT_LIMIT ? '...' : ''),
										search
									)}

									{text.length > TEXT_LIMIT && (
										<span
											className={styles.more}
											onClick={() => setSelectedMessage(msg)}
										>
											Показать полный текст
										</span>
									)}
								</p>

								<div className={styles.statistics}>
									<div>
										<RepostIcon /> {msg.reposts || 0}
									</div>
									<div>
										<LikeIcon /> {msg.likes || 0}
									</div>
									<div>
										<EyeIcon /> {msg.views || 0}
									</div>
									<div>
										<CommentIcon /> {msg.comments || 0}
									</div>
								</div>
							</div>
							<div className={`${styles.status} ${styles[msg.tone || '']}`} />

							<div className={styles.emotion}>
								<ToneDropdown
									tone={msg.tone}
									externalId={msg.external_id}
									onToneChange={(id, newTone) =>
										setMessages(prev =>
											prev.map(m =>
												m.external_id === id ? { ...m, tone: newTone } : m
											)
										)
									}
								/>
							</div>
						</div>
					)
				})}
			</div>

			<div className={styles.pagination}>
				<button
					disabled={currentPage === 1}
					onClick={() => setCurrentPage(p => p - 1)}
				>
					{'<'}
				</button>
				{Array.from({ length: totalPages }, (_, i) => (
					<button
						key={i + 1}
						className={currentPage === i + 1 ? styles.active : ''}
						onClick={() => setCurrentPage(i + 1)}
					>
						{i + 1}
					</button>
				))}
				<button
					disabled={currentPage === totalPages}
					onClick={() => setCurrentPage(p => p + 1)}
				>
					{'>'}
				</button>
			</div>

			<DetailsModal
				selectedMessage={selectedMessage}
				closeModal={closeModal}
				search={search}
				highlightText={highlightText}
			/>
		</>
	)
}
