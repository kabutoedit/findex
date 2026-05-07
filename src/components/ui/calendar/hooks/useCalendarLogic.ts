import { useState } from 'react'
import { useMemo, useRef } from 'react'
import {
	startOfDay,
	endOfDay,
	subMonths,
	addMonths,
	isAfter,
	isSameDay,
	isWithinInterval,
} from 'date-fns'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useFiltersStore } from '@/store/useMessagesFilters.store'

export const useCalendarLogic = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isClosing, setIsClosing] = useState(false)

	const setGlobalRange = useFiltersStore(state => state.setDateRange)
	const globalRange = useFiltersStore(state => state.dateRange)

	const [anchorDate, setAnchorDate] = useState<Date | null>(null)
	const [tempTo, setTempTo] = useState<Date | null>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [coords, setCoords] = useState({ top: 0, left: 0 })

	useLockBodyScroll(isOpen)
	const today = startOfDay(new Date())

	const disabledDays = useMemo(() => {
		const base: any[] = [{ after: today }]
		if (anchorDate && !tempTo) {
			const min = subMonths(anchorDate, 2)
			const max = addMonths(anchorDate, 2)
			base.push({ before: min })
			base.push({ after: isAfter(max, today) ? today : max })
		}
		return base
	}, [anchorDate, tempTo, today])

	const handleDayClick = (day: Date) => {
		const clickedDay = startOfDay(day)

		if (!anchorDate || (anchorDate && tempTo)) {
			setAnchorDate(clickedDay)
			setTempTo(null)
			return
		}

		if (isSameDay(clickedDay, anchorDate)) return

		const dates = [anchorDate, clickedDay].sort(
			(a, b) => a.getTime() - b.getTime()
		)

		const finalFrom = startOfDay(dates[0])
		const finalTo = endOfDay(dates[1])

		setAnchorDate(finalFrom)
		setTempTo(finalTo)

		setGlobalRange({ from: finalFrom, to: finalTo })

		setIsClosing(true)
		setTimeout(() => {
			setIsOpen(false)
			setIsClosing(false)
			setAnchorDate(null)
			setTempTo(null)
		}, 300)
	}

	const handleOpen = () => {
		setAnchorDate(null)
		setTempTo(null)
		setIsOpen(true)

		if (wrapperRef.current) {
			const rect = wrapperRef.current.getBoundingClientRect()
			setCoords({
				top: rect.bottom + 23,
				left: rect.left,
			})
		}
	}

	const modifiers = {
		start: anchorDate ? [anchorDate] : [],
		end: tempTo ? [tempTo] : [],
		range: (day: Date) => {
			if (anchorDate && tempTo) {
				return isWithinInterval(day, { start: anchorDate, end: tempTo })
			}
			return false
		},
	}
	return {
		isOpen,
		isClosing,
		wrapperRef,
		coords,
		disabledDays,
		modifiers,
		anchorDate,
		tempTo,
		handleDayClick,
		handleOpen,
		setIsOpen,
		globalRange,
	}
}
