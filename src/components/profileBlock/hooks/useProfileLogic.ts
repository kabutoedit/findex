import { useEffect, useState } from 'react'
import {
	fetchMe,
	fetchPasswordChange,
	fetchUpdateMe,
} from '../api/profileBlock.api'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { ProfileData } from '@/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UseProfileLogicReturn } from '../types/profileTypes'
import { FetchPassword } from '../types/profileTypes'

export const useProfileLogic = (): UseProfileLogicReturn => {
	const queryClient = useQueryClient()
	const { setTariff } = useFiltersStore()

	const { data } = useQuery<ProfileData>({
		queryKey: ['me'],
		queryFn: fetchMe,
		staleTime: 1000 * 60 * 15,
	})

	const [name, setName] = useState(data?.first_name || '')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [lastName, setLastName] = useState(data?.last_name || '')
	const [avatar, setAvatar] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

	useEffect(() => {
		if (data) {
			setName(data?.first_name || '')
			setLastName(data?.last_name || '')
			setTariff(data?.subscription_plan || 'basic')
		}
	}, [])

	const { mutate, isPending } = useMutation({
		mutationFn: async (payload: any) => {
			const formData = new FormData()

			if (payload.first_name) formData.append('first_name', payload.first_name)
			if (payload.last_name) formData.append('last_name', payload.last_name)
			if (payload.first_name && payload.last_name)
				formData.append(
					'username',
					payload.first_name + ' ' + payload.last_name
				)
			if (payload.email) formData.append('email', payload.email)
			if (payload.avatar) formData.append('avatar', payload.avatar)

			return fetchUpdateMe(formData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['me'] })
		},
	})

	const { mutate: passwordMutation, isPending: isPasswordPending } =
		useMutation({
			mutationFn: async ({
				new_password,
				new_password_confirm,
			}: FetchPassword) => {
				return fetchPasswordChange({ new_password, new_password_confirm })
			},
			onSuccess() {
				setPassword('')
				setConfirmPassword('')
			},
		})

	const handleSave = () => {
		if (name || lastName || avatar) {
			mutate({
				first_name: name,
				last_name: lastName,
				avatar: avatar,
			})
		}
		if (password && confirmPassword) {
			passwordMutation({
				new_password: password,
				new_password_confirm: confirmPassword,
			})
		}
	}

	return {
		state: {
			name,
			lastName,
			password,
			confirmPassword,
			avatarPreview,
			data,
			isPending,
		},
		handlers: {
			setName,
			setLastName,
			setPassword,
			setConfirmPassword,
			setAvatar,
			setAvatarPreview,
			handleSave,
		},
	}
}
