import styles from './NegativeCountModal.module.scss'
import DetailsModal from '@/components/ui/detailsModal/ui/DetailsModal'
import { highlightText } from '@/utils/highlightText'
import { NegativeCountModalProps } from '../types/negativeCountModalTypes'
import { useNegativeCountModalLogic } from '../hooks/useNegativeCountModalLogic'

export default function NegativeCountModal({
	author,
	isOpen,
	onClose,
}: NegativeCountModalProps) {
	const { formatDateTime, selectedMessage, setSelectedMessage, initials } =
		useNegativeCountModalLogic(author)

	if (!isOpen) return null

	return (
		<>
			<div className={styles.overlay} onClick={onClose}>
				<div className={styles.modal} onClick={e => e.stopPropagation()}>
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
