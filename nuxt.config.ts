import { join } from 'path';
import { fileURLToPath, URL } from 'url';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

const srcDir = 'src';
const fromSrcDir = (path: string) => {
  return fileURLToPath(new URL(join(srcDir, path), import.meta.url));
};

const baseURL = (
  !process.env.LIVE && process.env.NODE_ENV === 'production' ?
    '/probability-calculator/' :
    '/'
);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-01',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  ssr: true,
  features: {
    devLogs: true,
  },

  app: {
    baseURL,
    buildAssetsDir: 'static/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  srcDir,
  alias: {
    'assets': fromSrcDir('assets'),
    'components': fromSrcDir('components'),
    'stores': fromSrcDir('stores'),
    'utils': fromSrcDir('utils'),
  },

  imports: {
    scan: false
  },

  build: {
    transpile: ['vuetify'],
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    fromSrcDir('assets/global-class.scss'),
  ],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({
          autoImport: true,
        }));
      });
    },
    '@nuxt/eslint',
    '@pinia/nuxt',
  ],

  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: ['log', 'time', 'timeEnd']
        },
      }
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    vue: {
      template: { transformAssetUrls }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
    },
  },
});
