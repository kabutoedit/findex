import { useState } from 'react'
import styles from './DeleteBtn.module.scss'
import { useMessagesStore } from '@/src/store/useMessages.store'
import { useLockBodyScroll } from '@/src/hooks/useLockBodyScroll'

type DeleteBtnProps = {
	onSuccess: () => void
}

export default function DeleteBtn({ onSuccess }: DeleteBtnProps) {
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

			if (onSuccess) onSuccess()
		} catch (e) {
			console.error('Ошибка при удалении', e)
		}
	}

	if (selectedIds.length === 0) return null

	return (
		<>
			<button onClick={() => setIsOpen(true)} className={styles.btn}>
				Удалить
				<svg
					width='15'
					height='16'
					viewBox='0 0 15 16'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M5.83333 12.8C6.05435 12.8 6.26631 12.7157 6.42259 12.5657C6.57887 12.4157 6.66667 12.2122 6.66667 12V7.2C6.66667 6.98783 6.57887 6.78434 6.42259 6.63432C6.26631 6.48429 6.05435 6.4 5.83333 6.4C5.61232 6.4 5.40036 6.48429 5.24408 6.63432C5.0878 6.78434 5 6.98783 5 7.2V12C5 12.2122 5.0878 12.4157 5.24408 12.5657C5.40036 12.7157 5.61232 12.8 5.83333 12.8ZM14.1667 3.2H10.8333V2.4C10.8333 1.76348 10.5699 1.15303 10.1011 0.702944C9.63226 0.252856 8.99637 0 8.33333 0H6.66667C6.00363 0 5.36774 0.252856 4.8989 0.702944C4.43006 1.15303 4.16667 1.76348 4.16667 2.4V3.2H0.833333C0.61232 3.2 0.400358 3.28429 0.244078 3.43431C0.0877973 3.58434 0 3.78783 0 4C0 4.21217 0.0877973 4.41566 0.244078 4.56569C0.400358 4.71571 0.61232 4.8 0.833333 4.8H1.66667V13.6C1.66667 14.2365 1.93006 14.847 2.3989 15.2971C2.86774 15.7471 3.50363 16 4.16667 16H10.8333C11.4964 16 12.1323 15.7471 12.6011 15.2971C13.0699 14.847 13.3333 14.2365 13.3333 13.6V4.8H14.1667C14.3877 4.8 14.5996 4.71571 14.7559 4.56569C14.9122 4.41566 15 4.21217 15 4C15 3.78783 14.9122 3.58434 14.7559 3.43431C14.5996 3.28429 14.3877 3.2 14.1667 3.2ZM5.83333 2.4C5.83333 2.18783 5.92113 1.98434 6.07741 1.83431C6.23369 1.68429 6.44565 1.6 6.66667 1.6H8.33333C8.55435 1.6 8.76631 1.68429 8.92259 1.83431C9.07887 1.98434 9.16667 2.18783 9.16667 2.4V3.2H5.83333V2.4ZM11.6667 13.6C11.6667 13.8122 11.5789 14.0157 11.4226 14.1657C11.2663 14.3157 11.0543 14.4 10.8333 14.4H4.16667C3.94565 14.4 3.73369 14.3157 3.57741 14.1657C3.42113 14.0157 3.33333 13.8122 3.33333 13.6V4.8H11.6667V13.6ZM9.16667 12.8C9.38768 12.8 9.59964 12.7157 9.75592 12.5657C9.9122 12.4157 10 12.2122 10 12V7.2C10 6.98783 9.9122 6.78434 9.75592 6.63432C9.59964 6.48429 9.38768 6.4 9.16667 6.4C8.94565 6.4 8.73369 6.48429 8.57741 6.63432C8.42113 6.78434 8.33333 6.98783 8.33333 7.2V12C8.33333 12.2122 8.42113 12.4157 8.57741 12.5657C8.73369 12.7157 8.94565 12.8 9.16667 12.8Z'
						fill='white'
					/>
				</svg>
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
