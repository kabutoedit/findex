import { api } from '@/app/api/api'

export const fetchSortingBy = (params: any) =>
	api.get('/api/analytics/tone-series', { params }).then(res => res.data)
