import { useMessagesStore } from '@/store/useMessages.store'
import { MessageType } from '@/types/types'
import { useEffect, useRef, useState } from 'react'
import { UseToneDropdownLogicProps } from '../types/toneDropdownTypes'

export const useToneDropdownLogic = ({
	TONES,
	externalId,
	tone,
	onToneChange,
}: UseToneDropdownLogicProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [coords, setCoords] = useState<{ top: number; left: number } | null>(
		null
	)
	const buttonRef = useRef<HTMLDivElement>(null)
	const updateTone = useMessagesStore(state => state.updateTone)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleToggle = () => {
		if (!buttonRef.current) return

		const rect = buttonRef.current.getBoundingClientRect()

		setCoords({
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX,
		})

		setIsOpen(prev => !prev)
	}

	const handleSelect = async (newTone: MessageType['tone']) => {
		setIsOpen(false)
		if (newTone === tone) return

		try {
			await updateTone(externalId, newTone)
			onToneChange(externalId, newTone)
		} catch (err) {
			console.error('Ошибка при смене тональности', err)
		}
	}

	const currentTone =
		TONES.find(t => t.value === (tone || 'нейтрально')) || TONES[0]
	return {
		isOpen,
		coords,
		handleToggle,
		buttonRef,
		handleSelect,
		currentTone,
	}
}
