'use client'
import { Message } from '@/src/components/message/Message'
import styles from '../style.module.scss'
import Calendar from '@/src/components/ui/calendar/Calendar'
import DeleteBtn from '@/src/components/ui/deleteBtn/DeleteBtn'
import Filters from '@/src/components/filters/Filters'
import { useState } from 'react'
import { PositiveSVG, NegativeSVG, NeutralSVG } from '@/public/icons'

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
