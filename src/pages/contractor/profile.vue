<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useLayoutSwitcher } from '/@src/stores/layoutSwitcher'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'

const viewWrapper = useViewWrapper()
const panels = usePanels()

const layoutSwitcher = useLayoutSwitcher()

viewWrapper.setPageTitle('Edit Profile')

useHead({
  title: 'Edit Profile - Verified Contracting',
})
</script>

<template>
  <component
    :is="layoutSwitcher.dynamicLayoutComponent"
    v-bind="layoutSwitcher.navbarLayoutComponent"
    close-on-change
    default-sidebar="dashboard"
    nowrap
  >
    <ContractorProfileSettings>
      <template #header>
        <div class="content-section-header">
          <h2 class="title is-4 is-narrow">Edit Profile</h2>
        </div>
      </template>
    </ContractorProfileSettings>
  </component>
</template>
