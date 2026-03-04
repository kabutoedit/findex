'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../store/auth.store'
import { useState } from 'react'
import styles from './style.module.scss'
import { api } from '@/src/lib/api'

export default function LoginPage() {
	const login = useAuthStore(s => s.login)
	const logout = useAuthStore(s => s.logout)
	const router = useRouter()
	const [userName, setUserName] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	console.log(error)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!userName.trim() || !password.trim()) {
			setError('Все поля обязательны для заполнения')
			return
		}

		try {
			const { data } = await api.post('/api/auth/token/', {
				username: userName,
				password: password,
			})

			localStorage.setItem('access', data.access)
			localStorage.setItem('refresh', data.refresh)

			login()
			document.cookie = `auth=${data.access}; path=/`
			router.push('/messages')
			setError('')
		} catch (error: any) {
			if (error.response?.status === 401 || error.response?.status === 400) {
				setError('Неверный логин или пароль')
			} else {
				setError('Ошибка сервера')
			}
		}
	}

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value)
		if (error) setError('')
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value)
		if (error) setError('')
	}

	return (
		<form className={styles.logIn} onSubmit={handleSubmit}>
			<h2 className={styles.title}>Вход в систему</h2>

			<label className={styles.field}>
				<input
					type='text'
					placeholder='Username'
					value={userName}
					onChange={handleEmailChange}
				/>
				<svg
					className={styles.icon}
					width='28'
					height='25'
					viewBox='0 0 28 25'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M14.5 12.375C17.3878 12.375 19.75 10.2656 19.75 7.6875C19.75 5.10942 17.3878 3 14.5 3C11.6122 3 9.25 5.10942 9.25 7.6875C9.25 10.2656 11.6122 12.375 14.5 12.375ZM14.5 14.7188C11.022 14.7188 4 16.3009 4 19.4062V21.75H25V19.4062C25 16.3009 17.978 14.7188 14.5 14.7188Z'
						fill='#4D4D4D'
					/>
				</svg>
			</label>

			<label className={styles.field}>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={handlePasswordChange}
				/>
				<svg
					className={styles.iconSmall}
					width='18'
					height='18'
					viewBox='0 0 18 18'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M14.625 6.3V4.5C14.625 1.98 12.15 0 9 0C5.85 0 3.375 1.98 3.375 4.5V6.3C1.4625 6.3 0 7.47 0 9V15.3C0 16.83 1.4625 18 3.375 18H14.625C16.5375 18 18 16.83 18 15.3V9C18 7.47 16.5375 6.3 14.625 6.3ZM5.625 4.5C5.625 2.97 7.0875 1.8 9 1.8C10.9125 1.8 12.375 2.97 12.375 4.5V6.3H5.625V4.5ZM10.125 13.5C10.125 14.04 9.675 14.4 9 14.4C8.325 14.4 7.875 14.04 7.875 13.5V10.8C7.875 10.26 8.325 9.9 9 9.9C9.675 9.9 10.125 10.26 10.125 10.8V13.5Z'
						fill='#4D4D4D'
					/>
				</svg>
			</label>

			{error && <p className={styles.error}>{error}</p>}

			<button
				className={`${styles.button} ${
					userName && password ? styles.filled : ''
				}`}
				type='submit'
			>
				Войти
			</button>
		</form>
	)
}
