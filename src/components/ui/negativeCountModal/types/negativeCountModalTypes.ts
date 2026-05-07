import { Author } from '@/types/types'

export interface NegativeCountModalProps {
	author: Author
	isOpen: boolean
	onClose: () => void
}
