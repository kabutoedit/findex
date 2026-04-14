import React from 'react'
import { useMessagesStore } from '@/store/useMessages.store'
import { MessageType } from '@/types/types'
import styles from './DetailsModal.module.scss'
import {
	EyeIcon,
	LikeIcon,
	NegativeSVG,
	NeutralSVG,
	PositiveSVG,
	RepostIcon,
	TelegramIcon,
	InstagramIcon,
	VkIcon,
	OkIcon,
	RutubeIcon,
	TikTokIcon,
	ThreadsIcon,
	YouTubeIcon,
} from '@/components/icons/icons'

type DetailsModalProps = {
	selectedMessage: MessageType | null
	closeModal: () => void
	search: string
	highlightText: (text: string, search: string) => React.ReactNode
}

export default function DetailsModal({
	selectedMessage,
	closeModal,
	search,
	highlightText,
}: DetailsModalProps) {
	if (!selectedMessage) return null
	console.log(selectedMessage)

	const deleteOne = useMessagesStore(state => state.deleteOne)
	const updateTone = useMessagesStore(state => state.updateTone)

	const handleDelete = async () => {
		const accessToken = localStorage.getItem('access')
		if (!accessToken || !selectedMessage) return

		try {
			await deleteOne(accessToken, selectedMessage.external_id)
			closeModal()
		} catch (e) {
			console.error('Ошибка при удалении', e)
		}
	}

	const handleToneChange = async (newTone: MessageType['tone']) => {
		if (!selectedMessage?.external_id) return

		try {
			await updateTone(selectedMessage.external_id, newTone)
			closeModal()
		} catch (err) {
			console.error('Ошибка при смене тональности', err)
		}
	}

	console.log(selectedMessage.tone)

	const getSourceIcon = (source: string | null | undefined) => {
		const s = source?.toLowerCase() || ''

		if (s.includes('telegram') || s.includes('t.me')) return <TelegramIcon />
		if (s.includes('instagram')) return <InstagramIcon />
		if (s.includes('youtube')) return <YouTubeIcon />
		if (s.includes('ok')) return <OkIcon />
		if (s.includes('threads')) return <ThreadsIcon />
		if (s.includes('tiktok')) return <TikTokIcon />
		if (s.includes('rutube')) return <RutubeIcon />
		if (s.includes('vk') || s.includes('vkontakte')) return <VkIcon />

		return <TelegramIcon />
	}

	return (
		<div className={styles.modalOverlay} onClick={closeModal}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<div className={styles.sourceInfo}>
						{getSourceIcon(selectedMessage.source)}
						<a
							style={{ textDecoration: 'none' }}
							href={selectedMessage.author_url}
							className={styles.sourceName}
						>
							{selectedMessage.source}
						</a>
						<span className={styles.msgType}>
							{selectedMessage.message_type || 'сообщение'}
						</span>
					</div>
					<div className={styles.dateInfo}>
						{selectedMessage.published_at &&
							new Date(selectedMessage.published_at).toLocaleString('ru-RU')}
						<span></span>
						Текст сохранён{' '}
						{selectedMessage.published_at &&
							new Date(selectedMessage.published_at).toLocaleString('ru-RU')}
					</div>
				</div>

				<div className={styles.modalBody}>
					{selectedMessage.published_at &&
						new Date(selectedMessage.published_at).toLocaleString('ru-RU')}

					<div className={styles.fullText}>
						{highlightText(selectedMessage.text || '', search)}
					</div>
				</div>

				<div className={styles.moreInfo}>
					<div className={styles.actions}>
						<div className={styles.action}>
							<RepostIcon />
							<p>{selectedMessage.reposts}</p>
						</div>
						<div className={styles.action}>
							<LikeIcon />
							<p>{selectedMessage.likes}</p>
						</div>
						<div className={styles.action}>
							<EyeIcon />
							<p>{selectedMessage.views}</p>
						</div>
					</div>

					<div className={styles.changes}>
						<div className={styles.changes}>
							<div
								style={{
									cursor: 'pointer',
									transition: 'all 0.2s ease',
									transform:
										selectedMessage.tone === 'позитив'
											? 'scale(1.3)'
											: 'scale(1)',
									opacity: selectedMessage.tone === 'позитив' ? 1 : 0.5,
								}}
								onClick={() => handleToneChange('позитив')}
							>
								<PositiveSVG />
							</div>

							<div
								style={{
									cursor: 'pointer',
									transition: 'all 0.2s ease',
									transform:
										selectedMessage.tone === 'нейтрально'
											? 'scale(1.3)'
											: 'scale(1)',
									opacity: selectedMessage.tone === 'нейтрально' ? 1 : 0.5,
								}}
								onClick={() => handleToneChange('нейтрально')}
							>
								<NeutralSVG />
							</div>

							<div
								style={{
									cursor: 'pointer',
									transition: 'all 0.2s ease',
									transform:
										selectedMessage.tone === 'негатив'
											? 'scale(1.3)'
											: 'scale(1)',
									opacity: selectedMessage.tone === 'негатив' ? 1 : 0.5,
								}}
								onClick={() => handleToneChange('негатив')}
							>
								<NegativeSVG />
							</div>

							<svg
								onClick={handleDelete}
								width='17'
								height='17'
								viewBox='0 0 17 17'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M15.75 4.27034C12.9788 3.97358 10.1822 3.8252 7.39831 3.8252C5.74576 3.8252 4.09322 3.91962 2.45339 4.09498L0.75 4.27034'
									stroke='#292D32'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M5.33984 3.38039L5.51781 2.22032C5.64493 1.38399 5.74661 0.75 7.15763 0.75H9.34408C10.7551 0.75 10.8568 1.41097 10.9839 2.22032L11.1619 3.36691'
									stroke='#292D32'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M13.9592 4.37842L13.4126 13.2813C13.3236 14.6707 13.2474 15.7498 10.9211 15.7498H5.56939C3.24311 15.7498 3.16683 14.6707 3.07785 13.2813L2.53125 4.37842'
									stroke='#292D32'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className={styles.modalFooter}>
					<p>
						<span className={styles.span}>Оригинал сообщения:</span>{' '}
						<a
							style={{ textDecoration: 'none' }}
							href={selectedMessage.url || '#'}
							target='_blank'
							rel='noreferrer'
						>
							{selectedMessage.url}
						</a>
					</p>
					<p>
						<span className={styles.span}>Сила тональности:</span>
						{selectedMessage.tone === 'позитив'
							? ' позитив — 1'
							: ' позитив — 0'}
						,
						{selectedMessage.tone === 'негатив'
							? ' негатив — 1'
							: ' негатив — 0'}
						.
					</p>
				</div>
			</div>
		</div>
	)
}
