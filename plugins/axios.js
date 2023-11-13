import axios from 'axios'
import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(nuxtApp => {
  const authStore = useAuthStore()

  const axiosInstance = axios.create({
    baseURL: authStore.baseURL,
    headers: {
        'Content-Type': 'application/json'
      }
  })

  axiosInstance.interceptors.request.use(config => {
    const token = authStore.token

    if (config.url !== '/api/login' && token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }, error => { 
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use(response => {
    return response
  }, async error => {
    if (error.config.url !== '/auth/logout' && error.response.status === 401) {
      await authStore.logout()
    }

    return error
  })

  return {
    provide: {
      axios: axiosInstance
    }
  }
})
