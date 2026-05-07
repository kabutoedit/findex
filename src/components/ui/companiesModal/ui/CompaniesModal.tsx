'use client'

import styles from './CompaniesModal.module.scss'
import { useCompaniesModalLogic } from '../hooks/useCompaniesModalLogic'
import { CompaniesArrow } from '@/components/icons/icons'

export default function CompaniesModal() {
	const {
		isOpen,
		setIsOpen,
		currentCompany,
		companies,
		brandID,
		handleSelectCompany,
	} = useCompaniesModalLogic()

	return (
		<div className={styles.companiesModal}>
			<div className={styles.currentCompany} onClick={() => setIsOpen(!isOpen)}>
				<div className={styles.company}>
					<h3>{currentCompany?.name}</h3>
					<p>{currentCompany?.description}</p>
				</div>
				<CompaniesArrow isOpen={isOpen} />
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
