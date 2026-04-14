'use client'

import { useState, useEffect } from 'react'
import styles from './CompaniesModal.module.scss'
import { fetchMyBrands } from '@/app/api/api'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { useQuery } from '@tanstack/react-query'

interface Company {
	id: number
	name: string
	description: string
}

export default function CompaniesModal() {
	const [isOpen, setIsOpen] = useState(false)
	const { brandID, setBrandID } = useFiltersStore()

	useLockBodyScroll(isOpen)

	const { data } = useQuery<Company[]>({
		queryKey: ['my-brands'],
		queryFn: () => fetchMyBrands(),
	})

	const companies = data || []

	const currentCompany = companies.find(c => c.id === brandID) || companies[0]

	useEffect(() => {
		if (currentCompany) {
			setBrandID(currentCompany.id)
		}
	}, [currentCompany, setBrandID])

	const handleSelectCompany = (id: number) => {
		setBrandID(id)
		setIsOpen(false)
	}

	return (
		<div className={styles.companiesModal}>
			<div className={styles.currentCompany} onClick={() => setIsOpen(!isOpen)}>
				<div className={styles.company}>
					<h3>{currentCompany?.name}</h3>
					<p>{currentCompany?.description}</p>
				</div>
				<svg
					width='7'
					height='12'
					viewBox='0 0 7 12'
					fill='none'
					style={{
						transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
						transition: '0.2s',
					}}
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M0.232751 11.8244C0.490479 12.0584 0.907297 12.0584 1.16439 11.8244L6.61357 6.86597C6.73555 6.75668 6.83267 6.62513 6.89904 6.47933C6.96541 6.33353 6.99964 6.17653 6.99964 6.01787C6.99964 5.85921 6.96541 5.70221 6.89904 5.55641C6.83267 5.41062 6.73555 5.27907 6.61357 5.16977L1.12493 0.174773C1.00037 0.0631413 0.835407 0.000397068 0.663555 -0.000717321C0.491703 -0.00183171 0.325843 0.0587673 0.199661 0.168773C0.137152 0.223097 0.0871363 0.288942 0.0527118 0.36223C0.0182873 0.435519 0.000186437 0.51469 -0.000469776 0.594842C-0.00112599 0.674993 0.0156764 0.754419 0.0488968 0.8282C0.0821173 0.90198 0.131049 0.968545 0.192661 1.02377L5.21612 5.59397C5.27715 5.64863 5.32576 5.71442 5.35897 5.78734C5.39219 5.86027 5.40932 5.93881 5.40932 6.01817C5.40932 6.09754 5.39219 6.17608 5.35897 6.249C5.32576 6.32193 5.27715 6.38772 5.21612 6.44237L0.232751 10.9766C0.171731 11.0312 0.123137 11.0969 0.0899297 11.1698C0.0567228 11.2427 0.0395977 11.3212 0.0395977 11.4005C0.0395977 11.4798 0.0567228 11.5583 0.0899297 11.6312C0.123137 11.704 0.171731 11.7698 0.232751 11.8244Z'
						fill='white'
					/>
				</svg>
			</div>

			{isOpen && (
				<div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
					<div className={styles.companies} onClick={e => e.stopPropagation()}>
						{companies.map(company => (
							<div
								key={company.id}
								className={`${styles.company} ${
									brandID === company.id ? styles.selected : ''
								}`}
								onClick={() => handleSelectCompany(company.id)}
							>
								<h3>{company.name}</h3>
								<p>{company.description}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
