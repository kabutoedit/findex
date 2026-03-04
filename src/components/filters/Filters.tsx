import { useState, ChangeEvent } from 'react'
import Search from '../ui/search/Search'
import styles from './Filters.module.scss'

interface Filters {
	countries: {
		kyrgyzstan: boolean
		russia: boolean
	}
	tonality: {
		positive: boolean
		neutral: boolean
		negative: boolean
	}
	sources: {
		instagram: boolean
		facebook: boolean
		telegram: boolean
		vk: boolean
		max: boolean
	}
	sourceTypes: {
		socialNetworks: boolean
		video: boolean
		messengerChats: boolean
		messengerChannels: boolean
		microblogs: boolean
		onlineMedia: boolean
	}
}

const initialFilters: Filters = {
	countries: { kyrgyzstan: false, russia: false },
	tonality: { positive: false, neutral: false, negative: false },
	sources: {
		instagram: false,
		facebook: false,
		telegram: false,
		vk: false,
		max: false,
	},
	sourceTypes: {
		socialNetworks: false,
		video: false,
		messengerChats: false,
		messengerChannels: false,
		microblogs: false,
		onlineMedia: false,
	},
}

type FiltersProps = {
	search: string
	setSearch: (value: string) => void
}

export default function Filters({ search, setSearch }: FiltersProps) {
	const [filters, setFilters] = useState<Filters>(initialFilters)

	const handleCheckboxChange = (
		group: keyof Filters,
		key: string,
		e: ChangeEvent<HTMLInputElement>
	) => {
		setFilters(prev => ({
			...prev,
			[group]: {
				...prev[group],
				[key]: e.target.checked,
			},
		}))
	}

	const handleReset = () => {
		setFilters(initialFilters)
	}

	const handleSubmit = () => {
		console.log('Применить фильтры:', filters)
	}

	return (
		<div className={styles.filters}>
			<Search search={search} setSearch={setSearch} />

			<div className={styles.panel}>
				<div className={styles.group}>
					<h3 className={styles.title}>Страны</h3>

					<label className={styles.label}>
						<input
							type='checkbox'
							checked={filters.countries.kyrgyzstan}
							onChange={e => handleCheckboxChange('countries', 'kyrgyzstan', e)}
							className={styles.checkbox}
						/>
						Кыргызстан
					</label>

					<label className={styles.label}>
						<input
							type='checkbox'
							checked={filters.countries.russia}
							onChange={e => handleCheckboxChange('countries', 'russia', e)}
							className={styles.checkbox}
						/>
						Россия
					</label>
				</div>

				<div className={styles.group}>
					<h3 className={styles.title}>Тональность</h3>

					<label className={styles.label}>
						<input
							type='checkbox'
							checked={filters.tonality.positive}
							onChange={e => handleCheckboxChange('tonality', 'positive', e)}
							className={styles.checkbox}
						/>
						Позитив
					</label>

					<label className={styles.label}>
						<input
							type='checkbox'
							checked={filters.tonality.neutral}
							onChange={e => handleCheckboxChange('tonality', 'neutral', e)}
							className={styles.checkbox}
						/>
						Нейтрально
					</label>

					<label className={styles.label}>
						<input
							type='checkbox'
							checked={filters.tonality.negative}
							onChange={e => handleCheckboxChange('tonality', 'negative', e)}
							className={styles.checkbox}
						/>
						Негатив
					</label>
				</div>

				<div className={styles.group}>
					<h3 className={styles.title}>Источники</h3>

					{['instagram', 'facebook', 'telegram', 'vk', 'max'].map(src => (
						<label key={src} className={styles.label}>
							<input
								type='checkbox'
								checked={filters.sources[src as keyof typeof filters.sources]}
								onChange={e => handleCheckboxChange('sources', src, e)}
								className={styles.checkbox}
							/>
							{src === 'max' ? 'Max.ru' : `${src}.com`}
						</label>
					))}
				</div>

				<div className={styles.group}>
					<h3 className={styles.title}>Типы источников</h3>

					{[
						{ key: 'socialNetworks', label: 'Соцсети' },
						{ key: 'video', label: 'Видео' },
						{ key: 'messengerChats', label: 'Мессенджеры чаты' },
						{ key: 'messengerChannels', label: 'Мессенджеры каналы' },
						{ key: 'microblogs', label: 'Микроблоги' },
						{ key: 'onlineMedia', label: 'Онлайн-СМИ' },
					].map(({ key, label }) => (
						<label key={key} className={styles.label}>
							<input
								type='checkbox'
								checked={
									filters.sourceTypes[key as keyof typeof filters.sourceTypes]
								}
								onChange={e => handleCheckboxChange('sourceTypes', key, e)}
								className={styles.checkbox}
							/>
							{label}
						</label>
					))}
				</div>

				<button
					className={`${styles.btn} ${styles.apply}`}
					onClick={handleSubmit}
				>
					Отфильтровать
				</button>
			</div>
		</div>
	)
}
