import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { fetchMyBrands } from '../api/companiesModal.api'
import { Company } from '../types/companiesModalTypes'

export const useCompaniesModalLogic = () => {
	const [isOpen, setIsOpen] = useState(false)
	const { brandID, setBrandID } = useFiltersStore()

	useLockBodyScroll(isOpen)

	const { data } = useQuery<Company[]>({
		queryKey: ['my-brands'],
		queryFn: () => fetchMyBrands(),
	})

	const companies = data || []

	const currentCompany = companies.find(c => c.id === brandID) || companies[0]

	useEffect(() => {
		if (currentCompany) {
			setBrandID(currentCompany.id)
		}
	}, [currentCompany, setBrandID])

	const handleSelectCompany = (id: number) => {
		setBrandID(id)
		setIsOpen(false)
	}

	return {
		isOpen,
		setIsOpen,
		currentCompany,
		companies,
		handleSelectCompany,
		brandID,
	}
}
