'use client'
import styles from '../style.module.scss'
import Chat from '@/components/ui/chat/Chat'

export default function AiAssistant() {
	return (
		<div className={styles.Page} style={{ display: 'flex' }}>
			<Chat />
		</div>
	)
}
