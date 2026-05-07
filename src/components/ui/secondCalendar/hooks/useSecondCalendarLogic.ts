import { useState, useMemo, useCallback, useRef } from 'react'
import {
	startOfDay,
	endOfDay,
	subMonths,
	addMonths,
	isAfter,
	isBefore,
	isSameDay,
	startOfMonth,
} from 'date-fns'
import { Matcher, DateRange } from 'react-day-picker'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { SelectionState, BlockReason } from '../types/secondCalendarTypes'

export const useSecondCalendarLogic = () => {
	const {
		tariff,
		dateRange: globalRange,
		setDateRange: setGlobalRange,
	} = useFiltersStore()

	const [isOpen, setIsOpen] = useState(false)
	const [isClosing, setIsClosing] = useState(false)
	const [currentMonth, setCurrentMonth] = useState(new Date())
	const [selection, setSelection] = useState<SelectionState>({ phase: 'idle' })
	const [coords, setCoords] = useState({ top: 0, left: 0 })

	const wrapperRef = useRef<HTMLDivElement>(null)
	const today = useMemo(() => startOfDay(new Date()), [])

	const maxDate = useMemo(() => {
		if (tariff === 'vip') return addMonths(today, 12)
		if (tariff === 'basic') return startOfDay(subMonths(today, 1))
		return today
	}, [tariff, today])

	const disabledDays = useMemo((): Matcher[] => {
		const rules: Matcher[] = [{ after: maxDate }]
		if (selection.phase === 'anchor') {
			const { anchor } = selection
			rules.push({ before: subMonths(anchor, 12) })
			const rangeMax = addMonths(anchor, 12)
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

			const [from, to] = isSameDay(clicked, selection.anchor)
				? [clicked, clicked]
				: [selection.anchor, clicked].sort((a, b) => a.getTime() - b.getTime())

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

	const getMonthBlockReason = useCallback(
		(monthDate: Date): BlockReason => {
			if (tariff === 'vip') return null
			const monthStart = startOfMonth(monthDate)
			if (tariff === 'basic' && !isBefore(monthStart, startOfMonth(today)))
				return 'upgrade-standard'
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
	const isBothBlocked = useMemo(
		() => leftReason !== null && leftReason === rightReason,
		[leftReason, rightReason]
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

	const selected = useMemo((): DateRange | undefined => {
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
		}
	}, [selection])

	return {
		isOpen,
		setIsOpen,
		isClosing,
		currentMonth,
		setCurrentMonth,
		selection,
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
	}
}
