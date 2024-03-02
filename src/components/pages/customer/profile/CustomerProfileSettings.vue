<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>Settings</h3>
          <p>Edit your account prefs and settings</p>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton
              :to="{ name: 'customer' }"
              icon="lnir lnir-arrow-left rem-100"
              light
              dark-outlined
            >
              Go Back
            </VButton>
            <VButton
              color="primary"
              raised
              :loading="isLoading"
              tabindex="0"
              @keydown.space.prevent="onSave"
              @click="onSave"
            >
              Save Changes
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <form class="form-body" @submit.prevent="onSave">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Change Password</h4>
          <p>For an improved account security</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:unlock">
                <input
                  v-model="current_password"
                  type="password"
                  class="input"
                  placeholder="Old Password"
                  autocomplete="current-password"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input
                  v-model="new_password"
                  type="password"
                  class="input"
                  placeholder="New Password"
                  autocomplete="new-password"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input
                  v-model="confirm_password"
                  type="password"
                  class="input"
                  placeholder="Repeat New Password"
                  autocomplete="new-password"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useStorage, useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { userService } from '/@src/service/user-service'
import { useUserSession } from '/@src/stores/userSession'
import { useRoute, useRouter } from 'vue-router'
import sleep from '/@src/utils/sleep'

const notyf = useNotyf()
const { y } = useWindowScroll()
const router = useRouter()
const userSession = useUserSession()

let user: any = useStorage('user', [])

const isLoading = ref(false)
const id = ref<string>(user.value.id)
const current_password = ref()
const new_password = ref()
const confirm_password = ref()

const isScrolling = computed(() => {
  return y.value > 30
})

const onSave = async () => {
  isLoading.value = true

  if (new_password.value !== confirm_password.value) {
    notyf.error('New password and repeat new password does not match!')
    isLoading.value = false
    return
  }

  if (!Boolean(current_password.value)) {
    notyf.error('Old password is required')
    isLoading.value = false
    return
  }

  if (!Boolean(new_password.value)) {
    notyf.error('New password is required')
    isLoading.value = false
    return
  }

  if (!Boolean(confirm_password.value)) {
    notyf.error('Repeat new password is required')
    isLoading.value = false
    return
  }

  let updateUserPassword = {
    id: id.value,
    currentPassword: current_password.value,
    password: new_password.value,
  }

  const password_state = await userService.updatePassword(updateUserPassword)

  if (password_state.data.status == 'SUCCESS') {
    notyf.success('Password updated successfully!')
    current_password.value = ''
    new_password.value = ''
    confirm_password.value = ''
    isLoading.value = false
    await userSession.logoutUser()
    router.push({
      name: 'auth',
    })
  } else {
    isLoading.value = false
    notyf.error('Password update failed!')
  }
}
</script>