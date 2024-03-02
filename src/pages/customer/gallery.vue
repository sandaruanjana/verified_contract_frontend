<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import CustomerGallery from '/@src/components/pages/customer/gallery/CustomerGallery.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Gallery')

useHead({
  title: 'Gallery - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <CustomerGallery />
  </div>
</template>
