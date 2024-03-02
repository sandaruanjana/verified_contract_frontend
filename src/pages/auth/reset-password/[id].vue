<template>
  <div class="auth-wrapper-inner is-single">
    <!--Fake navigation-->
    <div class="auth-nav">
      <div class="left"></div>
      <div class="center">
        <RouterLink :to="{ name: 'Index' }" class="header-item">
          <img
            src="/@src/assets/logo/HomeAdvisor-1024x275.jpg"
            style="max-width: 150px !important; height: 88px !important; margin-top: 15px"
          />
        </RouterLink>
      </div>
      <div class="right">
        <label
          class="dark-mode ml-auto"
          tabindex="0"
          @keydown.space.prevent="(e) => (e.target as HTMLLabelElement).click()"
        >
          <input
            type="checkbox"
            :checked="!darkmode.isDark"
            @change="darkmode.onChange"
          />
          <span></span>
        </label>
      </div>
    </div>

    <VLoader size="large" :active="isLoading">
      <!--Single Centered Form-->
      <div class="single-form-wrap">
        <div v-if="isShowResetPasswordForm" class="inner-wrap">
          <!--Form Title-->
          <div class="auth-head">
            <p>
              You are only one step a way from your new password, reset your password now.
            </p>
            <RouterLink :to="{ name: 'auth-login' }"> Back to login </RouterLink>
          </div>

          <!--Form-->
          <div class="form-card">
            <form @submit.prevent="handleResetPassword">
              <div class="login-form">
                <!-- Input -->
                <Field v-slot="{ field, errorMessage }" name="password">
                  <VField>
                    <VControl icon="feather:lock" :has-error="Boolean(errorMessage)">
                      <input
                        v-bind="field"
                        class="input"
                        type="password"
                        placeholder="Password"
                        autocomplete="new-password"
                      />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </VControl>
                  </VField>
                </Field>

                <!-- Input -->
                <Field v-slot="{ field, errorMessage }" name="confirmPassword">
                  <VField>
                    <VControl icon="feather:lock" :has-error="Boolean(errorMessage)">
                      <input
                        v-bind="field"
                        class="input"
                        type="password"
                        placeholder="Confirm Password"
                        autocomplete="confirm-password"
                      />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </VControl>
                  </VField>
                </Field>

                <!-- Submit -->
                <VField>
                  <VControl class="login" style="margin-top: 20px">
                    <VButton
                      color="primary"
                      :loading="isLoadingNewPasswordRequest"
                      type="submit"
                      bold
                      fullwidth
                      raised
                    >
                      Change password
                    </VButton>
                  </VControl>
                </VField>
              </div>
            </form>
          </div>
        </div>
        <div v-if="isShowResetLinkExpiredDiv" class="inner-wrap">
          <!--Form Title-->
          <div class="auth-head">
            <p>
              Either the link had already expired or this link was already used to change
              the password.
            </p>
            <RouterLink :to="{ name: 'auth-login' }"> Back to login </RouterLink>
          </div>

          <!--Form-->
          <div class="form-card">
            <div class="login-form">
              <VField>
                <VButton
                  @click="resendPasswordResetLink"
                  color="primary"
                  type="button"
                  bold
                  fullwidth
                  raised
                  style="margin-top: 0px"
                >
                  Resend password reset link
                </VButton>
              </VField>
            </div>
          </div>
        </div>
      </div>
    </VLoader>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Reset Password - Verified Contracting',
})

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
//@ts-ignore
import { useNotyf } from '/@src/composable/useNotyf'
//@ts-ignore
import { useDarkmode } from '/@src/stores/darkmode'
import * as yup from 'yup'
import { Field, useForm } from 'vee-validate'
//@ts-ignore
import { authService } from '/@src/service/auth-service'

const darkmode = useDarkmode()
const route = useRoute()
const router = useRouter()
const notyf = useNotyf()

const id = ref()
const isLoading = ref(true)
const isLoadingNewPasswordRequest = ref(false)
const isShowResetPasswordForm = ref(false)
const isShowResetLinkExpiredDiv = ref(false)

id.value = route.params.id

const schema = yup.object({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Your passwords do not match.'),
})

const { resetForm, handleSubmit } = useForm({
  validationSchema: schema,
})

const handleResetPassword = handleSubmit(async (data: any) => {
  isLoadingNewPasswordRequest.value = true

  let updateUserPassword = {
    id: id.value,
    password: data.password,
  }

  const state = await authService.resetPassword(updateUserPassword)

  if (state.data.status == 'SUCCESS') {
    isLoadingNewPasswordRequest.value = false
    resetForm()
    notyf.success({
      message: 'Password reset successfully',
      duration: 3000,
    })
    router.push({
      name: 'auth-login',
    })
  } else {
    isLoadingNewPasswordRequest.value = false
    notyf.error('Password reset failed!')
  }
})

const checkResetPasswordLinkExpired = async () => {
  const state = await authService.checkResetPasswordLinkExpired(id.value)

  if (state.status === 404) {
    router.push({
      name: 'auth-login',
    })
  } else if (state.status === 400) {
    isShowResetLinkExpiredDiv.value = true
    isLoading.value = false
  } else if (state.status === 200) {
    isShowResetPasswordForm.value = true
    isLoading.value = false
  }
}

const resendPasswordResetLink = async () => {
  router.push({
    name: 'auth-forgot-password',
  })
}

onMounted(async () => {
  await checkResetPasswordLinkExpired()
})
</script>

<style lang="scss">
.auth-wrapper-inner .single-form-wrap .inner-wrap {
  width: 100% !important;
  max-width: 535px !important;
  margin: 100px auto 0 !important;
}
</style>

