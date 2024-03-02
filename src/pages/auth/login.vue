<template>
  <div class="auth-wrapper-inner columns is-gapless">
    <!-- Image section (hidden on mobile) -->
    <div class="column login-column is-8 h-hidden-mobile h-hidden-tablet-p hero-banner">
      <div class="hero login-hero is-fullheight is-app-grey">
        <div class="hero-body">
          <div class="columns">
            <div class="column is-10 is-offset-1">
              <img
                class="light-image has-light-shadow has-light-border"
                src="/@src/assets/illustrations/login/bg.jpeg"
                alt=""
              />
              <img
                class="dark-image has-light-shadow"
                src="/@src/assets/illustrations/login/bg.jpeg"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="hero-footer">
          <p class="has-text-centered"></p>
        </div>
      </div>
    </div>

    <!-- Form section -->
    <div class="column is-4">
      <div class="hero is-fullheight is-white">
        <div class="hero-heading">
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
          <div class="auth-logo">
            <RouterLink :to="{ name: 'auth-login' }">
              <img
                style="width: 167px; height: 100px"
                src="/@src/assets/logo/HomeAdvisor-1024x275.jpg"
                alt=""
              />
              <!-- <AnimatedLogo width="36px" height="36px" /> -->
            </RouterLink>
          </div>
        </div>
        <div class="hero-body" style="margin-bottom: 100px">
          <div class="container">
            <div class="columns">
              <div class="column is-12">
                <div class="auth-content">
                  <h2>Welcome Back.</h2>
                  <p>Please sign in to your account</p>
                  <RouterLink :to="{ name: 'auth-signup' }">
                    I do not have an account yet
                  </RouterLink>
                </div>
                <div class="auth-form-wrapper">
                  <!-- Login Form -->
                  <form @submit.prevent="handleLogin">
                    <div class="login-form">
                      <!-- Email -->
                      <VField>
                        <VControl icon="feather:user">
                          <input
                            v-model="email"
                            class="input"
                            type="text"
                            placeholder="Email"
                            autocomplete="email"
                          />
                        </VControl>
                      </VField>

                      <!-- Password -->
                      <VField>
                        <VControl icon="feather:lock">
                          <input
                            v-model="password"
                            class="input"
                            type="password"
                            placeholder="Password"
                            autocomplete="current-password"
                          />
                        </VControl>
                      </VField>

                      <!-- Submit -->
                      <VControl class="login">
                        <VButton
                          :loading="isLoading"
                          color="primary"
                          type="submit"
                          bold
                          fullwidth
                          raised
                        >
                          Sign In
                        </VButton>
                      </VControl>

                      <div class="forgot-link has-text-centered">
                        <RouterLink :to="{ name: 'auth-forgot-password' }">
                          Forgot Password?
                        </RouterLink>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'

import { useDarkmode } from '/@src/stores/darkmode'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import { authService } from '/@src/service/auth-service'
import { useStorage } from '@vueuse/core'

const isLoading = ref(false)
const darkmode = useDarkmode()
const router = useRouter()
const route = useRoute()
const notif = useNotyf()
const userSession = useUserSession()
const redirect = route.query.redirect as string

const email = ref('')
const password = ref('')

const user: any = useStorage('user', [])

onMounted(() => {
  if (userSession.isLoggedIn) {
    if (user.value.role === 'CONTRACTOR') {
      router.push({
        name: 'contractor',
      })
    } else {
      router.push({
        name: 'customer',
      })
    }
  }
})

const handleLogin = async () => {
  if (!isLoading.value) {
    isLoading.value = true
    if (email.value === '' || password.value === '') {
      notif.error('Email or password cannot be empty')
      isLoading.value = false
    } else {
      let user = {
        email: email.value.toString(),
        password: password.value.toString(),
      }

      const { _loginState } = await authService.login(user)

      if (_loginState.status == 200) {
        userSession.setToken((_loginState.data as any).access_token)

        const _userState = await authService.get((_loginState.data as any).access_token)
        userSession.setUser(JSON.stringify(_userState.data.results as any))
        notif.dismissAll()

        if ((_userState.data.results as any).role === 'CUSTOMER') {
          router.push({
            name: 'customer',
          })
        } else {
          router.push({
            name: 'contractor',
          })
        }
        isLoading.value = false
      } else {
        notif.error('Email or password is incorrect')
        isLoading.value = false
      }

      isLoading.value = false
    }
  }
}

useHead({
  title: 'Login - Verified Contracting',
})
</script>
