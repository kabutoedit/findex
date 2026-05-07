import { useQuery } from '@tanstack/react-query'
import { fetchSortingBy } from '../api/graphSorting.api'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { SortingByResponseType } from '../types/graphSortingTypes'
import { formatDate } from '@/utils/formatDate'

export const useGraphSortingLogic = () => {
	const { brandID, dateRange } = useFiltersStore()

	const params = {
		brand_id: brandID,
		...(dateRange.from && { from: formatDate(dateRange.from) }),
		...(dateRange.to && { to: formatDate(dateRange.to) }),
	}
	const { data } = useQuery<SortingByResponseType>({
		queryKey: ['sorting-by', params],
		queryFn: () => fetchSortingBy(params),
		staleTime: 1000 * 60 * 15,
		enabled: !!brandID,
	})

	return {
		sortingOptions: data?.available_groupings ?? [],
	}
}
