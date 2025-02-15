<script setup lang="ts">
import IndependentEvent from 'components/event-probability/IndependentEvent.vue';
import DependentEvent from '~/components/event-probability/DependentEvent.vue';
import BayesTheorem from 'components/event-probability/BayesTheorem.vue';
import useLayoutTabsStore from '~/stores/layoutTabs';

useHead({
  title: 'Probability Calculator - Event Probability',
});

const layoutTabState = useLayoutTabsStore();
const currentIdx = computed(() => layoutTabState.extTabIdx_);
</script>

<template>
  <v-container
    class="d-flex flex-column h-100 pa-0 bg-white"
    max-width="950"
  >
    <IndependentEvent v-show="currentIdx === 0" />
    <DependentEvent v-show="currentIdx === 1" />
    <BayesTheorem v-show="currentIdx === 2" />
  </v-container>
</template>
