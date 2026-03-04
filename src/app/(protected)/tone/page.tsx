'use client'
import { Message } from '@/src/components/message/Message'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import DeleteBtn from '@/src/components/ui/deleteBtn/DeleteBtn'
import Filters from '@/src/components/filters/Filters'
import { useState } from 'react'
import { PositiveSVG, NegativeSVG, NeutralSVG } from '@/public/icons'

type DateRangeOrSingle =
	| {
			from: Date
			to?: Date
	  }
	| undefined

export default function ToneFilters() {
	const [isShow, setIsShow] = useState(true)

	const [search, setSearch] = useState('')
	const [selectedRange, setSelectedRange] = useState<DateRangeOrSingle>()
	const [filterTone, setFilterTone] = useState<
		'позитив' | 'негатив' | 'нейтрально' | null
	>(null)

	const [refreshTrigger, setRefreshTrigger] = useState(0)

	const handleRefresh = () => setRefreshTrigger(prev => prev + 1)

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar selectedRange={selectedRange} onChange={setSelectedRange} />

					<div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
						<div className={styles.toneFilters}>
							<button
								className={`${styles.btn} ${
									filterTone === 'позитив' ? styles.active : ''
								}`}
								onClick={() => setFilterTone('позитив')}
							>
								<PositiveSVG /> Позитив
							</button>

							<button
								className={`${styles.btn} ${
									filterTone === 'нейтрально' ? styles.active : ''
								}`}
								onClick={() => setFilterTone('нейтрально')}
							>
								<NeutralSVG /> Нейтрально
							</button>

							<button
								className={`${styles.btn} ${
									filterTone === 'негатив' ? styles.active : ''
								}`}
								onClick={() => setFilterTone('негатив')}
							>
								<NegativeSVG /> Негатив
							</button>
						</div>
						{isShow && <DeleteBtn onSuccess={handleRefresh} />}
					</div>
				</div>

				<Message
					search={search}
					selectedRange={selectedRange}
					refreshTrigger={0}
					forceTone={filterTone || undefined}
				/>
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
