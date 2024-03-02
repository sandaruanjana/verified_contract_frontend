<script setup lang="ts">
import {useHead} from '@vueuse/head'

import {useViewWrapper} from '/@src/stores/viewWrapper'
import ContractorViewProfile from "/@src/components/pages/contractor/profile/ContractorViewProfile.vue";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from 'vue-router'

const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Profile View')

useHead({
  title: 'Contractor Profile View',
})

const role = ref<any>('')
const id = ref<any>(0)


onMounted(async () => {
  if (route.query.role && route.query.id && (route.query.role === 'contractor' || route.query.role === 'customer')) {
    role.value = route.query.role
    id.value = route.query.id
  } else {
    await router.push({name: 'error'})
  }
  console.log('hi', route.query.role, route.query.id)
})

</script>

<template>
  <div class="page-content-inner pt-3">
    <div v-if="role === 'contractor'">
      <ContractorViewProfile/>
    </div>
    <div v-else-if="role === 'customer'">
      <MainProgress/>
    </div>
  </div>
</template>

