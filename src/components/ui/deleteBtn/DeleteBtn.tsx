import { useState } from 'react'
import styles from './DeleteBtn.module.scss'
import { useMessagesStore } from '@/src/store/useMessages.store'
import { useLockBodyScroll } from '@/src/hooks/useLockBodyScroll'
import { TrashIcon } from '@/public/icons'

interface DeleteBtnProps {
	onSuccess?: () => void
}

export default function DeleteBtn() {
	const [isOpen, setIsOpen] = useState(false)

	const selectedIds = useMessagesStore(state => state.selectedIds)
	const deleteMessages = useMessagesStore(state => state.deleteMessages)
	const loading = useMessagesStore(state => state.loading)

	useLockBodyScroll(isOpen)
	const handleDelete = async () => {
		const accessToken = localStorage.getItem('access')
		if (!accessToken) return

		try {
			await deleteMessages(accessToken)
			setIsOpen(false)
		} catch (e) {
			console.error('Ошибка при удалении', e)
		}
	}

	if (selectedIds.length === 0) return null

	return (
		<>
			<button onClick={() => setIsOpen(true)} className={styles.btn}>
				Удалить
				<TrashIcon />
			</button>

			{isOpen && (
				<div className={styles.overlay} onClick={() => setIsOpen(false)}>
					<div
						className={styles.deleteModal}
						onClick={e => e.stopPropagation()}
					>
						<h5>Хотите удалить сообщения?</h5>
						<p>
							Подтвердите удаление сообщения . После удаления она больше не
							будет доступна для использования.
						</p>

						<div className={styles.btns}>
							<button
								className={styles.cancel}
								onClick={() => setIsOpen(false)}
								disabled={loading}
							>
								Отменить
							</button>

							<button
								className={styles.delete}
								onClick={handleDelete}
								disabled={loading}
							>
								{loading ? 'Удаление...' : 'Удалить'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
