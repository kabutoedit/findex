import { useState, useEffect } from 'react'
import { UseOverlayWidthProps } from '../types/negativeSeriesChartTypes'

export const useOverlayWidth = ({
	containerRef,
	chartData,
	isInitialLoad,
	tariff,
}: UseOverlayWidthProps) => {
	const [overlayWidthPx, setOverlayWidthPx] = useState(0)

	useEffect(() => {
		const updateWidth = () => {
			if (
				!containerRef.current ||
				!isInitialLoad ||
				tariff === 'vip' ||
				chartData <= 14
			) {
				setOverlayWidthPx(0)
				return
			}

			const fullWidth = containerRef.current.getBoundingClientRect().width
			const effectiveWidth = Math.max(0, fullWidth - 65)
			const overlay = Math.floor(effectiveWidth * (14 / (chartData - 1)))

			setOverlayWidthPx(overlay)
		}

		updateWidth()
		window.addEventListener('resize', updateWidth)
		return () => window.removeEventListener('resize', updateWidth)
	}, [chartData, isInitialLoad, tariff, containerRef])
	if (!containerRef.current) return 0

	return overlayWidthPx
}
