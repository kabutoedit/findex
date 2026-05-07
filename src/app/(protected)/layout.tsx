'use client'

import { fetchMe } from '@/components/layout/api/header.api'
import Header from '@/components/layout/ui/Header'
import NavBar from '@/components/layout/ui/NavBar'
import { useEffect } from 'react'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useQuery } from '@tanstack/react-query'

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { setTariff } = useFiltersStore()

	const { data } = useQuery({
		queryKey: ['subscriptionPlan'],
		queryFn: fetchMe,
		staleTime: 1000 * 60 * 15,
	})

	useEffect(() => {
		if (data?.subscription_plan) setTariff(data.subscription_plan)
	}, [data, setTariff])

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
