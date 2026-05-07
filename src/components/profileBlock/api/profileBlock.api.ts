import { api } from '@/app/api/api'
import { ProfileData } from '@/types/types'
import { FetchPassword } from '../types/profileTypes'

export const fetchMe = () =>
	api.get<ProfileData>('/api/me').then(res => res.data)

export const fetchUpdateMe = (formData: FormData) =>
	api.patch<ProfileData>('/api/me', formData)

export const fetchPasswordChange = ({
	new_password,
	new_password_confirm,
}: FetchPassword) =>
	api.post<ProfileData>('/api/password-change', {
		new_password,
		new_password_confirm,
	})
