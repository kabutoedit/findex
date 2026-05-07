import { ProfileData } from '@/types/types'
import { Dispatch, SetStateAction } from 'react'

export interface UseProfileLogicReturn {
	state: {
		name: string
		lastName: string
		password: string
		confirmPassword: string
		avatarPreview: string | null
		isPending: boolean
		data: ProfileData | undefined
	}
	handlers: {
		setName: Dispatch<SetStateAction<string>>
		setLastName: Dispatch<SetStateAction<string>>
		setPassword: Dispatch<SetStateAction<string>>
		setConfirmPassword: Dispatch<SetStateAction<string>>
		setAvatar: Dispatch<SetStateAction<File | null>>
		setAvatarPreview: Dispatch<SetStateAction<string | null>>
		handleSave: () => void
	}
}

export interface FetchPassword {
	new_password: string
	new_password_confirm: string
}
