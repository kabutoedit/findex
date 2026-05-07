import { Author, MessageType } from '@/types/types'

export interface AuthorsResponseType {
	items: Author[]
}
export interface FetchAuthorsParams {
	brand_id: number
	from: Date | null
	to: Date | null
}
