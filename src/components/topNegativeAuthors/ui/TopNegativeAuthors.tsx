'use client'
import styles from './TopNegativeAuthors.module.scss'
import AccordionSort from '@/components/ui/authorsSorting/ui/AuthorsSorting'
import NegativeCountModal from '@/components/ui/negativeCountModal/ui/NegativeCountModal'
import { useNegativeAuthorsLogic } from '../hooks/useNegativeAuthorsLogic'

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
	if (s.includes('threads.com')) return 'Threads'

	try {
		const domain = new URL(url).hostname.replace('www.', '')
		return domain
	} catch {
		return 'Перейти'
	}
}

export default function TopNegativeAuthors() {
	const { sortedAuthors, sort, setSort, selectedAuthor, setSelectedAuthor } =
		useNegativeAuthorsLogic()

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
