import { Tariff } from '@/types/types'
import { RefObject } from 'react'

export interface SeriesPoint {
	displayDate: string
	negative_count: number
	date: string
	change_percent?: number
	isFake?: boolean
	kind?: 'actual' | 'predicted'
}

export interface FetchNegativeSeries {
	brand_id: number
	from?: string
	to?: string
	group_by?: string
}

export interface UseChartDataProps {
	sortingBy: string
	brandId: number
}

export interface SeriesResponseType {
	points: {
		bucket_start: string
		negative_count?: number
		count?: number
		delta_percent?: number
		bucket_label: string
		kind?: 'actual' | 'predicted'
	}[]
}

export interface NegativeSeriesChartProps {
	tariff: Tariff
	sortingBy: string
	brandId: number
}

export interface UseOverlayWidthProps {
	containerRef: RefObject<HTMLDivElement | null>
	chartData: number
	isInitialLoad: boolean
	tariff: string
}
