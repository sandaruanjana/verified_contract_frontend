<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'

let user: any = useStorage('user', [])
const position = ref<string>(user.value.Position)
</script>
<template>
  <div v-if="position === 'CONTRACTOR'" class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Dashboard</h3>
      </div>

      <ul class="submenu">
        <li>
          <RouterLink :to="{ name: 'contractor' }">Home</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'contractor-all-public-project' }"
            >Public Projects</RouterLink
          >
        </li>
        <li>
          <RouterLink :to="{ name: 'contractor-my-project' }">My Projects</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'contractor-gallery' }">Gallery</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'contractor-add-progress' }">Add Progress</RouterLink>
        </li>
      </ul>
    </div>
  </div>
  <!-- customer dashboard -->
  <div v-else class="mobile-subsidebar">
    <div class="inner">
      <div class="sidebar-title">
        <h3>Dashboard</h3>
      </div>

      <ul class="submenu">
        <li>
          <RouterLink :to="{ name: 'customer' }">Home</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'customer-create-project' }"
            >Create Project</RouterLink
          >
        </li>
        <li>
          <RouterLink :to="{ name: 'customer-project-proposal' }">Proposals</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'customer-gallery' }">Gallery</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'customer-favourite-contractor' }"
            >Favourite</RouterLink
          >
        </li>
      </ul>
    </div>
  </div>
</template>
