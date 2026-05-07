import { api } from '@/app/api/api'

export const fetchMyBrands = () =>
	api.get('/api/brands/my').then(res => res.data)
