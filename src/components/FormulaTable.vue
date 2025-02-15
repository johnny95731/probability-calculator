<script setup lang="ts">
import type { Nullish } from '~/utils/type-helpers';


type Props = {
  title?: string
  formula: (string | number | Nullish)[][]
}
defineProps<Props>();
</script>

<template>
  <table class="formula-table">
    <caption v-if="title || $slots.title">
      <slot name="title">
        {{ title }}
      </slot>
    </caption>
    <tbody>
      <tr
        v-for="(row, i) in formula"
        :key="i"
      >
        <td
          v-for="(text) in row"
          :key="`${i}-${text}`"
        >
          {{ text }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
.formula-table {
  margin-left: auto;
  margin-right: auto;
  padding: 8px 12px;
  td {
    text-align: left !important;
    word-spacing: 4px;
    &:first-of-type {
      min-width: 60px;
    }
  }
}
</style>
