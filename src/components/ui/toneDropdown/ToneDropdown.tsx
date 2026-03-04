import { useState, useRef, useEffect } from 'react'
import styles from './ToneDropdown.module.scss'
import { MessageType } from '../../../types/types'
import { api } from '@/src/lib/api'
import { PositiveSVG, NeutralSVG, NegativeSVG } from '../../../../public/icons'

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
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

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
		<div className={styles.container} ref={dropdownRef}>
			<div
				className={`${styles.selected} ${isOpen ? styles.active : ''}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<currentTone.Icon />
			</div>

			{isOpen && (
				<div className={styles.dropdown}>
					{TONES.map(({ value, Icon }) => (
						<div
							key={value}
							className={`${styles.option} ${
								tone === value ? styles.current : ''
							}`}
							onClick={() => handleSelect(value as MessageType['tone'])}
						>
							<Icon />
						</div>
					))}
				</div>
			)}
		</div>
	)
}
