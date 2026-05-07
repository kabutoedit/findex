export interface AuthorsSortProps {
	selected: 'quantity' | 'date'
	onChange: (value: 'quantity' | 'date') => void
}
