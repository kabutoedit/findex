import { MessageType } from '@/types/types'

export interface FetchMessagesParams {
	brand_id: number
	q?: string
	country?: string
	tone?: string
	source?: string
	source_type?: string
	from?: string
	to?: string
}

export interface MessagesResponseType {
	items: MessageType[]
	total: number
}

export interface MessageProps {
	forceSource?: string
	forceTone?: string
	search: string
	itemsPerPage?: number
	onDataLoaded?: (messages: MessageType[]) => void
}

export interface UseMessageLogicProps {
	search: string
	itemsPerPage: number
	forceSource?: string
	forceTone?: string
}
