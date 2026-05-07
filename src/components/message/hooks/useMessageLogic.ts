import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useMessagesStore } from '@/store/useMessages.store'
import { fetchMessages } from '../api/messages.api'
import { formatDateForApi } from '../utils/messages.helpers'
import { MessageType } from '@/types/types'
import { UseMessageLogicProps } from '../types/messagesTypes'

export const useMessageLogic = ({
	search,
	itemsPerPage,
	forceSource,
	forceTone,
}: UseMessageLogicProps) => {
	const { countries, tones, sources, sourceTypes, dateRange, brandID } =
		useFiltersStore()
	const { refreshTrigger } = useMessagesStore()

	const [sortBy, setSortBy] = useState<string>('date')
	const [currentPage, setCurrentPage] = useState(1)

	const [localMessages, setLocalMessages] = useState<MessageType[]>([])

	const apiParams = useMemo(() => {
		const params: any = { brand_id: brandID }
		if (search.trim()) params.q = search
		if (countries.length) params.country = countries.join(',')
		if (tones.length || forceTone) params.tone = forceTone || tones.join(',')
		if (sources.length || forceSource)
			params.source = forceSource || sources.join(',')
		if (sourceTypes.length) params.source_type = sourceTypes.join(',')

		if (dateRange?.from) {
			params.from = formatDateForApi(dateRange.from)
			params.to = dateRange.to ? formatDateForApi(dateRange.to) : params.from
		}
		return params
	}, [
		brandID,
		search,
		countries,
		tones,
		sources,
		sourceTypes,
		dateRange,
		forceSource,
		forceTone,
	])

	const { isLoading } = useQuery({
		queryKey: ['messages', apiParams, refreshTrigger],
		queryFn: async () => {
			const data = await fetchMessages(apiParams)
			setLocalMessages(data.items)
			return data.items
		},
		enabled: !!brandID,
	})

	const handleToneChange = (id: string, newTone: MessageType['tone']) => {
		setLocalMessages(prev =>
			prev.map(m => (m.external_id === id ? { ...m, tone: newTone } : m))
		)
	}

	const sortedMessages = useMemo(() => {
		const copy = [...localMessages]
		switch (sortBy) {
			case 'likes':
				return copy.sort((a, b) => (b.likes || 0) - (a.likes || 0))
			case 'views':
				return copy.sort((a, b) => (b.views || 0) - (a.views || 0))
			case 'comments':
				return copy.sort((a, b) => (b.comments || 0) - (a.comments || 0))
			case 'engagement':
				return copy.sort((a, b) => (b.engagement || 0) - (a.engagement || 0))
			default:
				return copy.sort(
					(a, b) =>
						new Date(b.published_at || 0).getTime() -
						new Date(a.published_at || 0).getTime()
				)
		}
	}, [localMessages, sortBy])

	const totalPages = Math.ceil(sortedMessages.length / itemsPerPage)
	const currentItems = sortedMessages.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	return {
		currentItems,
		isLoading,
		totalPages,
		currentPage,
		setCurrentPage,
		setSortBy,
		handleToneChange,
	}
}
