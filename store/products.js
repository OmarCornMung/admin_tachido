import { defineStore } from 'pinia'

/*
Storage to handle user authentication
* */
export const useProductStore = defineStore('product', {
  // TODO: Update to include getters
  state: () => ({
    products: []
  }),
  persist: {
    storage: persistedState.sessionStorage
  },
  actions: {

    async getProducts() {
      const { $axios } = useNuxtApp()
      const response = (await $axios('/api/products'))?.data
      this.products = response
    },

    async createProduct(data) {
      const { $axios } = useNuxtApp()
      try {
        const response = await $axios.post('/api/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })
        return response
      } catch (error) {
        throw new Error
      }
    },

    async deleteProduct(id) {
      const { $axios } = useNuxtApp();
      try {
        const response = await $axios.delete(`/api/products/${id}`);
        // Realizar alguna lógica adicional si es necesario
        console.log('Product deleted successfully', response.data);
        // Volver a cargar la lista de productos después de eliminar uno
        await this.getProducts();
      } catch (error) {
        console.error(error);
        throw new Error('Failed to delete product');
      }
    },

    async updateProduct({ id, data }) {
      const { $axios } = useNuxtApp();
      try {
        const response = await $axios.put(`/api/products/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Realizar alguna lógica adicional si es necesario
        console.log('Product updated successfully', response.data);
        // Volver a cargar la lista de productos después de actualizar uno
        await this.getProducts();
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update product');
      }
    },

  },
})
