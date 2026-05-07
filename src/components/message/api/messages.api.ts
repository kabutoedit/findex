import { api } from '@/app/api/api'

export const fetchMessages = (params: any) =>
	api.get('/api/messages', { params }).then(res => res.data)
