'use client'
import styles from './Header.module.scss'
import ProfileNavBar from '@/components/ui/profileNavBar/ui/ProfileNavBar'
import { LogoIcon } from '../../icons/icons'
import { useHeaderLogic } from '../hooks/useHeaderLogic'

export default function Header() {
	const { data, isOpen, toggleModal } = useHeaderLogic()

	return (
		<header className={styles.header}>
			<a href='' className={styles.logo}>
				<LogoIcon />
			</a>

			<div className={styles.profile} onClick={toggleModal}>
				<div className={styles.img}>
					<img
						src={data?.avatar_url || '/defaultProfilePicture.jpg'}
						alt='profilePicture'
					/>
				</div>
				<h3 className={styles.name}>{data?.full_name}</h3>
			</div>

			{isOpen && <ProfileNavBar toggleModal={toggleModal} />}
		</header>
	)
}
