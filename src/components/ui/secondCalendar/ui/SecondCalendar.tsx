'use client'

import { DayPicker, MonthProps, Month } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { ru } from 'date-fns/locale'
import { useCallback } from 'react'

import styles from './SecondCalendar.module.scss'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useSecondCalendarLogic } from '../hooks/useSecondCalendarLogic'
import { BlockReason } from '../types/secondCalendarTypes'
import { CalendarIcon } from '@/components/icons/icons'

export default function Calendar() {
	const {
		isOpen,
		setIsOpen,
		isClosing,
		currentMonth,
		setCurrentMonth,
		coords,
		wrapperRef,
		globalRange,
		disabledDays,
		handleDayClick,
		getMonthBlockReason,
		isBothBlocked,
		leftReason,
		handleOpen,
		selected,
		modifiers,
	} = useSecondCalendarLogic()

	const getLabel = (reason: BlockReason) =>
		reason === 'upgrade-standard'
			? ['Обновитесь до Standard', 'для просмотра текущих данных']
			: ['Просмотр будущих дат доступен', 'только в тарифе VIP']

	const MonthComponent = useCallback(
		(props: MonthProps) => {
			const reason = getMonthBlockReason((props as any).calendarMonth.date)
			const label = reason ? getLabel(reason) : null

			return (
				<div style={{ position: 'relative' }}>
					<div className={reason ? styles.blurredMonth : ''}>
						<Month {...props} />
					</div>
					{label && !isBothBlocked && (
						<div className={styles.lockOverlay}>
							<p>
								{label[0]}
								<br />
								{label[1]}
							</p>
						</div>
					)}
				</div>
			)
		},
		[getMonthBlockReason, isBothBlocked]
	)

	useLockBodyScroll(isOpen)

	return (
		<div className={styles.calendarWrapper} ref={wrapperRef}>
			<div className={styles.calendar} onClick={handleOpen}>
				<p>
					{globalRange?.from && globalRange?.to
						? `${globalRange.from.toLocaleDateString(
								'ru-RU'
						  )} - ${globalRange.to.toLocaleDateString('ru-RU')}`
						: 'Выберите период'}
				</p>

				<CalendarIcon />
			</div>

			{isOpen && (
				<>
					<div
						className={`${styles.modalOverlay} ${
							isClosing ? styles.closing : ''
						}`}
						onClick={() => setIsOpen(false)}
					>
						<div
							className={`${styles.select} ${isClosing ? styles.closing : ''}`}
							style={{
								position: 'fixed',
								top: `${coords.top}px`,
								left: `${coords.left}px`,
								zIndex: 1001,
							}}
							onClick={e => e.stopPropagation()}
						>
							<div
								className={styles.calendarContent}
								style={{ position: 'relative' }}
							>
								<DayPicker
									month={currentMonth}
									onMonthChange={setCurrentMonth}
									locale={ru}
									mode='range'
									selected={selected}
									onDayClick={handleDayClick}
									disabled={disabledDays}
									modifiers={modifiers}
									modifiersClassNames={{
										start: 'selectedDay',
										end: 'selectedDay',
										inRange: 'inRange',
									}}
									numberOfMonths={2}
									pagedNavigation
									components={{ Month: MonthComponent }}
								/>

								{isBothBlocked && (
									<div className={styles.lockOverlay}>
										<p>
											{getLabel(leftReason)[0]}
											<br />
											{getLabel(leftReason)[1]}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
