import { useState, useRef, useEffect } from 'react'
import styles from './ToneDropdown.module.scss'
import { MessageType } from '@/types/types'
import { PositiveSVG, NeutralSVG, NegativeSVG } from '@/components/icons/icons'
import { createPortal } from 'react-dom'
import { useMessagesStore } from '@/store/useMessages.store'
import { ToneDropdownProps } from '../types/toneDropdownTypes'
import { useToneDropdownLogic } from '../hooks/useToneDropdownLogic'

const TONES = [
	{ value: 'нейтрально', Icon: NeutralSVG },
	{ value: 'позитив', Icon: PositiveSVG },
	{ value: 'негатив', Icon: NegativeSVG },
]

export default function ToneDropdown({
	tone,
	externalId,
	onToneChange,
}: ToneDropdownProps) {
	const { isOpen, buttonRef, handleSelect, handleToggle, coords, currentTone } =
		useToneDropdownLogic({
			TONES,
			externalId,
			tone,
			onToneChange,
		})
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
