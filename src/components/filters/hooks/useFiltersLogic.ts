import { useState } from 'react'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useQuery } from '@tanstack/react-query'
import { fetchFilters } from '../api/filters.api'

export const useFiltersLogic = (onReset: () => void) => {
	const { setFilters } = useFiltersStore()
	const brandID = useFiltersStore(state => state.brandID)

	const { data, isLoading, error } = useQuery({
		queryKey: ['filters', brandID],
		queryFn: () => fetchFilters(brandID),
		enabled: !!brandID,
		staleTime: 1000 * 60 * 15,
	})

	const [selected, setSelected] = useState({
		countries: new Set<string>(),
		tones: new Set<string>(),
		sources: new Set<string>(),
		sourceTypes: new Set<string>(),
	})

	const toggle = (group: keyof typeof selected, value: string) => {
		setSelected(prev => {
			const next = new Set(prev[group])
			next.has(value) ? next.delete(value) : next.add(value)
			return { ...prev, [group]: next }
		})
	}

	const resetInternal = () => {
		setSelected({
			countries: new Set(),
			tones: new Set(),
			sources: new Set(),
			sourceTypes: new Set(),
		})
		onReset()
	}

	const applyFilters = () => {
		setFilters({
			countries: Array.from(selected.countries),
			tones: Array.from(selected.tones),
			sources: Array.from(selected.sources),
			sourceTypes: Array.from(selected.sourceTypes),
		})
	}

	const hasActive = Object.values(selected).some(set => set.size > 0)

	return {
		selected,
		toggle,
		resetInternal,
		applyFilters,
		hasActive,
		isLoading,
		error,
		data,
	}
}
