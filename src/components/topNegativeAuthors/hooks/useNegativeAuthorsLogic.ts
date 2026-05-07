import { useMemo, useState } from 'react'
import { AuthorsResponseType } from '../types/topNegativeAuthorsTypes'
import { useQuery } from '@tanstack/react-query'
import { fetchAuthors } from '../api/topNegativeAuthors.api'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { formatDate } from '@/utils/formatDate'
import { Author } from '@/types/types'

export const useNegativeAuthorsLogic = () => {
	const { brandID, dateRange } = useFiltersStore()
	const [sort, setSort] = useState<'quantity' | 'date'>('quantity')
	const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)

	const params = useMemo(
		() => ({
			brand_id: brandID,
			...(dateRange.from && { from: formatDate(dateRange.from) }),
			...(dateRange.to && { to: formatDate(dateRange.to) }),
		}),
		[brandID, dateRange]
	)

	const { data } = useQuery<AuthorsResponseType>({
		queryKey: ['negative-authors', params],
		queryFn: () => fetchAuthors(params),
		enabled: !!brandID,
	})

	const authors: Author[] = data?.items ?? []

	const sortedAuthors = useMemo(() => {
		return [...authors].sort((a, b) => {
			if (sort === 'quantity') {
				return b.negative_count - a.negative_count
			}
			const dateA = new Date(a.last_negative_at).getTime()
			const dateB = new Date(b.last_negative_at).getTime()
			return dateB - dateA
		})
	}, [authors, sort])

	return {
		sortedAuthors,
		sort,
		setSort,
		selectedAuthor,
		setSelectedAuthor,
	}
}
