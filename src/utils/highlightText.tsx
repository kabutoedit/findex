import React from 'react'

export const highlightText = (
	text: string,
	search: string
): React.ReactNode => {
	if (!search) return text
	const parts = text.split(new RegExp(`(${search})`, 'gi'))
	return parts.map((part, i) =>
		part.toLowerCase() === search.toLowerCase() ? (
			<mark key={i} style={{ background: '#fff3a3', padding: 0 }}>
				{part}
			</mark>
		) : (
			part
		)
	)
}
