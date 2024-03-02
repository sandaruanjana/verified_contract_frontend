<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { onActivated, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

window.location.href = `/auth/login`
</script>

<template></template>

<style lang="scss">
</style>
