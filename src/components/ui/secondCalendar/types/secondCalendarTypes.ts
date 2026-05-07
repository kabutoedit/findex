export type BlockReason = 'upgrade-standard' | 'upgrade-vip' | null

export type SelectionState =
	| { phase: 'idle' }
	| { phase: 'anchor'; anchor: Date }
	| { phase: 'done'; from: Date; to: Date }
