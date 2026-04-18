import { create } from 'zustand'
import { FiltersState } from '@/types/types'

export const useFiltersStore = create<FiltersState>(set => ({
	countries: [],

	tones: [],
	sources: [],
	sourceTypes: [],
	brandID: 0,
	tariff: 'basic',

	dateRange: {
		from: null,
		to: null,
	},

	setTariff: tariff => set({ tariff }),

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
			tones: [],
			sources: [],
			sourceTypes: [],
			dateRange: {
				from: null,
				to: null,
			},
		}),
}))
