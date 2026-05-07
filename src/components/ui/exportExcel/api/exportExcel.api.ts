import { api } from '@/app/api/api'

export const fetchExportExcel = (params: Record<string, any>) =>
	api
		.get('/api/messages/export', {
			params,
			responseType: 'blob',
		})
		.then(res => res.data)
