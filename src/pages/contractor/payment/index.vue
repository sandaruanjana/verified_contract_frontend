<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contractor Dashboard')

useHead({
  title: 'Contractor Dashboard - Payment',
})
</script>

<template>
  <div class="page-content-inner">
    <ApprovePayment />
  </div>
</template>
