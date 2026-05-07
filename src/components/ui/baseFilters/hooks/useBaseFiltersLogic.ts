import { useState } from 'react'

export const useBaseFiltersLogic = (onChange: (value: string) => void) => {
	const [active, setActive] = useState<string>('')

	const handleClick = (value: string) => {
		setActive(value)
		onChange(value)
	}

	const filters = [
		{ label: 'дата', value: 'date' },
		{ label: 'лайки', value: 'likes' },
		{ label: 'просмотры', value: 'views' },
		{ label: 'комментарии', value: 'comments' },
		{ label: 'аудитория', value: 'audience' },
	]

	return {
		active,
		setActive,
		handleClick,
		filters,
	}
}
