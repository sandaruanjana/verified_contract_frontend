<script setup lang="ts">
import { useUserSession } from '/@src/stores/userSession'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { basic_url } from '/@src/utils/basic_config'

const router = useRouter()
const userSession = useUserSession()

let user: any = useStorage('user', [])

const username = ref<string>(user.value.name)
const position = ref<string>(user.value.role)

const profile_image = ref<string>(
  user.value.profilePicture === null
    ? '/src/assets/image/profile.png'
    : basic_url + '/api/uploads/profile_picture/' + user.value.profilePicture
)

async function logout() {
  const isLogout = await userSession.logoutUser()
  if (isLogout) {
    router.push({
      name: 'auth-login',
    })
  }
}
</script>

<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a tabindex="0" class="is-trigger dropdown-trigger" aria-haspopup="true" @keydown.space.prevent="toggle"
        @click="toggle">
        <VAvatar :picture="profile_image" />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar size="large" :picture="profile_image" />

        <div class="meta">
          <span>{{ username }}</span>
          <span>{{ position }}</span>
        </div>
      </div>

      <a v-if="position === 'CUSTOMER'" href="/customer/profile" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-user-alt"></i>
        </div>
        <div class="meta">
          <span>Profile</span>
          <span>View your profile</span>
        </div>
      </a>
      <a v-if="position === 'CONTRACTOR'" href="/contractor/profile" role="menuitem" class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-user-alt"></i>
        </div>
        <div class="meta">
          <span>Profile</span>
          <span>View your profile</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <a v-if="position === 'CONTRACTOR'" href="/contractor/profile-edit" role="menuitem"
        class="dropdown-item is-media">
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-cog"></i>
        </div>
        <div class="meta">
          <span>Settings</span>
          <span>Setup Profile View</span>
        </div>
      </a>

      <a v-if="position === 'CONTRACTOR'" href="/contractor/payment" role="menuitem" class="dropdown-item is-media">
        <!-- <div class="icon">
          <i class="lnir lnir-dollar" aria-hidden="true"></i>
        </div>
        <div class="meta">
          <span>Payment</span>
          <span>Pay the subscription</span>
        </div> -->
      </a>

      <!-- <hr class="dropdown-divider" /> -->

      <div class="dropdown-item is-button">
        <VButton class="logout-button" icon="feather:log-out" color="primary" role="menuitem" raised fullwidth
          @click="logout">
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
