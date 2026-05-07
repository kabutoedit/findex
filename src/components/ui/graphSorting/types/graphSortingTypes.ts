export interface SortingByResponseType {
	brand_id: number
	from: string
	to: string
	group_by: string
	bucket_count: number
	available_groupings: {
		value: string
		label: string
	}[]
	series: any[]
}

export interface AccordionProps {
	sortingBy: string
	setSortingBy: (value: string) => void
	options: { value: string; label: string }[]
}
