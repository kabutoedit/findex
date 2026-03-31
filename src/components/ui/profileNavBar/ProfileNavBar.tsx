import { LogOutIcon, SettingsIcon } from '@/public/icons'
import styles from './ProfileNavBar.module.scss'
import Link from 'next/link'

type ProfileNavBarProps = {
	toggleModal: () => void
}

export default function ProfileNavBar({ toggleModal }: ProfileNavBarProps) {
	return (
		<>
			<div className={styles.modalOverlay} onClick={toggleModal}>
				<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
					<Link
						style={{ textDecoration: 'none' }}
						href={'/profile'}
						className={styles.profile}
					>
						Профиль <SettingsIcon />
					</Link>
					<div className={styles.logOut}>
						Выйти <LogOutIcon />
					</div>
				</div>
			</div>
		</>
	)
}
