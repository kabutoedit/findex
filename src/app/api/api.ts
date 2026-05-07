import axios from 'axios'
import router from 'next/router'

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem('access')

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			const refresh = localStorage.getItem('refresh')

			if (!refresh) {
				localStorage.removeItem('access')
				router.push('/login')
				return Promise.reject(error)
			}

			try {
				const { data } = await api.post('/api/auth/token/refresh/', { refresh })
				localStorage.setItem('access', data.access)
				originalRequest.headers.Authorization = `Bearer ${data.access}`
				return api.request(originalRequest)
			} catch (err) {
				localStorage.removeItem('access')
				localStorage.removeItem('refresh')
				router.push('/login')
				return Promise.reject(err)
			}
		}

		return Promise.reject(error)
	}
)
