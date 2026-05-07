import { SearchProps } from '../types/searchTypes'
import styles from './Search.module.scss'

export default function Search({ search, setSearch }: SearchProps) {
	return (
		<label htmlFor='input' className={styles.label}>
			<input
				id='input'
				className={styles.input}
				type='text'
				placeholder='Поиск по словам'
				value={search}
				onChange={e => setSearch(e.target.value)}
			/>
			<svg
				className={styles.svg}
				width='24'
				height='24'
				viewBox='0 0 24 24'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M16.927 17.0401L20.4001 20.4001M19.2801 11.4401C19.2801 15.77 15.77 19.2801 11.4401 19.2801C7.11019 19.2801 3.6001 15.77 3.6001 11.4401C3.6001 7.11019 7.11019 3.6001 11.4401 3.6001C15.77 3.6001 19.2801 7.11019 19.2801 11.4401Z'
					stroke='#838383'
					strokeWidth='2'
					strokeLinecap='round'
				/>
			</svg>
		</label>
	)
}
