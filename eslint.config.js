import withNuxt from './.nuxt/eslint.config.mjs';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';


export default withNuxt(...[
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/strongly-recommended'],
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } }
  },
  {
    rules: {
      'linebreak-style': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
      'func-call-spacing': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/first': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/valid-v-slot': [
        'error',
        {
          allowModifiers: true,
        },
      ],
      'vue/require-default-prop': 'off',
    },
  },
  {
    files: [
      'src/{layouts,components}/{index,default}.vue',
      'src/pages/**.vue',
    ],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
]);
