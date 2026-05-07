import { useMessagesStore } from '@/store/useMessages.store'
import { DetailsModalProps } from '../types/detailsModalTypes'
import { MessageType } from '@/types/types'

export const useDetailsModalLogic = ({ selectedMessage, closeModal }: any) => {
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

	return {
		handleDelete,
		handleToneChange,
	}
}
