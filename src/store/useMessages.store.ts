import { create } from 'zustand'
import { api } from '../lib/api'

interface MessagesState {
	selectedIds: string[]
	loading: boolean
	error: string | null

	toggle: (id: string) => void
	clearSelection: () => void
	deleteMessages: (accessToken: string) => Promise<void>
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
	selectedIds: [],
	loading: false,
	error: null,

	toggle: id =>
		set(state => ({
			selectedIds: state.selectedIds.includes(id)
				? state.selectedIds.filter(item => item !== id)
				: [...state.selectedIds, id],
		})),

	clearSelection: () => set({ selectedIds: [] }),

	deleteMessages: async (accessToken: string) => {
		const { selectedIds } = get()

		if (selectedIds.length === 0) return

		try {
			set({ loading: true, error: null })

			const { data } = await api.post(
				'/api/messages/bulk-delete',
				{
					external_ids: selectedIds,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			if (data.deleted > 0) {
				set({ selectedIds: [] })
			}
		} catch (err: any) {
			set({
				error:
					err?.response?.data?.error?.detail ||
					err?.response?.data?.detail ||
					'Ошибка удаления сообщений',
			})
		} finally {
			set({ loading: false })
		}
	},
}))
