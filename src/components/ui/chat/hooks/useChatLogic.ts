import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { api } from '@/app/api/api'
import { useState, useRef } from 'react'
import { ChatMessage, ChatResponse } from '../types/chatTypes'

export const useChatLogic = () => {
	const { countries, tones, sources, sourceTypes, brandID, dateRange } =
		useFiltersStore()

	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [input, setInput] = useState('')
	const [status, setStatus] = useState<'ready' | 'loading'>('ready')
	const bottomRef = useRef<HTMLDivElement>(null)

	const handleSend = async () => {
		if (!input.trim() || status !== 'ready') return

		const userMessage: ChatMessage = { role: 'user', content: input }
		const newMessages = [...messages, userMessage]
		setMessages(newMessages)
		setInput('')
		setStatus('loading')

		try {
			const { data } = await api.post<ChatResponse>('/api/ai/chat', {
				brand_id: brandID,
				message: input,
				history: messages.slice(-10),

				filters: {
					...(dateRange.from && { from_date: dateRange.from }),
					...(dateRange.to && { to_date: dateRange.to }),
					...(tones?.length && { tone: tones }),
					...(sources?.length && { source: sources }),
					...(countries?.length && { country: countries }),
					...(sourceTypes?.length && { source_type: sourceTypes }),
				},
			})

			setMessages(prev => [
				...prev,
				{ role: 'assistant', content: data.answer },
			])
		} catch (e) {
			setMessages(prev => [
				...prev,
				{ role: 'assistant', content: 'Ошибка запроса' },
			])
		} finally {
			setStatus('ready')
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
		}
	}

	return { messages, handleSend, status, input, setInput, bottomRef }
}
