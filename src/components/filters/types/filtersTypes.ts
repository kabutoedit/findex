export interface FilterMetadata {
	cities: string[]
	langs: string[]
	countries: string[]
	tones: string[]
	sources: string[]
	source_types: string[]
}

export interface FilterGroupProps {
	title: string
	items: any[]
	groupKey: string
	selected: Record<string, Set<string>>
	toggle: (group: any, value: string) => void
}

export type FiltersProps = {
	search: string
	setSearch: (value: string) => void
}
