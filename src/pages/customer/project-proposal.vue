<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Project Proposals')

useHead({
  title: 'Project Proposals - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <ProjectProposals />
  </div>
</template>
