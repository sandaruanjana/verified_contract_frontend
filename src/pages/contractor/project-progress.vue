<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Project Progress')

useHead({
  title: 'Project Progress - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <ProjectProgressView />
  </div>
</template>
