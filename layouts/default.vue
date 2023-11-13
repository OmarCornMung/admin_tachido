 <template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/lego/2.jpg"
          :title="user"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            @click="goToPage('productos')"
            prepend-icon="mdi-tshirt-v"
            title="Productos"
          ></v-list-item>
          <v-list-item
            @click="goToPage('ordenes')"
            prepend-icon="mdi-cart-arrow-right"
            title="Ordenes"
          ></v-list-item>
          <v-list-item
            class="logout-item"
            @click="logout"
            prepend-icon="mdi-logout"
            title="Cerrar Sesión"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="h-full">
        <slot />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";

const { user } = storeToRefs(useAuthStore());
const drawer = ref(true);
const rail = ref(true);

const goToPage = (page) => {
  const router = useRouter();
  router.push({ path: `/${page}` });
};

const logout = async () => {
  const router = useRouter();
  await useAuthStore().logout();
  await router.push("/login");
};
</script>

