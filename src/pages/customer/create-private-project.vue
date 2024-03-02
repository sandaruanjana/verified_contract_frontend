<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import CreatePrivateProjectForm from '../../components/pages/customer/create-project/CreatePrivateProjectForm.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Create Private Project')

useHead({
  title: 'Create Private Project - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <CreatePrivateProjectForm />
  </div>
</template>
