import styles from './DeleteBtn.module.scss'
import { TrashIcon } from '@/components/icons/icons'
import { useDeleteBtnLogic } from '../hooks/useDeleteBtnLogic'

export default function DeleteBtn() {
	const { isOpen, setIsOpen, selectedIds, handleDelete, loading } =
		useDeleteBtnLogic()

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
