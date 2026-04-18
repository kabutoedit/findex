import { api } from '@/app/api/api'
import { FilterMetadata } from '@/types/types'

export const fetchFilters = (brandID: number) =>
	api
		.get<FilterMetadata>('/api/messages/filters', {
			params: { brand_id: brandID },
		})
		.then(res => res.data)
