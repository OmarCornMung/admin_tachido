<template>
  <div>
    <v-progress-circular
      v-if="globalProgressStore.visible"
      :size="globalProgressStore.size"
      :width="globalProgressStore.width"
      :color="globalProgressStore.color"
      :indeterminate="globalProgressStore.indeterminate"
    ></v-progress-circular>
  </div>
</template>

<script setup>
import { useGlobalProgressStore } from '@/store/globalProgress';
const globalProgressStore = useGlobalProgressStore()

// Cuando quieras mostrar el progreso global
function showGlobalProgress() {
  useGlobalProgressStore.show();
}

// Cuando quieras ocultar el progreso global
function hideGlobalProgress() {
  useGlobalProgressStore.hide();
}
</script>
