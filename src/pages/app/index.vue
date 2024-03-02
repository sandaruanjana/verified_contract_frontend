<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Dashboard')

useHead({
  title: 'Customer Dashboard - Verified Contracting',
})
</script>

<template>
  <div class="page-content-inner">
    <!-- <FlightsDashboard /> -->
    <CustomerDashboard />
  </div>
</template>
