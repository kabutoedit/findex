import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMe } from '../api/header.api'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'

export const useHeaderLogic = () => {
	const [isOpen, setIsOpen] = useState(false)

	useLockBodyScroll(isOpen)

	const toggleModal = () => setIsOpen(prev => !prev)

	const { data, isLoading, error } = useQuery({
		queryKey: ['me'],
		queryFn: fetchMe,
		staleTime: 1000 * 60 * 15,
	})

	return {
		data,
		isLoading,
		error,
		isOpen,
		toggleModal,
	}
}
