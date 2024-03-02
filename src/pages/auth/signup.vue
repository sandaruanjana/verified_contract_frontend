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
          <p>Start by creating your account</p>
          <RouterLink :to="{ name: 'auth-login' }">
            I already have an account
          </RouterLink>
        </div>

        <!--Form-->
        <div class="form-card">
          <h1 v-if="is_register_success" class="title is-3 is-narrow is-thin">
            You're almost done! We sent a email to {{ email }}. Please verify to login.
          </h1>
          <form v-if="!is_register_success" @submit.prevent="handleSignup">
            <div class="login-form">
              <!-- Input -->
              <Field v-slot="{ field, errorMessage }" name="name">
                <VField>
                  <VControl icon="feather:user" :has-error="Boolean(errorMessage)">
                    <input
                      v-bind="field"
                      class="input"
                      type="text"
                      placeholder="Name"
                      autocomplete="name"
                    />
                    <p v-if="errorMessage" class="help is-danger">
                      {{ errorMessage }}
                    </p>
                  </VControl>
                </VField>
              </Field>
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
              <Field v-slot="{ field, errorMessage }" name="contact">
                <VField>
                  <VControl icon="feather:phone" :has-error="Boolean(errorMessage)">
                    <input
                      v-bind="field"
                      class="input"
                      type="number"
                      placeholder="Contact"
                      autocomplete="phone"
                    />
                    <p v-if="errorMessage" class="help is-danger">
                      {{ errorMessage }}
                    </p>
                  </VControl>
                </VField>
              </Field>

              <!-- Input -->

              <!-- Input -->
              <Field v-slot="{ field, errorMessage }" name="address_line_1">
                <VField>
                  <VControl icon="feather:map" :has-error="Boolean(errorMessage)">
                    <input
                      v-bind="field"
                      class="input"
                      type="text"
                      placeholder="Address line 1"
                      autocomplete="address-line-1"
                    />
                    <p v-if="errorMessage" class="help is-danger">
                      {{ errorMessage }}
                    </p>
                  </VControl>
                </VField>
              </Field>

              <!-- Input -->

              <!-- Input -->
              <Field v-slot="{ field, errorMessage }" name="address_line_2">
                <VField>
                  <VControl icon="feather:map" :has-error="Boolean(errorMessage)">
                    <input
                      v-bind="field"
                      class="input"
                      type="text"
                      placeholder="Address line 2"
                      autocomplete="address-line2"
                    />
                    <p v-if="errorMessage" class="help is-danger">
                      {{ errorMessage }}
                    </p>
                  </VControl>
                </VField>
              </Field>

              <!-- Input -->

              <!-- Input -->
              <Field v-slot="{ field, errorMessage }" name="zip_code">
                <VField>
                  <VControl icon="feather:map-pin">
                    <input
                      v-bind="field"
                      class="input"
                      type="text"
                      placeholder="Zip Code"
                      autocomplete="zip-code"
                    />
                    <p v-if="errorMessage" class="help is-danger">
                      {{ errorMessage }}
                    </p>
                  </VControl>
                </VField>
              </Field>

              <!-- Input -->

              <VField>
                <VControl>
                  <VRadio
                    v-model="options"
                    value="CUSTOMER"
                    label="Customer"
                    name="role"
                    color="primary"
                    circle
                  />
                  <VRadio
                    v-model="options"
                    value="CONTRACTOR"
                    label="Contractor"
                    name="role"
                    color="primary"
                    circle
                  />
                </VControl>
              </VField>

              <!-- Submit -->
              <VField>
                <VControl class="login">
                  <VButton color="primary" type="submit" bold fullwidth raised>
                    Sign Up
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useNotyf } from '/@src/composable/useNotyf'
import apiInstance from '/@src/utils/api-client'

import { useDarkmode } from '/@src/stores/darkmode'
import * as yup from 'yup'
import { Field, useForm } from 'vee-validate'

import profile_image from '/@src/assets/image/profile.png'
import { authService } from '/@src/service/auth-service'

const mapbox_api_key = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string
const zipCodeLongitude = ref()
const zipCodeLatitude = ref()

const darkmode = useDarkmode()
const router = useRouter()
const notif = useNotyf()
const isLoading = ref(false)
const options = ref('CUSTOMER')
const is_register_success = ref(false)
const email = ref()
const is_signup_button_loading = ref(false)

useHead({
  title: 'Signup - Verified Contracting',
})

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  address_line_1: yup.string().required('Address Line 1 is required'),
  address_line_2: yup.string().required('Address Line 2 is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  contact: yup
    .string()
    .required('Contact is required')
    .matches(/^[0-9]{10}$/, 'Please enter a valid contact number'),
  zip_code: yup
    .string()
    .required('Zip code is required')
    .matches(/^\d{5}$/, 'Please enter a valid zip code'),
})

const { resetForm, handleSubmit } = useForm({
  validationSchema: schema,
})

const handleSignup = handleSubmit(async (data: any) => {
  if (Boolean(options.value)) {
    email.value = data.email
    is_signup_button_loading.value = true

    const mapbox_state = await apiInstance.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.zip_code}.json?access_token=${mapbox_api_key}&cachebuster=1629304083461&autocomplete=true&country=us&types=postcode`
    )
    zipCodeLongitude.value = mapbox_state.data.features[0].geometry.coordinates[0]
    zipCodeLatitude.value = mapbox_state.data.features[0].geometry.coordinates[1]

    let user = {
      name: data.name,
      email: data.email,
      password: data.password,
      telephone: data.contact,
      addressLine1: data.address_line_1,
      addressLine2: data.address_line_2,
      zipCode: data.zip_code,
      role: options.value,
      longitude: zipCodeLongitude.value,
      latitude: zipCodeLatitude.value,
    }

    const state = await authService.signup(user)

    if (state.data.status == 'SUCCESS') {
      is_signup_button_loading.value = false
      is_register_success.value = true
      resetForm()
      notif.success({
        message: 'Successfully registered. Please check your email for verification.',
        duration: 3000,
      })
    } else {
      is_signup_button_loading.value = false
      notif.error({
        message: 'Something went wrong. Please try again.',
        duration: 3000,
      })
    }
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

