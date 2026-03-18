'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './NegativeSeriesChart.module.scss'
import {
	Area,
	AreaChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

interface SeriesPoint {
	displayDate: string
	negative_count: number
	fullDate: string
	date: string
	change_percent?: number
}

type Tariff = 'basic' | 'standard' | 'vip'

function normalizeDate(d: Date) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const CustomTooltip = ({ active, payload }: any) => {
	if (!active || !payload?.length) return null
	const point = payload[0].payload
	return (
		<div className={styles.tooltip}>
			<p className={styles.tooltipDate}>{point.fullDate}</p>
			<div className={styles.tooltipValue}>
				<span>Негативных сообщений: </span>
				<p>{point.negative_count}</p>
			</div>
			{point.change_percent !== undefined && (
				<p className={styles.tooltipChange}>
					Изменение: <strong>{point.change_percent}%</strong>
				</p>
			)}
		</div>
	)
}

export default function NegativeSeriesChart({
	series,
	loading,
	tariff,
}: {
	series: SeriesPoint[]
	loading: boolean
	tariff: Tariff
}) {
	const today = normalizeDate(new Date())
	const ticksArray = [0, 5, 10, 15, 20, 25, 30, 35, 40]

	let allowedDate: Date | null = null
	if (tariff === 'basic') {
		const yesterday = new Date(today)
		yesterday.setDate(today.getDate() - 1)
		allowedDate = yesterday
	}
	if (tariff === 'standard') {
		allowedDate = today
	}

	const chartContainerRef = useRef<HTMLDivElement>(null)
	const [overlayWidthPx, setOverlayWidthPx] = useState(0)

	let blockIndex = -1
	if (allowedDate && series.length > 0) {
		blockIndex = series.findIndex(point => {
			const pointDate = normalizeDate(new Date(point.date))
			return pointDate > allowedDate!
		})
		if (blockIndex === -1) blockIndex = series.length
	}

	let blockedFraction = 0
	if (blockIndex < series.length && series.length > 1) {
		blockedFraction = (series.length - blockIndex) / (series.length - 1)
	}

	useEffect(() => {
		const updateWidth = () => {
			if (!chartContainerRef.current) return
			const fullWidth = chartContainerRef.current.getBoundingClientRect().width
			const effectiveWidth = Math.max(0, fullWidth - 75)
			const overlayPx = effectiveWidth * blockedFraction

			setOverlayWidthPx(Math.floor(overlayPx))
		}

		updateWidth()

		window.addEventListener('resize', updateWidth)
		return () => window.removeEventListener('resize', updateWidth)
	}, [series, blockIndex, loading, tariff])

	return (
		<div className={styles.chartWrapper}>
			<div className={styles.chartContainer} ref={chartContainerRef}>
				{loading ? (
					<div className={styles.loading}>Загрузка...</div>
				) : (
					<ResponsiveContainer width='100%' height={280}>
						<AreaChart data={series} margin={{ left: -25 }}>
							<defs>
								<linearGradient id='colorNeg' x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor='#2563eb' stopOpacity={0.3} />
									<stop offset='95%' stopColor='#2563eb' stopOpacity={0} />
								</linearGradient>
							</defs>

							<CartesianGrid
								strokeDasharray='4 6'
								stroke='#e5e7eb'
								vertical
								horizontal
							/>
							<XAxis
								dataKey='displayDate'
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 12, fill: '#273242', fontWeight: 500 }}
								padding={{ left: 40 }}
								dy={10}
							/>
							<YAxis
								ticks={ticksArray}
								axisLine={false}
								tickLine={false}
								tick={({ x, y, payload, index }) => {
									const isMajor = index % 2 === 0
									return (
										<text
											x={x}
											y={Number(y) + 5}
											textAnchor='end'
											alignmentBaseline='middle'
											fill={isMajor ? '#273242' : '#9ca3af'}
											fontSize={isMajor ? 20 : 14}
											fontWeight={isMajor ? 500 : 400}
										>
											{payload.value}
										</text>
									)
								}}
							/>
							<Tooltip
								content={<CustomTooltip />}
								cursor={{
									stroke: '#94a3b8',
									strokeDasharray: '4 4',
									strokeWidth: 1,
								}}
							/>
							<Area
								type='monotone'
								dataKey='negative_count'
								stroke='#3b82f6'
								strokeWidth={3}
								fillOpacity={1}
								fill='url(#colorNeg)'
								animationDuration={1200}
								activeDot={{
									r: 6,
									stroke: '#3b82f6',
									strokeWidth: 2,
									fill: '#fff',
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>

			{overlayWidthPx > 0 && (
				<div
					className={styles.overlay}
					style={{
						width: `${overlayWidthPx}px`,
						marginLeft: 'auto',
					}}
				>
					<span>
						{tariff === 'basic'
							? 'Обновитесь до Standard для просмотра текущих данных'
							: 'Обновитесь до VIP для просмотра будущих данных'}
					</span>
				</div>
			)}
		</div>
	)
}
