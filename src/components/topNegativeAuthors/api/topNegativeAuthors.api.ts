import { api } from '@/app/api/api'

export const fetchAuthors = (params: any) =>
	api
		.get('/api/analytics/negative-authors-feed', {
			params: { ...params, authors_limit: 3, per_author_limit: 5 },
		})
		.then(res => res.data)
