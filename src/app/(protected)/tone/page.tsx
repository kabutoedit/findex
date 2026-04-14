'use client'
import styles from '../style.module.scss'
import { useState } from 'react'
import { Message } from '@/components/message/Message'
import Calendar from '@/components/ui/calendar/Calendar'
import DeleteBtn from '@/components/ui/deleteBtn/DeleteBtn'
import Filters from '@/components/filters/Filters'
import { PositiveSVG, NegativeSVG, NeutralSVG } from '@/components/icons/icons'

export default function ToneFilters() {
	const [search, setSearch] = useState('')
	const [filterTone, setFilterTone] = useState<
		'позитив' | 'негатив' | 'нейтрально' | null
	>(null)

	return (
		<div className={styles.Page}>
			<div className={styles.left}>
				<div className={styles.upside}>
					<Calendar />

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
						<DeleteBtn />
					</div>
				</div>

				<Message search={search} forceTone={filterTone || undefined} />
			</div>

			<Filters search={search} setSearch={setSearch} />
		</div>
	)
}
