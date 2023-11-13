import { defineStore } from 'pinia'

/*
Storage to handle user authentication
* */
export const useAuthStore = defineStore('auth', {
  // TODO: Update to include getters
  state: () => ({
    user: {},
    token: '',
    roles: null,
    isAuthenticated: false,
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    allowedMenu: null
  }),
  persist: {
    storage: persistedState.sessionStorage
  },
  actions: {

    /*
    Axios calls can be generated as plugins or models, check if Nuxt3 supports.
    => to use 'axios.create()'
    * */
    async login(email, password) {
      const { $axios } = useNuxtApp()

      try {
        const response = await $axios.post('/api/login', {
          'email': email,
          'password': password
        });

        // axios adds an additional "data" attribute to the response
        console.log(response);

        if (response.status === 401 || response.status === 500){
            return response
        }

        this.user = response.data.username
        this.token = response.data.token
        this.isAuthenticated = true
        return response

      } catch (error) {
        throw error;
      }
    },

    async logout() {
      const { $axios } = useNuxtApp()

      const response = await $axios.post('/api/logout')

      this.user = null
      this.token = ''
      this.isAuthenticated = false
      this.allowedMenu = null
    },

    async changeTemporalPassword(id, password) {
      const { $axios } = useNuxtApp()
      try {
        const { data } = (await $axios.put(`/user/password/${id}`, { password })).data
        this.user.isFirstAccess = data?.isFirstAccess
      } catch (error) {
        throw new Error(error.message)
      }
    },

    async changeCompanyData(form) {
      const { $axios } = useNuxtApp()

      try {
        await $axios.put('/company/information', form)
        const { data } = (await $axios.get('/getInfo')).data
        this.user = data
        
      } catch (error) {
        throw new Error(error.message)
      }
    }
  },
})
