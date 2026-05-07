import { SeriesPoint } from '../types/negativeSeriesChartTypes'

export const normalizeDate = (d: Date) => {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
export const addDays = (date: string | Date, days: number) => {
	const result = new Date(date)
	result.setDate(result.getDate() + days)
	return result
}

export const getTicksArray = (maxValue: number) => {
	const step = maxValue <= 10 ? 1 : maxValue <= 50 ? 5 : 10
	return Array.from(
		{ length: Math.ceil((maxValue + step) / step) + 1 },
		(_, i) => i * step
	)
}
export const mapPoint = (item: any): SeriesPoint => {
	return {
		date: item.bucket_start.split('T')[0],
		negative_count: item.count,
		change_percent: item.delta_percent,
		displayDate: item.bucket_label,
		kind: item.kind,
	}
}
