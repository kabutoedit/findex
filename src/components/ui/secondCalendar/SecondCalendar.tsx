'use client'

import { DayPicker, MonthProps, Month, Matcher } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

import { ru } from 'date-fns/locale'
import { useState, useMemo, useCallback, useRef } from 'react'
import {
	startOfDay,
	endOfDay,
	subMonths,
	addMonths,
	isAfter,
	isBefore,
	isSameDay,
	isWithinInterval,
	startOfMonth,
} from 'date-fns'

import styles from './SecondCalendar.module.scss'
import { useLockBodyScroll } from '@/src/hooks/useLockBodyScroll'
import { useFiltersStore } from '../../../store/useMessagesFilters.store'

type Tariff = 'basic' | 'standard' | 'vip'
type BlockReason = 'upgrade-standard' | 'upgrade-vip' | null

type SelectionState =
	| { phase: 'idle' }
	| { phase: 'anchor'; anchor: Date }
	| { phase: 'done'; from: Date; to: Date }

type SecondCalendarProps = {
	tariff: Tariff
}

function useToday() {
	const ref = useRef(startOfDay(new Date()))
	return ref.current
}

export default function Calendar({ tariff }: SecondCalendarProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isClosing, setIsClosing] = useState(false)
	const [selection, setSelection] = useState<SelectionState>({ phase: 'idle' })
	const [currentMonth, setCurrentMonth] = useState(new Date())

	const setGlobalRange = useFiltersStore(state => state.setDateRange)
	const globalRange = useFiltersStore(state => state.dateRange)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [coords, setCoords] = useState({ top: 0, left: 0 })

	const today = useToday()

	const basicMaxDate = useMemo(() => startOfDay(subMonths(today, 1)), [today])

	const maxDate = useMemo(() => {
		if (tariff === 'vip') return addMonths(today, 12)
		if (tariff === 'basic') return basicMaxDate
		return today
	}, [tariff, today, basicMaxDate])

	const disabledDays = useMemo(() => {
		const rules: Matcher[] = [{ after: maxDate }]
		if (selection.phase === 'anchor') {
			const { anchor } = selection
			const rangeMin = subMonths(anchor, 12)
			const rangeMax = addMonths(anchor, 12)
			rules.push({ before: rangeMin })
			rules.push({ after: isAfter(rangeMax, maxDate) ? maxDate : rangeMax })
		}
		return rules
	}, [selection, maxDate])

	const handleDayClick = useCallback(
		(day: Date) => {
			const clicked = startOfDay(day)
			if (selection.phase !== 'anchor') {
				setSelection({ phase: 'anchor', anchor: clicked })
				return
			}
			const { anchor } = selection
			const [from, to] = isSameDay(clicked, anchor)
				? [clicked, clicked]
				: [anchor, clicked].sort((a, b) => a.getTime() - b.getTime())

			const finalFrom = startOfDay(from)
			const finalTo = endOfDay(to)
			setGlobalRange({ from: finalFrom, to: finalTo })
			setSelection({ phase: 'done', from: finalFrom, to: finalTo })
			setIsClosing(true)
			setTimeout(() => {
				setIsOpen(false)
				setIsClosing(false)
				setSelection({ phase: 'idle' })
			}, 300)
		},
		[selection, setGlobalRange]
	)

	const handleOpen = useCallback(() => {
		if (wrapperRef.current) {
			const rect = wrapperRef.current.getBoundingClientRect()
			setCoords({
				top: rect.bottom + 23,
				left: rect.left,
			})
		}
		setSelection({ phase: 'idle' })
		setIsOpen(true)
	}, [])

	const getMonthBlockReason = useCallback(
		(monthDate: Date): BlockReason => {
			if (tariff === 'vip') return null
			const monthStart = startOfMonth(monthDate)
			if (tariff === 'basic') {
				if (!isBefore(monthStart, startOfMonth(today)))
					return 'upgrade-standard'
			}
			if (tariff === 'standard' && isAfter(monthStart, today))
				return 'upgrade-vip'
			return null
		},
		[tariff, today]
	)

	const leftReason = useMemo(
		() => getMonthBlockReason(currentMonth),
		[currentMonth, getMonthBlockReason]
	)
	const rightReason = useMemo(
		() => getMonthBlockReason(addMonths(currentMonth, 1)),
		[currentMonth, getMonthBlockReason]
	)

	const isBothBlocked = leftReason !== null && leftReason === rightReason

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

	const selected = useMemo(() => {
		if (selection.phase === 'anchor')
			return { from: selection.anchor, to: selection.anchor }
		if (selection.phase === 'done')
			return { from: selection.from, to: selection.to }
		return undefined
	}, [selection])

	const modifiers = useMemo(() => {
		const from =
			selection.phase === 'done'
				? selection.from
				: selection.phase === 'anchor'
				? selection.anchor
				: null
		const to = selection.phase === 'done' ? selection.to : null
		return {
			start: from ? [from] : [],
			end: to ? [to] : [],
			inRange: (day: Date) =>
				from && to ? isWithinInterval(day, { start: from, end: to }) : false,
		}
	}, [selection])

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

				<svg
					width='21'
					height='23'
					viewBox='0 0 21 23'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M10.5 13.4167C10.6731 13.4167 10.8422 13.3605 10.9861 13.2552C11.13 13.1499 11.2422 13.0003 11.3084 12.8252C11.3746 12.65 11.3919 12.4574 11.3582 12.2715C11.3244 12.0856 11.2411 11.9148 11.1187 11.7808C10.9963 11.6467 10.8404 11.5555 10.6707 11.5185C10.501 11.4815 10.325 11.5005 10.1652 11.573C10.0053 11.6456 9.86861 11.7684 9.77246 11.926C9.67632 12.0836 9.625 12.2689 9.625 12.4584C9.625 12.7126 9.71719 12.9563 9.88128 13.1361C10.0454 13.3158 10.2679 13.4167 10.5 13.4167ZM14.875 13.4167C15.0481 13.4167 15.2172 13.3605 15.3611 13.2552C15.505 13.1499 15.6172 13.0003 15.6834 12.8252C15.7496 12.65 15.7669 12.4574 15.7332 12.2715C15.6994 12.0856 15.6161 11.9148 15.4937 11.7808C15.3713 11.6467 15.2154 11.5555 15.0457 11.5185C14.876 11.4815 14.7 11.5005 14.5402 11.573C14.3803 11.6456 14.2436 11.7684 14.1475 11.926C14.0513 12.0836 14 12.2689 14 12.4584C14 12.7126 14.0922 12.9563 14.2563 13.1361C14.4204 13.3158 14.6429 13.4167 14.875 13.4167ZM10.5 17.2501C10.6731 17.2501 10.8422 17.1939 10.9861 17.0886C11.13 16.9833 11.2422 16.8336 11.3084 16.6585C11.3746 16.4834 11.3919 16.2907 11.3582 16.1048C11.3244 15.9189 11.2411 15.7481 11.1187 15.6141C10.9963 15.4801 10.8404 15.3888 10.6707 15.3518C10.501 15.3149 10.325 15.3338 10.1652 15.4064C10.0053 15.4789 9.86861 15.6017 9.77246 15.7593C9.67632 15.9169 9.625 16.1022 9.625 16.2917C9.625 16.5459 9.71719 16.7897 9.88128 16.9694C10.0454 17.1491 10.2679 17.2501 10.5 17.2501ZM14.875 17.2501C15.0481 17.2501 15.2172 17.1939 15.3611 17.0886C15.505 16.9833 15.6172 16.8336 15.6834 16.6585C15.7496 16.4834 15.7669 16.2907 15.7332 16.1048C15.6994 15.9189 15.6161 15.7481 15.4937 15.6141C15.3713 15.4801 15.2154 15.3888 15.0457 15.3518C14.876 15.3149 14.7 15.3338 14.5402 15.4064C14.3803 15.4789 14.2436 15.6017 14.1475 15.7593C14.0513 15.9169 14 16.1022 14 16.2917C14 16.5459 14.0922 16.7897 14.2563 16.9694C14.4204 17.1491 14.6429 17.2501 14.875 17.2501ZM6.125 13.4167C6.29806 13.4167 6.46723 13.3605 6.61112 13.2552C6.75502 13.1499 6.86717 13.0003 6.93339 12.8252C6.99962 12.65 7.01695 12.4574 6.98319 12.2715C6.94942 12.0856 6.86609 11.9148 6.74372 11.7808C6.62135 11.6467 6.46544 11.5555 6.2957 11.5185C6.12597 11.4815 5.95004 11.5005 5.79015 11.573C5.63027 11.6456 5.49361 11.7684 5.39746 11.926C5.30132 12.0836 5.25 12.2689 5.25 12.4584C5.25 12.7126 5.34219 12.9563 5.50628 13.1361C5.67038 13.3158 5.89293 13.4167 6.125 13.4167ZM16.625 3.83341H15.75V2.87508C15.75 2.62092 15.6578 2.37716 15.4937 2.19744C15.3296 2.01771 15.1071 1.91675 14.875 1.91675C14.6429 1.91675 14.4204 2.01771 14.2563 2.19744C14.0922 2.37716 14 2.62092 14 2.87508V3.83341H7V2.87508C7 2.62092 6.90781 2.37716 6.74372 2.19744C6.57962 2.01771 6.35706 1.91675 6.125 1.91675C5.89293 1.91675 5.67038 2.01771 5.50628 2.19744C5.34219 2.37716 5.25 2.62092 5.25 2.87508V3.83341H4.375C3.67881 3.83341 3.01113 4.13632 2.51884 4.67548C2.02656 5.21465 1.75 5.94592 1.75 6.70841V18.2084C1.75 18.9709 2.02656 19.7022 2.51884 20.2413C3.01113 20.7805 3.67881 21.0834 4.375 21.0834H16.625C17.3212 21.0834 17.9889 20.7805 18.4812 20.2413C18.9734 19.7022 19.25 18.9709 19.25 18.2084V6.70841C19.25 5.94592 18.9734 5.21465 18.4812 4.67548C17.9889 4.13632 17.3212 3.83341 16.625 3.83341ZM17.5 18.2084C17.5 18.4626 17.4078 18.7063 17.2437 18.8861C17.0796 19.0658 16.8571 19.1667 16.625 19.1667H4.375C4.14294 19.1667 3.92038 19.0658 3.75628 18.8861C3.59219 18.7063 3.5 18.4626 3.5 18.2084V9.58341H17.5V18.2084ZM17.5 7.66675H3.5V6.70841C3.5 6.45425 3.59219 6.21049 3.75628 6.03077C3.92038 5.85105 4.14294 5.75008 4.375 5.75008H16.625C16.8571 5.75008 17.0796 5.85105 17.2437 6.03077C17.4078 6.21049 17.5 6.45425 17.5 6.70841V7.66675ZM6.125 17.2501C6.29806 17.2501 6.46723 17.1939 6.61112 17.0886C6.75502 16.9833 6.86717 16.8336 6.93339 16.6585C6.99962 16.4834 7.01695 16.2907 6.98319 16.1048C6.94942 15.9189 6.86609 15.7481 6.74372 15.6141C6.62135 15.4801 6.46544 15.3888 6.2957 15.3518C6.12597 15.3149 5.95004 15.3338 5.79015 15.4064C5.63027 15.4789 5.49361 15.6017 5.39746 15.7593C5.30132 15.9169 5.25 16.1022 5.25 16.2917C5.25 16.5459 5.34219 16.7897 5.50628 16.9694C5.67038 17.1491 5.89293 17.2501 6.125 17.2501Z'
						fill='#767575'
					/>
				</svg>
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
