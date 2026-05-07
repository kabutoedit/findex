import { api } from '@/app/api/api'
import { FetchNegativeSeries } from '../types/negativeSeriesChartTypes'

export const fetchNegativeSeries = (params: FetchNegativeSeries) =>
	api.get('/api/analytics/negative-series', { params }).then(res => res.data)
