<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import FavouriteContractor from '/@src/components/pages/customer/favourite-contractor/FavouriteContractor.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Favourite Contractors')

useHead({
  title: 'Favourite Contractors - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <FavouriteContractor />
  </div>
</template>
