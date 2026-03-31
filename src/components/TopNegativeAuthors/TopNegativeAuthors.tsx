// 'use client'
// import { useState } from 'react'
// import styles from './TopNegativeAuthors.module.scss'
// import AccordionSort from '../ui/accordionSort/AccordionSort'
// import { MessageType } from '../../types/types'
// import NegativeCountModal from '../NegativeCountModal/NegativeCountModal'

// interface Author {
// 	author: string
// 	author_url: string
// 	negative_count: number
// 	last_negative_at: string
// 	avatar_url?: string
// 	messages: MessageType
// }

// const formatLastActivity = (dateStr: string) => {
// 	const date = new Date(dateStr)
// 	return date
// 		.toLocaleDateString('ru-RU', {
// 			day: 'numeric',
// 			month: 'short',
// 			year: 'numeric',
// 		})
// 		.replace('г.', '')
// 		.trim()
// }

// const getSourceLabel = (url: string | null | undefined) => {
// 	if (!url) return 'Источник'
// 	const s = url.toLowerCase()

// 	if (s.includes('t.me') || s.includes('telegram')) return 'Telegram'
// 	if (s.includes('instagram')) return 'Instagram'
// 	if (s.includes('facebook') || s.includes('fb.com')) return 'Facebook'
// 	if (s.includes('youtube')) return 'YouTube'
// 	if (s.includes('vk.com')) return 'ВКонтакте'

// 	try {
// 		const domain = new URL(url).hostname.replace('www.', '')
// 		return domain
// 	} catch {
// 		return 'Перейти'
// 	}
// }

// export default function TopNegativeAuthors({ authors }: { authors: Author[] }) {
// 	const [sort, setSort] = useState<'quantity' | 'date'>('quantity')
// 	const [isOpen, setIsOpen] = useState(true)

// 	console.log(authors)

// 	return (
// 		<div className={styles.authorsSection}>
// 			<div className={styles.authorsHeader}>
// 				<h2 className={styles.authorsTitle}>
// 					Топ авторов негативных сообщений
// 				</h2>
// 				<AccordionSort selected={sort} onChange={setSort} />
// 			</div>

// 			<div className={styles.authorsGrid}>
// 				{authors.map((author, idx) => (
// 					<div key={idx} className={styles.authorCard}>
// 						<div className={styles.upside}>
// 							<div className={styles.avatarWrapper}>
// 								<img
// 									src={
// 										author.avatar_url ||
// 										`https://i.pravatar.cc/128?u=${author.author}`
// 									}
// 									alt={author.author}
// 									className={styles.avatar}
// 								/>
// 							</div>
// 							<div className={styles.namePlatform}>
// 								<strong>{author.author}</strong>
// 								<a
// 									href={author.author_url}
// 									target='_blank'
// 									rel='noreferrer'
// 									style={{ cursor: 'pointer', textDecoration: 'none' }}
// 									className={styles.authorLink}
// 								>
// 									{getSourceLabel(author.author_url)}
// 								</a>
// 							</div>
// 						</div>
// 						<div className={styles.authorInfo}>
// 							<div className={styles.stats}>
// 								Количество негативных сообщений:{' '}
// 								<strong>{author.negative_count}</strong>
// 							</div>
// 							<div className={styles.stats}>
// 								Последняя дата активности:{' '}
// 								<strong>{formatLastActivity(author.last_negative_at)}</strong>
// 							</div>
// 						</div>
// 						<button
// 							onClick={() => setIsOpen(!open)}
// 							className={styles.expandBtn}
// 						>
// 							Развернуть{' '}
// 							<svg
// 								width='11'
// 								height='15'
// 								viewBox='0 0 11 15'
// 								fill='none'
// 								xmlns='http://www.w3.org/2000/svg'
// 							>
// 								<path
// 									d='M1 14L9 7.5L1 1'
// 									stroke='black'
// 									strokeOpacity='0.9'
// 									strokeWidth='2'
// 									strokeLinecap='round'
// 								/>
// 							</svg>
// 						</button>
// 					</div>
// 				))}
// 			</div>
// 			<NegativeCountModal isOpen={isOpen} />
// 		</div>
// 	)
// }

