'use client'

import { useEffect, useState } from 'react'
import styles from '../style.module.scss'
import { api } from '@/src/lib/api'

export default function Profile() {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchFilters = async () => {
			try {
				setLoading(true)

				const { data } = await api.get('/api/me')

				setData(data)
			} catch (err: any) {
				console.error('Ошибка загрузки фильтров', err.response?.data)
			} finally {
				setLoading(false)
			}
		}

		fetchFilters()
	}, [])

	console.log(data)

	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<div className={styles.profile}>
				<div className={styles.nameSurname}>
					{/* <img src={data?.ava} alt='' /> */}
				</div>
				<div className={styles.password}></div>
			</div>
		</div>
	)
}
