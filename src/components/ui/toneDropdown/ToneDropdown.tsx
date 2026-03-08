import { useState, useRef, useEffect } from 'react'
import styles from './ToneDropdown.module.scss'
import { MessageType } from '../../../types/types'
import { api } from '@/src/lib/api'
import { PositiveSVG, NeutralSVG, NegativeSVG } from '../../../../public/icons'
import { createPortal } from 'react-dom'

type ToneDropdownProps = {
	tone: MessageType['tone']
	externalId: string
	onToneChange: (externalId: string, newTone: MessageType['tone']) => void
}

const TONES = [
	{ value: 'позитив', Icon: PositiveSVG },
	{ value: 'нейтрально', Icon: NeutralSVG },
	{ value: 'негатив', Icon: NegativeSVG },
]

export default function ToneDropdown({
	tone,
	externalId,
	onToneChange,
}: ToneDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [coords, setCoords] = useState<{ top: number; left: number } | null>(
		null
	)
	const buttonRef = useRef<HTMLDivElement>(null)

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
			onToneChange(externalId, newTone)
			await api.patch(`/api/messages/${externalId}`, { tone: newTone })
		} catch (err) {
			console.error('Ошибка при смене тональности', err)
			alert('Не удалось сохранить изменение')
		}
	}

	const currentTone =
		TONES.find(t => t.value === (tone || 'нейтрально')) || TONES[1]

	return (
		<>
			<div
				ref={buttonRef}
				className={`${styles.selected} ${isOpen ? styles.active : ''}`}
				onClick={handleToggle}
			>
				<currentTone.Icon />
			</div>

			{isOpen &&
				coords &&
				createPortal(
					<div
						className={styles.dropdown}
						style={{
							position: 'absolute',
							top: coords.top + 3,
							left: coords.left - 8,
							zIndex: 9999,
						}}
					>
						{TONES.map(({ value, Icon }) => (
							<div
								key={value}
								className={`${styles.option} ${
									tone === value ? styles.current : ''
								}`}
								onMouseDown={e => e.stopPropagation()}
								onClick={() => handleSelect(value as MessageType['tone'])}
							>
								<Icon />
							</div>
						))}
					</div>,
					document.body
				)}
		</>
	)
}
