export const formatDateForApi = (date: Date): string => {
	const pad = (n: number) => n.toString().padStart(2, '0')
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
		date.getDate()
	)}`
}

export const formatDisplayDate = (dateStr: string): string => {
	if (!dateStr) return ''
	return new Date(dateStr).toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
