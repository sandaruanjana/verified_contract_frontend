<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>General Info</h3>
          <p>Edit your account's general information</p>
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
    <div class="form-body">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Profile Picture</h4>
          <p>This is how others will recognize you</p>
        </div>

        <VAvatar size="xl" class="profile-v-avatar">
          <template #avatar>
            <img
              v-if="!isUploading"
              class="avatar"
              :src="profile_image"
              alt=""
              @error.once="(event) => onceImageErrored(event, '150x150')"
            />
            <VFilePond
              v-else
              class="profile-filepond"
              name="profile_filepond"
              :chunk-retry-delays="[500, 1000, 3000]"
              label-idle="<i class='lnil lnil-cloud-upload'></i>"
              :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
              :image-preview-height="140"
              :image-resize-target-width="140"
              :image-resize-target-height="140"
              image-crop-aspect-ratio="1:1"
              style-panel-layout="compact circle"
              style-load-indicator-position="center bottom"
              style-progress-indicator-position="right bottom"
              style-button-remove-item-position="left bottom"
              style-button-process-item-position="right bottom"
              @addfile="onAddFile"
              @removefile="onRemoveFile"
            />
            <VIconButton
              v-if="!isUploading"
              icon="feather:edit-2"
              class="edit-button is-edit"
              circle
              tabindex="0"
              @keydown.space.prevent="isUploading = true"
              @click="isUploading = true"
            />
            <VIconButton
              v-else
              icon="feather:arrow-left"
              class="edit-button is-back"
              circle
              tabindex="0"
              @keydown.space.prevent="isUploading = false"
              @click="isUploading = false"
            />
          </template>
        </VAvatar>
      </div>

      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Personal Info</h4>
          <p>Others diserve to know you more</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:user">
                <input
                  v-model="name"
                  type="text"
                  class="input"
                  placeholder="Name"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>

          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:phone">
                <input
                  v-model="phone_number"
                  type="number"
                  class="input"
                  placeholder="Phone Number"
                  autocomplete="tel"
                />
              </VControl>
            </VField>
          </div>

          <!-- Input -->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:map">
                <input
                  v-model="address_line_1"
                  type="text"
                  class="input"
                  placeholder="Address line 1"
                  autocomplete="address-line-1"
                />
              </VControl>
            </VField>
          </div>
          <!-- Input -->

          <!-- Input -->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:map">
                <input
                  v-model="address_line_2"
                  type="text"
                  class="input"
                  placeholder="Address line 2"
                  autocomplete="address-line-2"
                />
              </VControl>
            </VField>
          </div>

          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:map-pin">
                <input
                  v-model="zip_code"
                  type="text"
                  class="input"
                  placeholder="Zip Code"
                  autocomplete="zip-code"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage, useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiInstance from '/@src/utils/api-client'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

import { useNotyf } from '/@src/composable/useNotyf'
import { useUserSession } from '/@src/stores/userSession'
import { userService } from '/@src/service/user-service'
import { onceImageErrored } from '/@src/utils/via-placeholder'
import { basic_url } from '/@src/utils/basic_config'

const mapbox_api_key = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string
const zipCodeLongitude = ref()
const zipCodeLatitude = ref()

const router = useRouter()
const route = useRoute()
const userSession = useUserSession()

let user: any = useStorage('user', [])

const isUploading = ref(false)
const isLoading = ref(false)

const id = ref<string>(user.value.id)
const name = ref<string>(user.value.name)
const profile_image = ref<string>(
  user.value.profilePicture === null
    ? '/@src/assets/image/profile.png'
    : basic_url + '/api/uploads/profile_picture/' + user.value.profilePicture
)
const phone_number = ref<string>(user.value.telephone)
const address_line_1 = ref<string>(user.value.addressLine1)
const address_line_2 = ref<string>(user.value.addressLine2)
const zip_code = ref<string>(user.value.zipCode)

const notyf = useNotyf()
const { y } = useWindowScroll()

const isScrolling = computed(() => {
  return y.value > 30
})

const onAddFile = async (error: any, file: any) => {
  if (error) {
    console.error(error)
    return
  }
  let tempImage: any = await getBase64(file.file)
  profile_image.value = tempImage
}

const onRemoveFile = (error: any, file: any) => {
  if (error) {
    console.error(error)
    return
  }
}

const onSave = async () => {
  isLoading.value = true

  if (!name.value) {
    notyf.error('Name is required')
    isLoading.value = false
    return
  }
  if (!phone_number.value) {
    notyf.error('Phone number is required')
    isLoading.value = false
    return
  }
  if (!address_line_1.value) {
    notyf.error('Address line 1 is required')
    isLoading.value = false
    return
  }
  if (!address_line_2.value) {
    notyf.error('Address line 2 is required')
    isLoading.value = false
    return
  }
  if (!zip_code.value) {
    notyf.error('Zip code is required')
    isLoading.value = false
    return
  }
  if (zip_code.value.length < 5) {
    notyf.error('Zip code must be 5 digits')
    isLoading.value = false
    return
  }

  const state = await apiInstance.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip_code.value}.json?access_token=${mapbox_api_key}&cachebuster=1629304083461&autocomplete=true&country=us&types=postcode`
  )
  zipCodeLongitude.value = state.data.features[0].geometry.coordinates[0]
  zipCodeLatitude.value = state.data.features[0].geometry.coordinates[1]

  let user = {
    id: id.value,
    name: name.value,
    profilePicture: profile_image.value.includes(',')
      ? profile_image.value.split(',')[1]
      : profile_image.value.includes('@src')
      ? null
      : profile_image.value.split('/')[profile_image.value.split('/').length - 1],
    telephone: phone_number.value,
    addressLine1: address_line_1.value,
    addressLine2: address_line_2.value,
    zipCode: zip_code.value,
    longitude: zipCodeLongitude.value,
    latitude: zipCodeLatitude.value,
  }

  const update_state = await userService.update(user)

  if (update_state.data.status == 'SUCCESS') {
    notyf.success('Your changes have been successfully saved!')
    userSession.setUser(JSON.stringify(update_state.data.results))
    location.reload()
  } else {
    notyf.error('Something went wrong, please try again later!')
    isLoading.value = false
  }

  isLoading.value = false
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
</script>