import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_URL,
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: ['~/assets/css/main.css'],

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    //...
  ],

  //...
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  image: {
   cloudflare: {
     baseURL: process.env.CF_ASSETS || 'https://pub-847f5b30729b4700b804476003b4f8cf.r2.dev/test'
   }
 },

  devtools: {
    timeline: {
      enabled: true,
    },
  },
})