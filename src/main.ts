import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);

  const pinia = createPinia(); // ✅ 正确

  app.use(pinia);

  return {
    app,
    pinia,
  };
}