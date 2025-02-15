import { defineNuxtPlugin } from '#app';
import { createVuetify } from 'vuetify';
import { defaults } from 'utils/vuetify/defaults';
import { light } from 'utils/vuetify/light';


export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults,
    theme: {
      defaultTheme: 'light',
      themes: {
        light
      }
    }
  });
  app.vueApp.use(vuetify);
});
