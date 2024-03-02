<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

const user: any = useStorage('user', [])
const home = ref()

if (user.value.role === 'CONTRACTOR') {
  home.value = 'contractor'
} else {
  home.value = 'customer'
}
</script>

<template>
  <VPlaceholderPage
    title="We couldn't find any matching results."
    subtitle="Too bad. Looks like we couldn't find any matching results. try again later."
    larger
  >
    <template #image>
      <img
        class="light-image"
        src="/@src/assets/illustrations/placeholders/search-1.svg"
        alt=""
      />
      <img
        class="dark-image"
        src="/@src/assets/illustrations/placeholders/search-1-dark.svg"
        alt=""
      />
    </template>
    <template #action>
      <VButton v-if="home === 'customer'" :to="{ name: 'customer' }" color="primary"
        >Go Home</VButton
      >
      <VButton v-else :to="{ name: 'contractor' }" color="primary">Go Home</VButton>
    </template>
  </VPlaceholderPage>
</template>
