'use client'
import styles from '../style.module.scss'
import { useEffect, useState } from 'react'
import {
	CameraIcon,
	ClosedEyeIcon,
	EyeIcon,
	PencilIcon,
} from '@/components/icons/icons'
import { api, fetchMe } from '@/app/api/api'
import { useFiltersStore } from '@/store/useMessagesFilters.store'
import { ProfileData } from '@/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

async function updateMe(payload: {
	first_name?: string
	password?: string | false
	last_name?: string
	username?: string
	email?: string
	avatar?: File
}) {
	const formData = new FormData()

	if (payload.first_name) formData.append('first_name', payload.first_name)
	if (payload.last_name) formData.append('last_name', payload.last_name)
	if (payload.first_name && payload.last_name)
		formData.append('username', payload.first_name + ' ' + payload.last_name)
	if (payload.email) formData.append('email', payload.email)
	if (payload.avatar) formData.append('avatar', payload.avatar)

	const passwordFormData = new FormData()

	if (payload.password)
		passwordFormData.append('new_password', payload.password)

	const res = await api.patch('/api/me/', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})

	const passwordRes = await api.post(
		'/api/password-reset/confirm',
		passwordFormData,
		{
			headers: { 'Content-Type': 'multipart/form-data' },
		}
	)
	return res.data, passwordRes.data
}

export default function Profile() {
	const queryClient = useQueryClient()
	const { setTariff } = useFiltersStore()

	const { data } = useQuery<ProfileData>({
		queryKey: ['me'],
		queryFn: fetchMe,
	})

	useEffect(() => {
		if (data) {
			setTariff(data.subscriptionPlan || 'basic')
		}
	}, [data, setTariff])

	const [name, setName] = useState(data?.firstName || '')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [lastName, setLastName] = useState(data?.lastName || '')
	const [avatar, setAvatar] = useState<File | null>(null)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

	const confirmedPassword = () => {
		if (password === confirmPassword) {
			return password
		}

		return false
	}

	const { mutate, isPending } = useMutation({
		mutationFn: updateMe,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['me'] })
		},
	})

	const handleSave = () => {
		mutate({
			first_name: name,
			last_name: lastName,
			password: confirmedPassword(),
			...(avatar && { avatar }),
		})
	}

	if (!data) return null
	console.log(data)

	return (
		<div
			className={styles.Page}
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				gap: '20px',
			}}
		>
			<div className={styles.block}>
				<div className={styles.img}>
					<img
						src={
							avatarPreview === null
								? data?.avatarUrl || '/defaultProfilePicture.jpg'
								: avatarPreview
						}
						alt='profile picture'
					/>
					<div
						className={styles.changeImage}
						onClick={() => document.getElementById('avatarInput')?.click()}
					>
						<input
							type='file'
							id='avatarInput'
							accept='image/*'
							style={{ display: 'none' }}
							onChange={e => {
								const file = e.target.files?.[0]
								if (file) {
									setAvatar(file)
									setAvatarPreview(URL.createObjectURL(file))
								}
							}}
						/>
						<CameraIcon />
					</div>
				</div>
				<div className={styles.passwordBlock}>
					<p className={styles.subscription_plan}>
						Тариф: <strong>{data.subscriptionPlan}</strong>{' '}
					</p>
					<div className={styles.inputsBlock}>
						<label htmlFor='firstNameInput'>
							Имя
							<div className={styles.inputContainer}>
								<input
									id='firstNameInput'
									type='text'
									placeholder={data.firstName}
									onChange={e => setName(e.target.value)}
									value={name}
								/>
								<PencilIcon />
							</div>
						</label>

						<label htmlFor='lastNameInput'>
							Фамилия
							<div className={styles.inputContainer}>
								<input
									id='lastNameInput'
									type='text'
									placeholder={data.lastName}
									onChange={e => setLastName(e.target.value)}
									value={lastName}
								/>
								<PencilIcon />
							</div>
						</label>
					</div>
				</div>
			</div>
			<div className={styles.changeBlock}>
				<h3>Сменить пароль</h3>
				<div className={styles.inputsBlock}>
					<label htmlFor='newPassword'>
						Новый пароль
						<div className={styles.inputContainer}>
							<input
								id='newPassword'
								type='password'
								onChange={e => setPassword(e.target.value)}
							/>
							<ClosedEyeIcon />
						</div>
					</label>

					<label htmlFor='confirmPassword'>
						Подтверждение нового пароля
						<div className={styles.inputContainer}>
							<input
								id='confirmPassword'
								type='password'
								onChange={e => setConfirmPassword(e.target.value)}
							/>
							<EyeIcon />
						</div>
						{password && confirmPassword && !confirmedPassword() && (
							<span style={{ color: 'red' }}>Пароли не совпадают</span>
						)}
					</label>
				</div>
			</div>
			<button
				className={styles.safeBtn}
				onClick={handleSave}
				disabled={isPending}
			>
				{isPending ? 'Сохранение...' : 'Сохранить изменения'}
			</button>
		</div>
	)
}
