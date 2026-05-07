'use client'
import styles from './NegativeSeriesChart.module.scss'
import { useRef, useMemo } from 'react'
import {
	Area,
	AreaChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { useChartData } from '../hooks/useChartData'
import { useOverlayWidth } from '../hooks/useOverlayWidth'
import { getTicksArray } from '../utils/chart.helpers'
import { NegativeSeriesChartProps } from '../types/negativeSeriesChartTypes'

const CustomTooltip = ({ active, payload }: any) => {
	if (!active || !payload?.length || payload[0].payload.isFake) return null
	const point = payload[0].payload

	return (
		<div className={styles.tooltip}>
			<p className={styles.tooltipDate}>{point.date}</p>
			<div className={styles.tooltipValue}>
				<span>Негативных сообщений: </span>
				<p style={{ margin: 0 }}>{point.negative_count}</p>
			</div>
			{point.change_percent !== undefined && point.change_percent !== null && (
				<div className={styles.tooltipValue}>
					<span>Изменение: </span>
					<p style={{ margin: 0 }}>{point.change_percent.toFixed(1)}%</p>
				</div>
			)}
		</div>
	)
}

export default function NegativeSeriesChart(props: NegativeSeriesChartProps) {
	const { tariff } = props
	const containerRef = useRef<HTMLDivElement>(null)

	const { chartData, isInitialLoad, isLoading } = useChartData(props)

	const overlayWidthPx = useOverlayWidth({
		containerRef,
		chartData: chartData.length,
		isInitialLoad,
		tariff,
	})

	const ticksArray = useMemo(() => {
		const maxValue = Math.max(...chartData.map(p => p.negative_count || 0), 0)
		return getTicksArray(maxValue)
	}, [chartData])

	return (
		<div className={styles.chartWrapper}>
			<div className={styles.chartContainer} ref={containerRef}>
				{isLoading ? (
					<div className={styles.loading}>Загрузка данных...</div>
				) : (
					<ResponsiveContainer width='100%' height={280}>
						<AreaChart data={chartData} margin={{ left: -25 }}>
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
								padding={{ left: 40, right: 20 }}
								dy={10}
							/>
							<YAxis
								ticks={ticksArray}
								axisLine={false}
								tickLine={false}
								tick={({ x, y, payload, index }) => (
									<text
										x={x}
										y={Number(y) + 5}
										textAnchor='end'
										fill={index % 2 === 0 ? '#273242' : '#9ca3af'}
										fontSize={index % 2 === 0 ? 20 : 14}
										fontWeight={index % 2 === 0 ? 500 : 400}
									>
										{payload.value}
									</text>
								)}
							/>
							<Tooltip
								content={<CustomTooltip />}
								cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
								wrapperStyle={{ zIndex: 10 }}
							/>
							<Area
								type='linear'
								dataKey='negative_count'
								stroke='#34547D'
								strokeWidth={2}
								fill='none'
								connectNulls={true}
								dot={(dotProps: any) => {
									if (dotProps.value === null || dotProps.payload.isFake)
										return <g key={dotProps.key} />
									const isPredicted = dotProps.payload.kind === 'predicted'
									return (
										<circle
											key={dotProps.key}
											cx={dotProps.cx}
											cy={dotProps.cy}
											r={2}
											fill={isPredicted ? '#E16D1A' : '#34547D'}
										/>
									)
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>

			{!isLoading &&
				isInitialLoad &&
				tariff !== 'vip' &&
				overlayWidthPx > 0 && (
					<div
						className={styles.overlay}
						style={{ width: `${overlayWidthPx}px`, marginLeft: 'auto' }}
					>
						<span>
							{tariff === 'basic'
								? 'Обновитесь до Standard для просмотра текущих данных'
								: 'Эта часть графика доступна только в тарифе VIP'}
						</span>
					</div>
				)}
		</div>
	)
}
