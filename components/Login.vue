<template>
  <div
    class="flex md:flex-wrap h-screen justify-center items-center px-6 py-8 lg:px-8"
  >
    <div class="">
      <NuxtImg provider="cloudflare" class="w-80" src="/tachidob.png" />
    </div>

    <v-card class="w-80">
      <div class="text-subtitle-1 text-medium-emphasis">Email</div>

      <v-text-field
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="email"
      />
      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Ingresar Contraseña"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      />
      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        @click="handleLogin"
      >
        Iniciar Sesión
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Registrarse <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="alert.show"
      :timeout="alert.timeout"
      :color="alert.type"
      bottom
      center
    >
      {{ alert.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "~/store/auth";
const authStore = useAuthStore();
const router = useRouter()
const email = ref("");
const password = ref("");
const visible = ref(false);

const alert = ref({
  show: false,
  type: "error",
  timeout: 3000,
  message: "Mensaje de alerta" 
});

const handleLogin = async () => {
  try {
    const response = await authStore.login(email.value, password.value);
    if (response.status === 200) {
      await router.push('/productos');
    } else {
      alert.value.show = true;
      alert.value.message = response.data;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>
