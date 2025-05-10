<script setup lang="ts">
import { pages } from 'utils/route';
import useLayoutTabsStore from 'stores/layoutTabs';
import { useDisplay } from 'vuetify';
import type { TabItem } from 'stores/layoutTabs';

const { mdAndDown: isMobile } = useDisplay();

const layoutTabState = useLayoutTabsStore();
const extTabs = ref<TabItem[]>([]);

const updateTab = async (to: ReturnType<typeof useRoute>) => {
  extTabs.value =
    layoutTabState.updateTabs(to.path)
      .map((item) => ({
        class: 'text-transform-none',
        ...item,
      }));
};

useRouter().beforeEach(updateTab);
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
        :model-value="layoutTabState.tabIdx"
        @update:model-value="layoutTabState.setExtTab_($route.path, $event as number)"
      />
    </template>
  </v-app-bar>

  <v-main class="bg-grey-lighten-44">
    <slot />
  </v-main>
</template>
