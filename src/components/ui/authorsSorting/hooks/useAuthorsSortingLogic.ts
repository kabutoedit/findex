import { useState } from 'react'

export const useAuthorsSortingLogic = () => {
	const [open, setOpen] = useState(false)

	const options: { label: string; value: 'quantity' | 'date' }[] = [
		{ label: 'По колличеству', value: 'quantity' },
		{ label: 'По дате', value: 'date' },
	]

	return {
		open,
		setOpen,
		options,
	}
}
