<script setup lang="ts">
import { pages } from 'utils/route';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import useLayoutTabsStore from 'stores/layoutTabs';
import type { TabItem } from 'stores/layoutTabs';

const { mdAndDown } = useDisplay();
const isMobile = ref(true);
watch(mdAndDown, (newVal) => {
  isMobile.value = newVal;
}, { immediate: true });

const layoutTabState = useLayoutTabsStore();
const extTabs = ref<TabItem[]>([]);
const tabValue = ref<string>(useRoute().path);

const updateTab = async (to: ReturnType<typeof useRoute>) => {
  tabValue.value = to.path;
  layoutTabState.setExtTabs_(to.path);
  extTabs.value = layoutTabState.extTabs_
    .map((item) => ({
      ...item,
      class: 'text-transform-none'
    }));
  // await nextTick();
  // layoutTabState.setExtTabValue_(to.path);
};
const router = useRouter();
router.beforeEach(updateTab);
onMounted(() => updateTab(useRoute()));
</script>

<template>
  <v-app-bar
    elevation="2"
    density="compact"
  >
    <v-app-bar-title
      v-once
      tag="h1"
      class="flex-0-0"
      style="user-select: none;"
    >
      <v-list-item
        class="text-h6 font-weight-bold"
        :to="pages[0].path"
        variant="text"
        :ripple="false"
        :active="false"
      >
        機率計算機
      </v-list-item>
    </v-app-bar-title>
    <v-tabs
      class="flex-1-1-100 ms-16"
      hide-slider
    >
      <v-tab
        v-for="page in pages.slice(1)"
        v-once
        :key="page.title"
        class="text-body-1"
        :to="page.path"
      >
        {{ page.title }}
      </v-tab>
    </v-tabs>

    <template
      v-if="!isMobile && extTabs.length"
      #extension
    >
      <v-tabs
        class="w-100"
        bg-color="primary"
        align-tabs="center"
        :items="extTabs"
        :model-value="layoutTabState.extTabValue_"
        @update:model-value="layoutTabState.setExtTabValue_($route.path, $event as string)"
      />
    </template>
  </v-app-bar>

  <v-main class="bg-grey-lighten-44">
    <slot />
  </v-main>
</template>
