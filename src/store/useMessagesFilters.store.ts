import { create } from 'zustand'
import { Tariff } from '@/types/types'

interface FiltersState {
	countries: string[]
	tone: string[]
	source: string[]
	sourceType: string[]
	brandID: number
	tariff: Tariff

	dateRange: {
		from: Date | null
		to: Date | null
	}

	setFilters: (filters: Partial<FiltersState>) => void
	setDateRange: (range: { from: Date | null; to: Date | null }) => void
	resetFilters: () => void
	setBrandID: (brandID: number) => void
	setTariff: (tariff: 'basic' | 'standard' | 'vip') => void
}

export const useFiltersStore = create<FiltersState>(set => ({
	countries: [],
	tone: [],
	source: [],
	sourceType: [],
	brandID: 0,
	tariff: 'basic',

	dateRange: {
		from: null,
		to: null,
	},

	setTariff: (tariff: Tariff) => set({ tariff }),

	setBrandID: brandID =>
		set({
			brandID,
		}),

	setFilters: filters =>
		set(state => ({
			...state,
			...filters,
		})),

	setDateRange: range =>
		set(state => ({
			...state,
			dateRange: range,
		})),

	resetFilters: () =>
		set({
			countries: [],
			tone: [],
			source: [],
			sourceType: [],
			dateRange: {
				from: null,
				to: null,
			},
		}),
}))
