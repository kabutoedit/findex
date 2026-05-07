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

// под вопросом
export interface SortingOptions {
	availableGroupings: {
		value: string
		label: string
	}[]
}

export interface MeData {}

export type Tariff = 'basic' | 'standard' | 'vip' | ''

export interface ProfileData {
	avatar_url: string | null
	first_name: string
	last_name: string
	subscription_plan: Tariff
	full_name: string
}

export interface FiltersState {
	countries: string[]
	tones: string[]
	sources: string[]
	sourceTypes: string[]
	brandID: number
	tariff: Tariff

	dateRange: {
		from: Date | null
		to: Date | null
	}

	setFilters: (filters: Partial<FiltersState>) => void
	setDateRange: (range: { from: Date | null; to: Date | null }) => void
	resetFilters: () => void
	setBrandID: (brandID: number) => void
	setTariff: (tariff: Tariff) => void
}

export interface Author {
	author: string
	author_url: string
	negative_count: number
	last_negative_at: string
	avatar_url?: string
	messages: MessageType[]
}

export interface MessagesState {
	selectedIds: string[]
	loading: boolean
	error: string | null
	refreshTrigger: number

	toggle: (id: string) => void
	clearSelection: () => void
	triggerRefresh: () => void
	deleteMessages: (accessToken: string) => Promise<void>
	deleteOne: (accessToken: string, id: string) => Promise<void>
	updateTone: (
		externalId: string,
		newTone: MessageType['tone']
	) => Promise<void>
}
