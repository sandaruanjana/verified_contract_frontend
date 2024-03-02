<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('My Projects')

useHead({
  title: 'My Projects - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <MyProjects />
  </div>
</template>
