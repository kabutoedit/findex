import { Author, MessageType } from '@/types/types'
import { useState } from 'react'

export const useNegativeCountModalLogic = (author: Author) => {
	const formatDateTime = (dateStr: string) => {
		const date = new Date(dateStr)
		const d = date.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
		const t = date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		})
		return { date: d, time: t }
	}

	const getSourceLabel = (url: string | null | undefined) => {
		if (!url) return null
		const s = url.toLowerCase()
		if (s.includes('t.me') || s.includes('telegram')) return 'Telegram'
		if (s.includes('instagram')) return 'Instagram'
		if (s.includes('facebook') || s.includes('fb.com')) return 'Facebook'
		if (s.includes('youtube')) return 'YouTube'
		if (s.includes('vk.com')) return 'ВКонтакте'
		try {
			return new URL(url).hostname.replace('www.', '')
		} catch {
			return null
		}
	}

	const [selectedMessage, setSelectedMessage] = useState<MessageType | null>(
		null
	)

	const initials = author.author
		.replace('@', '')
		.split(/[\s._-]/)
		.filter(Boolean)
		.slice(0, 2)
		.map(w => w[0]?.toUpperCase() ?? '')
		.join('')

	return {
		formatDateTime,
		getSourceLabel,
		selectedMessage,
		setSelectedMessage,
		initials,
	}
}
