import { api } from '@/app/api/api'
import { ProfileData } from '@/types/types'

export const fetchMe = () =>
	api.get<ProfileData>('/api/me').then(res => res.data)
