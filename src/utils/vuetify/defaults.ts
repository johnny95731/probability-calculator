import type { VuetifyOptions } from 'vuetify/lib/framework.mjs';

export const defaults: VuetifyOptions['defaults'] = {
  global: {
    hideDetails: 'auto',
  },
  VRow: {
    noGutters: true
  },
  VTabs: {
    density: 'compact',
  },
  VSelect: {
    singleLine: true,
    density: 'compact',
    variant: 'outlined',
  },
  VTextField: {
    singleLine: true,
    density: 'compact',
    variant: 'outlined',
  },
  VSwitch: {
    density: 'compact',
  },
  VDivider: {
    thickness: 2,
  },
  VIcon: {
    size: 'xsmall'
  }
};
