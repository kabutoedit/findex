export type MessageType = {
	audience?: number
	published_at?: string | null
	source?: string | null
	author?: string | null
	author_url?: string
	engagement?: number
	text?: string | null
	url?: string | null
	tone?: 'позитив' | 'нейтрально' | 'негатив' | null
	external_id: string
	reposts?: number
	likes?: number
	comments?: number
	views?: number
	message_type?: string
}
