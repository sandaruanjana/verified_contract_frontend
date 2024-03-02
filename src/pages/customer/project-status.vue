<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import ProjectStatus from '/@src/components/pages/customer/project-status/ProjectStatus.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Project Status')

useHead({
  title: 'Project Status - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <ProjectStatus />
  </div>
</template>
