'use client'
import Link from 'next/link'
import CompaniesModal from '@/components/ui/companiesModal/CompaniesModal'
import { usePathname } from 'next/navigation'
import styles from './NavBar.module.scss'
import {
	AiAssistantIcon,
	ImageDetectorIcon,
	MessagesIcon,
	SourcesIcon,
	ToneIcon,
} from '@/components/icons/icons'

export default function NavBar() {
	const pathname = usePathname()
	return (
		<nav className={styles.nav}>
			<CompaniesModal />
			<div className={styles.links}>
				<Link
					href='/messages'
					className={pathname === '/messages' ? styles.active : ''}
				>
					<MessagesIcon />
					Сообщения
				</Link>

				<Link
					href={'/sources'}
					className={pathname === '/sources' ? styles.active : ''}
				>
					<SourcesIcon />
					Источники
				</Link>
				<Link
					href={'tone'}
					className={pathname === '/tone' ? styles.active : ''}
				>
					<ToneIcon />
					Тональность
				</Link>
				<Link
					href={'imageDetector'}
					className={pathname === '/imageDetector' ? styles.active : ''}
				>
					<ImageDetectorIcon />
					Детектор имиджа
				</Link>
				<Link
					href={'aiAssistant'}
					className={pathname === '/aiAssistant' ? styles.active : ''}
				>
					<AiAssistantIcon />
					ИИ ассистент
				</Link>
			</div>
		</nav>
	)
}
