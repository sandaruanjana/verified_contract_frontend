<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Add Progress')

useHead({
  title: 'Add Progress - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <MainProgress />
  </div>
</template>
