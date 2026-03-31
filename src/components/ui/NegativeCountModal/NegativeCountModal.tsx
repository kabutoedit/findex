import React, { useState } from 'react'
import styles from './NegativeCountModal.module.scss'
import { MessageType } from '../../../types/types'
import DetailsModal from '../detailsModal/DetailsModal'

interface Author {
	author: string
	author_url: string
	negative_count: number
	last_negative_at: string
	avatar_url?: string
	messages: MessageType[]
}

interface NegativeCountModalProps {
	author: Author
	isOpen: boolean
	onClose: () => void
}

const formatDateTime = (dateStr: string) => {
	const date = new Date(dateStr)
	const d = date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
	const t = date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	})
	return { date: d, time: t }
}

const getSourceLabel = (url: string | null | undefined) => {
	if (!url) return null
	const s = url.toLowerCase()
	if (s.includes('t.me') || s.includes('telegram')) return 'Telegram'
	if (s.includes('instagram')) return 'Instagram'
	if (s.includes('facebook') || s.includes('fb.com')) return 'Facebook'
	if (s.includes('youtube')) return 'YouTube'
	if (s.includes('vk.com')) return 'ВКонтакте'
	try {
		return new URL(url).hostname.replace('www.', '')
	} catch {
		return null
	}
}

const highlightText = (text: string, search: string): React.ReactNode => {
	if (!search) return text
	const parts = text.split(new RegExp(`(${search})`, 'gi'))
	return parts.map((part, i) =>
		part.toLowerCase() === search.toLowerCase() ? (
			<mark key={i} style={{ background: '#fff3a3', padding: 0 }}>
				{part}
			</mark>
		) : (
			part
		)
	)
}

export default function NegativeCountModal({
	author,
	isOpen,
	onClose,
}: NegativeCountModalProps) {
	const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
		null
	)

	if (!isOpen) return null

	const initials = author.author
		.replace('@', '')
		.split(/[\s._-]/)
		.filter(Boolean)
		.slice(0, 2)
		.map(w => w[0]?.toUpperCase() ?? '')
		.join('')

	return (
		<>
			<div className={styles.overlay} onClick={onClose}>
				<div className={styles.modal} onClick={e => e.stopPropagation()}>
					{/* Author header */}
					<div className={styles.authorRow}>
						<div className={styles.avatar}>
							{author.avatar_url ? (
								<img src={author.avatar_url} alt={author.author} />
							) : (
								<span>{initials || '?'}</span>
							)}
						</div>
						<div className={styles.authorInfo}>
							<span className={styles.authorName}>{author.author}</span>
							<span className={styles.authorSub}>
								Количество негативных сообщений:{' '}
								<strong>{author.negative_count}</strong>
							</span>
						</div>
					</div>

					{/* Messages */}
					<div className={styles.messageList}>
						{author.messages.length === 0 && (
							<p className={styles.empty}>Сообщения не найдены</p>
						)}

						{author.messages.map(msg => {
							const text = msg.text ?? ''
							const isLong = text.length > 160
							const displayText = isLong ? text.slice(0, 160) : text
							const { date, time } = formatDateTime(msg.published_at!)
							const linkUrl = msg.url ?? author.author_url
							const sourceLabel = getSourceLabel(
								msg.source ? 'http://' + msg.source : author.author_url
							)

							return (
								<div key={msg.external_id} className={styles.messageCard}>
									<div className={styles.cardHeader}>
										<span className={styles.datetime}>
											{date} {time}
										</span>
										<div className={styles.cardRight}>
											{linkUrl && (
												<a
													href={linkUrl}
													target='_blank'
													rel='noopener noreferrer'
													className={styles.externalLink}
													aria-label='Открыть источник'
												>
													<svg
														width='15'
														height='15'
														viewBox='0 0 15 15'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															d='M6.65625 0.750001H3.28125C1.88328 0.750001 0.75 1.88327 0.75 3.28124V11.7188C0.75 13.1167 1.88328 14.25 3.28125 14.25H11.7187C13.1167 14.25 14.25 13.1167 14.25 11.7188V8.34371M10.0308 0.750204L14.25 0.75M14.25 0.75V4.54696M14.25 0.75L7.07751 7.92163'
															stroke='#344258'
															strokeWidth='1.5'
															strokeLinecap='round'
															strokeLinejoin='round'
														/>
													</svg>
												</a>
											)}
										</div>
									</div>

									<p className={styles.messageText}>
										{displayText}
										{isLong && (
											<>
												{'... '}
												<a
													className={styles.expandLink}
													onClick={() => setSelectedMessage(msg)}
												>
													Показать полный текст &gt;
												</a>
											</>
										)}
									</p>
								</div>
							)
						})}
					</div>
				</div>
			</div>

			{selectedMessage && (
				<DetailsModal
					selectedMessage={selectedMessage}
					closeModal={() => setSelectedMessage(null)}
					search=''
					highlightText={highlightText}
				/>
			)}
		</>
	)
}
