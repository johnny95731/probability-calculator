<script setup lang="ts">
import { VSelect, VTextField } from 'vuetify/components';
import type { Param, Range } from '~/utils/distributions/common';

type Props = {
  type?: 'text' | 'number' | 'select',
  label?: string,
  prependText?: string,
  param?: Param | Range,
  message?: string | null,
  tooltip?: string,
}
const props = withDefaults(defineProps<Props>(), {
  type: 'number',
});

const text = computed<string | undefined>(() => {
  return props.prependText ?? (props.label ?? (props.param as Param | undefined)?.name);
});

const tag = computed<typeof VSelect | typeof VTextField>(() => {
  return props.type === 'select' ? VSelect : VTextField;
});

const bind = computed(() => {
  if (props.type === 'text' || props.type === 'number') {
    const param = props.param;
    return {
      type: props.type,
      min: param?.min,
      max: param?.max,
      step: param?.step,
      hideSpinButtons: true,
      errorMessages: props.message,
    };
  }
  else
    return {
    };
});

</script>

<template>
  <component
    :is="tag"
    v-bind="bind"
    class="param-input"
    :label="label"
    width="240"
  >
    <template
      v-if="text"
      #prepend
    >
      <slot
        name="prepend"
        :props="{class:'param-input__text'}"
        :text="text"
      >
        <div class="param-input__text">
          {{ text }}
          <v-tooltip
            v-if="tooltip"
            activator="parent"
            location="bottom"
            text="tooltip"
          />
        </div>
      </slot>
    </template>
    <template #append>
      <slot
        name="append"
        :props="{class:'param-input__text'}"
      />
    </template>
  </component>
</template>

<style lang="scss">
$padding: 4px;
.param-input {
  margin-top: 4px;
  > .v-input__control .v-field__input {
    padding-inline-start: 8px !important;
    padding-top: $padding;
    padding-bottom: $padding;
  }
  > .v-input__prepend {
    margin-inline-end: 8px !important;
  }

  &__text {
    width: 100px;
    text-align: right;
    cursor: default;
  }

  .v-input__details {
    grid-column-start: a;
    grid-column-end: b;
    padding-inline: 0px !important;
    padding-inline-start: 8px !important;
    font-size: 0.875rem;
  }
}
</style>
