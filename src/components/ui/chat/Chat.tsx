'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect } from 'react'
import styles from './Chat.module.scss'

export default function Chat() {
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({ api: '/api/chat' }),
	})
	const [input, setInput] = useState('')
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<div className={styles.wrapper}>
			<div className={styles.messages}>
				{messages.length === 0 && <p className={styles.empty}>Начни диалог</p>}

				{messages.map(m => {
					const isUser = m.role === 'user'
					return (
						<div
							key={m.id}
							className={`${styles.row} ${
								isUser ? styles.rowUser : styles.rowAi
							}`}
						>
							<div
								className={`${styles.bubble} ${
									isUser ? styles.bubbleUser : styles.bubbleAi
								}`}
							>
								{m.parts.map((part, i) =>
									part.type === 'text' ? <span key={i}>{part.text}</span> : null
								)}
							</div>
						</div>
					)
				})}

				{status === 'streaming' && (
					<div className={styles.typing}>
						<span />
						<span />
						<span />
					</div>
				)}

				<div ref={bottomRef} />
			</div>

			<div className={styles.inputArea}>
				<textarea
					className={styles.textarea}
					value={input}
					placeholder='Напиши сообщение...'
					rows={1}
					disabled={status !== 'ready'}
					onChange={e => {
						setInput(e.target.value)
						e.target.style.height = 'auto'
					}}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()
							if (input.trim() && status === 'ready') {
								sendMessage({ text: input })
								setInput('')
							}
						}
					}}
				/>
				<button
					className={styles.sendBtn}
					disabled={status !== 'ready' || !input.trim()}
					onClick={() => {
						if (input.trim() && status === 'ready') {
							sendMessage({ text: input })
							setInput('')
						}
					}}
				>
					<svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
						<path
							d='M8 1L15 8L8 15M15 8H1'
							stroke='white'
							strokeWidth='1.8'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</button>
			</div>
		</div>
	)
}
