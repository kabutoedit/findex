'use client'

import { fetchMe } from '@/app/api/api'
import Header from '@/components/layout/Header'
import NavBar from '@/components/layout/NavBar'
import { useEffect } from 'react'
import { useFiltersStore } from '@/store/useMessagesFilters.store'

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { setTariff } = useFiltersStore()

	useEffect(() => {
		fetchMe()
			.then(data => {
				setTariff(data.subscription_plan)
			})
			.catch(err => console.error(err))
	}, [])

	return (
		<div className='app'>
			<Header />
			<div className='content' style={{ display: 'flex' }}>
				<NavBar />
				{children}
			</div>
		</div>
	)
}
