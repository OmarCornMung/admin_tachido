import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify, Vuetify } from 'vuetify';
import { VDataTable, VDataTableServer, VDataTableVirtual } from 'vuetify/labs/VDataTable';

export default defineNuxtPlugin((app) => {
  const vuetify: Vuetify = createVuetify({
    // ... your configuration
    components: {
      VDataTable,
      VDataTableServer,
      VDataTableVirtual,
    },
  });
  app.vueApp.use(vuetify);
});
