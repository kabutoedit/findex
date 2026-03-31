'use client'

import styles from './ExportExel.module.scss'
import { api } from '@/src/lib/api'
import { useFiltersStore } from '../../../store/useMessagesFilters.store'

export default function ExportExel() {
	const { countries, tone, source, sourceType, dateRange, brandID } =
		useFiltersStore()

	const handleExport = async () => {
		if (!brandID) {
			alert('Ошибка: Бренд не выбран')
			return
		}

		const formatDateString = (date: Date | null) => {
			if (!date) return null
			const year = date.getFullYear()
			const month = String(date.getMonth() + 1).padStart(2, '0')
			const day = String(date.getDate()).padStart(2, '0')
			return `${year}-${month}-${day}`
		}

		try {
			const params: Record<string, string> = {
				brand_id: String(brandID),
			}

			if (countries.length) {
				params.country = countries.join(',')
			}

			if (tone.length) {
				params.tone = tone.join(',')
			}

			if (source.length) {
				params.source = source.join(',')
			}

			if (sourceType.length) {
				params.source_type = sourceType.join(',')
			}

			if (dateRange.from) {
				params.from = formatDateString(dateRange.from)!
			}

			if (dateRange.to) {
				params.to = formatDateString(dateRange.to)!
			}

			const response = await api.get('/api/messages/export', {
				params,
				responseType: 'blob',
			})

			const blob = new Blob([response.data], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})

			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url

			const formatDate = (d: Date | null) =>
				d ? d.toISOString().split('T')[0] : 'none'

			const fileName = `Отчет-[${formatDate(dateRange.from)}]-[${formatDate(
				dateRange.to
			)}].xlsx`

			link.download = fileName
			document.body.appendChild(link)
			link.click()
			link.remove()

			window.URL.revokeObjectURL(url)
		} catch (err) {
			console.error('Ошибка экспорта', err)
			alert('Не удалось скачать Excel')
		}
	}

	return (
		<div className={styles.Export} onClick={handleExport}>
			Экспорт в Excel
			<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
				<path
					d='M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z'
					fill='#254586'
				/>
			</svg>
		</div>
	)
}
