import { LogOutIcon, SettingsIcon } from '@/public/icons'
import styles from './ProfileNavBar.module.scss'

type ProfileNavBarProps = {
	toggleModal: () => void
}

export default function ProfileNavBar({ toggleModal }: ProfileNavBarProps) {
	return (
		<div className={styles.modalOverlay} onClick={toggleModal}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<div className={styles.profile}>
					Профиль <SettingsIcon />
				</div>
				<div className={styles.logOut}>
					Выйти <LogOutIcon />
				</div>
			</div>
		</div>
	)
}
