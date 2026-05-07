'use client'
import { useChatLogic } from '../hooks/useChatLogic'
import ReactMarkdown from 'react-markdown'
import styles from './Chat.module.scss'

export default function Chat() {
	const { messages, handleSend, status, input, setInput, bottomRef } =
		useChatLogic()

	return (
		<div className={styles.wrapper}>
			<div className={styles.messages}>
				{messages.length === 0 && <p className={styles.empty}>Начни диалог</p>}

				{messages.map((m, i) => {
					const isUser = m.role === 'user'
					return (
						<div
							key={i}
							className={`${styles.row} ${
								isUser ? styles.rowUser : styles.rowAi
							}`}
						>
							<div
								className={`${styles.bubble} ${
									isUser ? styles.bubbleUser : styles.bubbleAi
								}`}
							>
								{isUser ? (
									m.content
								) : (
									<ReactMarkdown>{m.content}</ReactMarkdown>
								)}
							</div>
						</div>
					)
				})}

				{status === 'loading' && (
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
							handleSend()
						}
					}}
				/>
				<button
					className={styles.sendBtn}
					disabled={status !== 'ready' || !input.trim()}
					onClick={handleSend}
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
