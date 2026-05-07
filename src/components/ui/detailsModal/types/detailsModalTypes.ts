import { MessageType } from '@/types/types'

export interface DetailsModalProps {
	selectedMessage: MessageType | null
	closeModal: () => void
	search: string
	highlightText: (text: string, search: string) => React.ReactNode
}
