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

    <!--Single Centered Form-->
    <div class="single-form-wrap">
      <div class="inner-wrap">
        <!--Form Title-->
        <div class="auth-head">
          <p>You forgot your password? Here you can easily retrieve a new password.</p>
          <RouterLink :to="{ name: 'auth-login' }"> Back to login </RouterLink>
        </div>

        <!--Form-->
        <div class="form-card">
          <form @submit.prevent="handleForgotPassword">
            <div class="login-form">
              <!-- Input -->
              <Field v-slot="{ field, errorMessage }" name="email">
                <VField>
                  <VControl icon="feather:mail" :has-error="Boolean(errorMessage)">
                    <input
                      v-bind="field"
                      class="input"
                      type="text"
                      placeholder="Email Address"
                      autocomplete="email"
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
                    :loading="isLoadingRequestNewPasswordRequest"
                    type="submit"
                    bold
                    fullwidth
                    raised
                  >
                    Request new password
                  </VButton>
                </VControl>
              </VField>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Forgot Password - Verified Contracting',
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf'

import { useDarkmode } from '/@src/stores/darkmode'
import * as yup from 'yup'
import { Field, useForm } from 'vee-validate'

import { authService } from '/@src/service/auth-service'

const darkmode = useDarkmode()
const router = useRouter()
const notyf = useNotyf()

const email = ref()
const isLoadingRequestNewPasswordRequest = ref(false)

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
})

const { resetForm, handleSubmit } = useForm({
  validationSchema: schema,
})

const handleForgotPassword = handleSubmit(async (data: any) => {
  email.value = data.email
  isLoadingRequestNewPasswordRequest.value = true

  let formData = new FormData()
  formData.append('email', data.email)

  const state = await authService.forgotPassword(formData)

  if (state.status === 201) {
    isLoadingRequestNewPasswordRequest.value = false
    resetForm()
    notyf.success({
      message: 'New password request successfully',
      duration: 3000,
    })
    router.push({
      name: 'auth-login',
    })
  } else {
    isLoadingRequestNewPasswordRequest.value = false
    notyf.error({
      message: state.error,
      duration: 3000,
    })
  }
})
</script>

<style lang="scss">
.auth-wrapper-inner .single-form-wrap .inner-wrap {
  width: 100% !important;
  max-width: 535px !important;
  margin: 100px auto 0 !important;
}
</style>

