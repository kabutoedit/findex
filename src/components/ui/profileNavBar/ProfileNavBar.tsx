'use client'

import { LogOutIcon, SettingsIcon } from '@/components/icons/icons'
import styles from './ProfileNavBar.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type ProfileNavBarProps = {
	toggleModal: () => void
}

export default function ProfileNavBar({ toggleModal }: ProfileNavBarProps) {
	const router = useRouter()

	return (
		<div className={styles.modalOverlay} onClick={toggleModal}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<Link
					style={{ textDecoration: 'none' }}
					href={'/profile'}
					onClick={toggleModal}
					className={styles.profile}
				>
					Профиль <SettingsIcon />
				</Link>

				<div
					className={styles.logOut}
					onClick={() => {
						router.push('/login')
					}}
				>
					Выйти <LogOutIcon />
				</div>
			</div>
		</div>
	)
}
