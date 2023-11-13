// store/globalProgress.js

import { defineStore } from 'pinia';

export const useGlobalProgressStore = defineStore('globalProgress', {
  state: () => ({
    visible: false,
    size: 70,
    width: 7,
    color: 'purple',
    indeterminate: true,
  }),

  actions: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
  },
});
