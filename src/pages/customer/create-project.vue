<route lang="yaml">
meta:
  requiresAuth: true
</route>

<template>
  <div class="page-content-inner">
    <CustomerCreateProject />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import CustomerCreateProject from '/@src/components/pages/customer/create-project/CustomerCreateProject.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Create Project')

useHead({
  title: 'Create Project - Verified Contracting',
})
</script>