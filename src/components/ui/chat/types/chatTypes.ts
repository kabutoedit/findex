export interface ChatMessage {
	role: 'user' | 'assistant'
	content: string
}

export interface ChatResponse {
	answer: string
	brand_id: number
	model: string
	sources: any[]
	context_summary: any
}
