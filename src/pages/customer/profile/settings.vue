<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Edit Profile Settings')

useHead({
  title: 'Edit Profile Settings - Verified Contracting',
})
</script>

<template>
  <CustomerProfileSettings />
</template>
