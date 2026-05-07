'use client'
import styles from '../style.module.scss'
import ProfileBlock from '@/components/profileBlock/ui/ProfileBlock'

export default function Profile() {
	return (
		<div
			className={styles.Page}
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				gap: '20px',
			}}
		>
			<ProfileBlock />
		</div>
	)
}
