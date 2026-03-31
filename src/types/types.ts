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

export interface Author {
	author: string
	author_url: string
	negative_count: number
	last_negative_at: string
	avatar_url?: string
	messages: MessageType[]
}

export interface SeriesPoint {
	displayDate: string
	negative_count: number
	date: string
	change_percent?: number
	isFake?: boolean
	kind?: 'actual' | 'predicted'
}

export interface SeriesResponseType {
	points: {
		bucket_start: string
		negative_count?: number
		count?: number
		delta_percent?: number
		bucket_label: string
		kind?: 'actual' | 'predicted'
	}[]
}

export interface SortingOptions {
	available_groupings: {
		value: string
		label: string
	}[]
}
