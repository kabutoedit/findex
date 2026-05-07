import { MessageType } from '@/types/types'

export type ToneDropdownProps = {
	tone: MessageType['tone']
	externalId: string
	onToneChange: (externalId: string, newTone: MessageType['tone']) => void
}

export interface UseToneDropdownLogicProps {
	TONES: {
		value: string
		Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
	}[]
	externalId: string
	tone: MessageType['tone']
	onToneChange: (externalId: string, newTone: MessageType['tone']) => void
}
