<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Edit Profile')

useHead({
  title: 'Edit Profile - Verified Contracting',
})
</script>

<template>
  <EditProfile />
</template>
