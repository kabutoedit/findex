import { useMutation } from '@tanstack/react-query'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { fetchExportExcel } from '../api/exportExcel.api'

export const useExportExcelLogic = () => {
	const { countries, tones, sources, sourceTypes, dateRange, brandID } =
		useFiltersStore()

	const formatDateString = (date: Date | null) => {
		if (!date) return null
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}-${month}-${day}`
	}

	const exportMutation = useMutation({
		mutationFn: (params: Record<string, string>) => fetchExportExcel(params),
		onSuccess: data => {
			const blob = new Blob([data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})

			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url

			const formatDate = (d: Date | null) =>
				d ? d.toISOString().split('T')[0] : 'none'
			link.download = `Отчет-[${formatDate(dateRange.from)}]-[${formatDate(
				dateRange.to
			)}].xlsx`

			document.body.appendChild(link)
			link.click()
			link.remove()
			window.URL.revokeObjectURL(url)
		},
		onError: err => {
			console.error('Ошибка экспорта', err)
			alert('Не удалось скачать Excel')
		},
	})

	const handleExport = () => {
		if (!brandID) return alert('Ошибка: Бренд не выбран')

		const params: Record<string, string> = {
			brand_id: String(brandID),
		}

		if (countries.length) params.country = countries.join(',')
		if (tones.length) params.tone = tones.join(',')
		if (sources.length) params.source = sources.join(',')
		if (sourceTypes.length) params.source_type = sourceTypes.join(',')
		if (dateRange.from) params.from = formatDateString(dateRange.from)!
		if (dateRange.to) params.to = formatDateString(dateRange.to)!

		exportMutation.mutate(params)
	}

	return {
		handleExport,
		isLoading: exportMutation.isPending,
	}
}
