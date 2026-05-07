import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useMessagesStore } from '@/store/useMessages.store'
import { useState } from 'react'

export const useDeleteBtnLogic = () => {
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
	return {
		isOpen,
		setIsOpen,
		selectedIds,
		loading,
		handleDelete,
	}
}