'use client'
import { useState } from 'react'
import styles from './TopNegativeAuthors.module.scss'
import AccordionSort from '../ui/accordionSort/AccordionSort'
import { MessageType } from '../../types/types'
import NegativeCountModal from '../ui/NegativeCountModal/NegativeCountModal'
import { Author } from '../../types/types'

const formatLastActivity = (dateStr: string) => {
	const date = new Date(dateStr)
	return date
		.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		})
		.replace('г.', '')
		.trim()
}

const getSourceLabel = (url: string | null | undefined) => {
	if (!url) return 'Источник'
	const s = url.toLowerCase()

	if (s.includes('t.me') || s.includes('telegram')) return 'Telegram'
	if (s.includes('instagram')) return 'Instagram'
	if (s.includes('facebook') || s.includes('fb.com')) return 'Facebook'
	if (s.includes('youtube')) return 'YouTube'
	if (s.includes('vk.com')) return 'ВКонтакте'

	try {
		const domain = new URL(url).hostname.replace('www.', '')
		return domain
	} catch {
		return 'Перейти'
	}
}

export default function TopNegativeAuthors({ authors }: { authors: Author[] }) {
	const [sort, setSort] = useState<'quantity' | 'date'>('quantity')
	const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)

	const sortedAuthors = [...authors].sort((a, b) => {
		if (sort === 'quantity') {
			return b.negative_count - a.negative_count
		}

		const dateA = new Date(a.last_negative_at).getTime()
		const dateB = new Date(b.last_negative_at).getTime()

		return dateB - dateA
	})

	return (
		<div className={styles.authorsSection}>
			<div className={styles.authorsHeader}>
				<h2 className={styles.authorsTitle}>
					Топ авторов негативных сообщений
				</h2>
				<AccordionSort selected={sort} onChange={setSort} />
			</div>

			<div className={styles.authorsGrid}>
				{sortedAuthors.map((author, idx) => (
					<div key={idx} className={styles.authorCard}>
						<div className={styles.upside}>
							<div className={styles.avatarWrapper}>
								<img
									src={
										author.avatar_url ||
										`https://i.pravatar.cc/128?u=${author.author}`
									}
									alt={author.author}
									className={styles.avatar}
								/>
							</div>
							<div className={styles.namePlatform}>
								<strong>{author.author}</strong>
								<a
									href={author.author_url}
									target='_blank'
									rel='noreferrer'
									style={{ cursor: 'pointer', textDecoration: 'none' }}
									className={styles.authorLink}
								>
									{getSourceLabel(author.author_url)}
								</a>
							</div>
						</div>
						<div className={styles.authorInfo}>
							<div className={styles.stats}>
								Количество негативных сообщений:{' '}
								<strong>{author.negative_count}</strong>
							</div>
							<div className={styles.stats}>
								Последняя дата активности:{' '}
								<strong>{formatLastActivity(author.last_negative_at)}</strong>
							</div>
						</div>
						<button
							onClick={() => setSelectedAuthor(author)}
							className={styles.expandBtn}
							style={{ cursor: 'pointer' }}
						>
							Развернуть{' '}
							<svg
								width='11'
								height='15'
								viewBox='0 0 11 15'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M1 14L9 7.5L1 1'
									stroke='black'
									strokeOpacity='0.9'
									strokeWidth='2'
									strokeLinecap='round'
								/>
							</svg>
						</button>
					</div>
				))}
			</div>

			{selectedAuthor && (
				<NegativeCountModal
					author={selectedAuthor}
					isOpen={true}
					onClose={() => setSelectedAuthor(null)}
				/>
			)}
		</div>
	)
}
