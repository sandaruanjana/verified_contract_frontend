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
          <h2>You're almost done! Wait for the email verification to complete.</h2>
          <p></p>
          <RouterLink :to="{ name: 'auth-login' }">
            I already have an account
          </RouterLink>
        </div>

        <VLoader size="large" :active="true">
          <!--Form-->
          <div class="form-card">
            <h1 class="title is-3 is-narrow is-thin" style="text-align: center">
              You're almost done! Wait for the email verification to complete.
            </h1>
          </div>
        </VLoader>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotyf } from '/@src/composable/useNotyf'
import { useDarkmode } from '/@src/stores/darkmode'
import { authService } from '/@src/service/auth-service'

const darkmode = useDarkmode()
const route = useRoute()
const router = useRouter()
const notif = useNotyf()

const token = ref()
const is_loading_verify = ref(false)

token.value = route.params.id

const fetchEmailVerify = async () => {
  is_loading_verify.value = true

  const res = await authService.verify(token.value)

  if (res.data.status == 'SUCCESS') {
    is_loading_verify.value = false
    notif.success('Email verified successfully')
    router.push({
      name: 'auth-login',
    })
  } else {
    is_loading_verify.value = false
    notif.error('Email verification failed')
    router.push({
      name: 'auth-login',
    })
  }
}

onMounted(async () => {
  await fetchEmailVerify()
})
</script>

<style lang="scss">
.auth-wrapper-inner .single-form-wrap .inner-wrap {
  width: 100% !important;
  max-width: 535px !important;
  margin: 100px auto 0 !important;
}
</style>

