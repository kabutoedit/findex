import {
	CameraIcon,
	ClosedEyeIcon,
	EyeIcon,
	PencilIcon,
} from '@/components/icons/icons'
import { useProfileLogic } from '../hooks/useProfileLogic'
import styles from './ProfileBlock.module.scss'

export default function ProfileBlock() {
	const {
		state: {
			data,
			name,
			lastName,
			password,
			confirmPassword,
			avatarPreview,
			isPending,
		},
		handlers: {
			setName,
			setLastName,
			setPassword,
			setConfirmPassword,
			setAvatar,
			setAvatarPreview,
			handleSave,
		},
	} = useProfileLogic()
	if (!data) return null

	return (
		<>
			<div className={styles.block}>
				<div className={styles.img}>
					<img
						src={
							avatarPreview === null
								? data?.avatar_url || '/defaultProfilePicture.jpg'
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
						Тариф: <strong>{data.subscription_plan}</strong>{' '}
					</p>
					<div className={styles.inputsBlock}>
						<label htmlFor='firstNameInput'>
							Имя
							<div className={styles.inputContainer}>
								<input
									id='firstNameInput'
									type='text'
									placeholder={data.first_name}
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
									placeholder={data.last_name}
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
						{password && !confirmPassword && (
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
		</>
	)
}
