'use client'
import styles from './Message.module.scss'
import { useState, useEffect } from 'react'
import { useMessagesStore } from '@/store/useMessages.store'
import { MessageType } from '@/types/types'
import { useMessageLogic } from '../hooks/useMessageLogic'
import { formatDisplayDate } from '../utils/messages.helpers'

import BaseFilters from '@/components/ui/baseFilters/ui/BaseFilters'
import ToneDropdown from '@/components/ui/toneDropdown/ui/ToneDropdown'
import DetailsModal from '@/components/ui/detailsModal/ui/DetailsModal'
import {
	AudienceIcon,
	RepostIcon,
	LikeIcon,
	EyeIcon,
	CommentIcon,
} from '@/components/icons/icons'
import { highlightText } from '@/utils/highlightText'
import { MessageProps } from '../types/messagesTypes'

export default function Message({
	forceSource,
	forceTone,
	search,
	itemsPerPage = 30,
	onDataLoaded,
}: MessageProps) {
	const { selectedIds, toggle } = useMessagesStore()
	const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
		null
	)

	const {
		currentItems,
		isLoading,
		totalPages,
		currentPage,
		setCurrentPage,
		setSortBy,
		handleToneChange,
	} = useMessageLogic({ search, itemsPerPage, forceSource, forceTone })

	useEffect(() => {
		if (!isLoading && onDataLoaded) onDataLoaded(currentItems)
	}, [currentItems, isLoading, onDataLoaded])

	useEffect(() => {
		document.body.style.overflow = selectedMessage ? 'hidden' : 'unset'
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [selectedMessage])

	if (isLoading) return <div className={styles.loader}>Загрузка...</div>

	return (
		<>
			<BaseFilters onChange={setSortBy} />
			<div className={styles.list}>
				{currentItems.map(msg => {
					const isChecked = selectedIds.includes(msg.external_id)
					return (
						<div
							key={msg.external_id}
							className={styles.card}
							style={{
								opacity: selectedIds.length === 0 || isChecked ? 1 : 0.8,
								border: isChecked
									? '2px solid #757C87'
									: '2px solid transparent',
							}}
						>
							<div className={styles.left}>
								<input
									type='checkbox'
									checked={isChecked}
									onChange={() => toggle(msg.external_id)}
								/>
							</div>
							<div className={styles.content}>
								<div className={styles.header}>
									<img
										src={
											msg.author_url || 'https://encrypted-tbn0.gstatic.com...'
										}
										alt='profile'
									/>
									<div>
										<div className={styles.nameBlock}>
											<a href={msg.author_url} className={styles.name}>
												{msg.author}
											</a>
											<div className={styles.audience}>
												<AudienceIcon /> {msg.audience || 0}
											</div>
										</div>
										<span className={styles.meta}>
											<a href={msg.url || '#'} className={styles.link}>
												{msg.source}
											</a>
											<p>{msg.message_type}</p>
											<p className={styles.date}>
												{formatDisplayDate(msg?.published_at ?? '')}
											</p>
										</span>
									</div>
								</div>
								<p className={styles.text}>
									{highlightText(
										msg.text?.slice(0, 120) +
											((msg?.text?.length ?? 0) > 120 ? '...' : ''),
										search
									)}
									{(msg?.text?.length ?? 0) > 120 && (
										<span
											className={styles.more}
											onClick={() => setSelectedMessage(msg)}
										>
											Показать текст
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
									onToneChange={handleToneChange}
								/>
							</div>
						</div>
					)
				})}
			</div>

			{totalPages > 1 && (
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
			)}

			<DetailsModal
				selectedMessage={selectedMessage}
				closeModal={() => setSelectedMessage(null)}
				search={search}
				highlightText={highlightText}
			/>
		</>
	)
}
