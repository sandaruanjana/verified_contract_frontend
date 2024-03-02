<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Public Projects')

useHead({
  title: 'Public Projects - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <PublicProjects />
  </div>
</template>
