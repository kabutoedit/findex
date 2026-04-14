import { create } from 'zustand'
import { api } from '@/app/api/api'
import { MessageType } from '@/types/types'

interface MessagesState {
	selectedIds: string[]
	loading: boolean
	error: string | null
	refreshTrigger: number

	toggle: (id: string) => void
	clearSelection: () => void
	triggerRefresh: () => void
	deleteMessages: (accessToken: string) => Promise<void>
	deleteOne: (accessToken: string, id: string) => Promise<void>
	updateTone: (
		externalId: string,
		newTone: MessageType['tone']
	) => Promise<void>
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
	selectedIds: [],
	loading: false,
	error: null,
	refreshTrigger: 0,

	triggerRefresh: () =>
		set(state => ({ refreshTrigger: state.refreshTrigger + 1 })),

	toggle: id =>
		set(state => ({
			selectedIds: state.selectedIds.includes(id)
				? state.selectedIds.filter(item => item !== id)
				: [...state.selectedIds, id],
		})),

	clearSelection: () => set({ selectedIds: [] }),

	deleteMessages: async (accessToken: string) => {
		try {
			set({ loading: true })
			await api.post(
				'/api/messages/bulk-delete',
				{ external_ids: get().selectedIds },
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			)
			set({ selectedIds: [] })
			get().triggerRefresh()
		} catch (err) {
			set({ error: 'Ошибка' })
		} finally {
			set({ loading: false })
		}
	},

	deleteOne: async (accessToken: string, id: string) => {
		try {
			set({ loading: true })
			await api.post(
				'/api/messages/bulk-delete',
				{ external_ids: [id] },
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			)
			get().triggerRefresh()
		} catch (err) {
			set({ error: 'Ошибка' })
		} finally {
			set({ loading: false })
		}
	},

	updateTone: async (externalId, newTone) => {
		try {
			await api.patch(`/api/messages/${externalId}`, { tone: newTone })
			get().triggerRefresh()
		} catch (err) {
			console.error(err)
			throw err
		}
	},
}))
