<script setup lang="ts">
import { toMargin } from 'utils/helpers';

type Props = {
  tag?: string
  label: string,
  margin?: string | string[],
  align?: string | boolean,
  icon?: string,
}
const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  margin: 'y-2',
  align: 'center',
});

const margin_ = computed(() => toMargin(props.margin));
const align_ = computed(() =>
  !props.align ? undefined :
    props.align === true ? 'text-center' :
      `text-${props.align}`
);
</script>

<template>
  <component
    :is="tag"
    :class="[
      margin_,
      align_
    ]"
  >
    <slot />
    {{ label }}
    <v-icon
      v-if="icon"
      :icon="`mdi-${icon}`"
    />
  </component>
</template>
