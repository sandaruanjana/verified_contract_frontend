<template>
  <VModal :open="passwordActionsOpen" title="Change Password" size="small" actions="center"
    @close="passwordActionsOpen = false">
    <template #content>
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <p>For an improved account security</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:unlock">
                <input v-model="current_password" type="password" class="input" placeholder="Old Password"
                  autocomplete="current-password" />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input v-model="new_password" type="password" class="input" placeholder="New Password"
                  autocomplete="new-password" />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input v-model="confirm_password" type="password" class="input" placeholder="Repeat New Password"
                  autocomplete="new-password" />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="isPasswordUpdating" @click="updatePassword" color="primary" raised>Update
      </VButton>
    </template>
  </VModal>
  <VModal :open="abilityActionsOpen" title="Manage Abilities" size="medium" actions="center"
    @close="abilityActionsOpen = false">
    <template #content>
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <p>Add abilities in order to get recommended by the customers</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl>
                <Multiselect v-model="selectedAbilities" label="name" track-by="name" mode="tags" :create-tag="true"
                  :searchable="true" :options="abilityOptions" placeholder="Abilities" />
              </VControl>
            </VField>
          </div>
        </div>
      </div>

      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Add categories</h4>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <p class="pt-1 pb-1">Service-Home Remodel</p>
            <VField>
              <VControl>
                <Multiselect v-model="selectedServiceHomeRemodels" label="name" track-by="name" mode="tags"
                  :searchable="true" :create-tag="true" :options="serviceHomeRemodelsOptions"
                  placeholder="Service-Home Remodel" />
              </VControl>
            </VField>
          </div>
          <div class="column is-12">
            <p class="pt-1 pb-1">Education</p>
            <VField>
              <VControl>
                <Multiselect v-model="selectedEducations" label="name" track-by="name" mode="tags" :searchable="true"
                  :create-tag="true" :options="educationOptions" placeholder="Education" />
              </VControl>
            </VField>
          </div>
          <div class="column is-12">
            <p class="pt-1 pb-1">Arts</p>
            <VField>
              <VControl>
                <Multiselect v-model="selectedArts" label="name" track-by="name" mode="tags" :searchable="true"
                  :create-tag="true" :options="artsOptions" placeholder="Arts" />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="isAbilityUpdating" @click="updateAbilitySkill" color="primary" raised>Update
      </VButton>
    </template>
  </VModal>

  <div class="dashboard-map-wrapper">
    <div class="dashboard-map-wrapper-inner">
      <div ref="mapElement" class="map-section">
        <div ref="geocoderElement" class="geocoder"></div>
        <div ref="popupElement" style="display: none; visibility: hidden">
          <MapMarker v-if="selectedFeature" :logo="selectedFeature.properties.logo"
            :name="selectedFeature.properties.name" :opening-count="selectedFeature.properties.openingCount"
            :description="selectedFeature.properties.description" />
        </div>
      </div>
      <div class="content-section">
        <slot name="header"></slot>
        <div class="content-section-body" data-simplebar>
          <!--Title-->
          <!--          <h4 class="content-section-title">General Information</h4>-->

          <!--Fieldset-->
          <div class="fieldset">
            <div class="fieldset-heading">
              <h4>Profile Picture</h4>
              <p>This is how others will recognize you</p>
            </div>

            <VAvatar size="xl" class="profile-v-avatar">
              <template #avatar>
                <img v-if="!isLoading" class="avatar" :src="profile_image" alt="" />
                <VFilePond v-else class="profile-filepond" name="profile_filepond" :chunk-retry-delays="[500, 1000, 3000]"
                  label-idle="<i class='lnil lnil-cloud-upload'></i>"
                  :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']" :image-preview-height="140"
                  :image-resize-target-width="140" :image-resize-target-height="140" image-crop-aspect-ratio="1:1"
                  style-panel-layout="compact circle" style-load-indicator-position="center bottom"
                  style-progress-indicator-position="right bottom" style-button-remove-item-position="left bottom"
                  style-button-process-item-position="right bottom" @addfile="onAddFile" @removefile="onRemoveFile" />
                <VIconButton v-if="!isLoading" icon="feather:edit-2" class="edit-button is-edit" circle tabindex="0"
                  @keydown.space.prevent="isLoading = true" @click="isLoading = true" />
                <VIconButton v-else icon="feather:arrow-left" class="edit-button is-back" circle tabindex="0"
                  @keydown.space.prevent="isUploading = false" @click="isUploading = false" />
              </template>
            </VAvatar>
          </div>

          <!--Map Box-->
          <div>
            <div class="map-box-place">
              <div class="map-box-header">
                <div class="columns is-multiline">
                  <!--Field-->
                  <div class="column is-12">
                    <VField>
                      <VControl icon="feather:user">
                        <input v-model="name" type="text" class="input" placeholder="Name" autocomplete="given-name" />
                      </VControl>
                    </VField>
                  </div>

                  <!--Field-->
                  <div class="column is-12">
                    <VField>
                      <VControl icon="feather:map-pin">
                        <input v-model="address_line_1" type="text" class="input" placeholder="Address Line 1"
                          autocomplete="address" />
                      </VControl>
                    </VField>
                  </div>

                  <!--Field-->
                  <div class="column is-12">
                    <VField>
                      <VControl icon="feather:map-pin">
                        <input v-model="address_line_2" type="text" class="input" placeholder="Address Line 2"
                          autocomplete="address" />
                      </VControl>
                    </VField>
                  </div>

                  <!--Field-->
                  <div class="column is-12">
                    <VField>
                      <VControl icon="feather:map-pin">
                        <input v-model="zip_code" type="text" class="input" placeholder="Zip Code" autocomplete="zip" />
                      </VControl>
                    </VField>
                  </div>

                  <!--Field-->
                  <div class="column is-12">
                    <VField>
                      <VControl icon="feather:map-pin">
                        <input v-model="pref_zip" @keyup.enter="addPreferedZipcode" type="text" class="input"
                          placeholder="Prefered Zip Codes" autocomplete="zip" />
                      </VControl>
                    </VField>

                    <!-- tags -->
                    <div class="field is-grouped is-grouped-multiline">
                      <div v-for="(zip, index) in zip_str" :key="index" class="control">
                        <div>
                          <div class="tags has-addons">
                            <a class="tag">{{ zip.zipCode }}</a>
                            <a @click="deleteZipCode(zip)" class="tag is-delete"></a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!--Field-->
                  <div class="column is-12">
                    <VField>
                      <VControl icon="feather:phone">
                        <input v-model="phone_number" type="number" class="input" placeholder="Phone Number"
                          autocomplete="tel" />
                      </VControl>
                    </VField>
                  </div>
                  <!--Field-->
                  <div class="column is-12">
                    <VField>
                      <VControl icon="feather:mail">
                        <input v-model="email" type="email" class="input" placeholder="Email Address"
                          autocomplete="email" />
                      </VControl>
                    </VField>
                  </div>
                </div>
              </div>
              <div class="map-box-body">
                <!-- button -->
                <div class="columns is-multiline">
                  <div class="column is-12">
                    <VButton @click="updateContractor" type="submit" color="primary" class="button is-fullwidth">
                      Update
                    </VButton>
                    <br />
                    <VButton @click="passwordActionsOpen = true" type="submit" color="warning"
                      class="button is-fullwidth">
                      Change Password
                    </VButton>
                    <br />
                    <!-- <VButton @click="abilityActionsOpen = true" type="submit" color="info" class="button is-fullwidth">
                      Manage abilities and categories
                    </VButton> -->
                  </div>
                </div>
              </div>
              <div class="map-box-actions">
                <div class="actions">
                  <div class="action">
                    <!-- <i aria-hidden="true" class="iconify" data-icon="feather:flag"></i>
                    <span class="dark-inverted"> 45 mile </span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'mapbox-gl/src/css/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
</script>

<script setup lang="ts">
import { onMounted, ref, watch, watchPostEffect } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js'
import { useThemeColors } from '/@src/composable/useThemeColors'

const themeColors = useThemeColors()
//@ts-ignore
import { useDarkmode } from '/@src/stores/darkmode'
//@ts-ignore
import apiInstance from '/@src/utils/api-client'
//@ts-ignore
import { useStorage } from '@vueuse/core'
//@ts-ignore
import { contractorService } from '/@src/service/contractor-service'
//@ts-ignore
import { abilityService } from '/@src/service/ability-service'
//@ts-ignore
import { skillService } from '/@src/service/skill-service'
//@ts-ignore
import { useNotyf } from '/@src/composable/useNotyf'
//@ts-ignore
import sleep from '/@src/utils/sleep'
//@ts-ignore
import { useRoute, useRouter } from 'vue-router'
//@ts-ignore
import { userService } from '/@src/service/user-service'
//@ts-ignore
import { basic_url } from '/@src/utils/basic_config'
//@ts-ignore
import { useUserSession } from '/@src/stores/userSession'

// You can set the VITE_MAPBOX_ACCESS_TOKEN inside .env file
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string
const notif = useNotyf()
const router = useRouter()
const userSession = useUserSession()
const route = useRoute()
let user: any = useStorage('user', [])

const darkmode = useDarkmode()
const mapElement = ref<HTMLElement>()
const geocoderElement = ref<HTMLElement>()
const popupElement = ref<HTMLElement>()
const selectedFeature = ref()
const selectedFeatureLatLng = ref()
const selectedFeatureName = ref('')
let map: mapboxgl.Map | undefined
let popup: mapboxgl.Popup | undefined
let geocoder: any
const mapbox_api_key = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string
const zipCodeLongitude = ref(user.value.longitude)
const zipCodeLatitude = ref(user.value.latitude)
const markers: any = []

const isPasswordUpdating = ref(false)
const isLoading = ref(false)

const id = ref<string>(user.value.id)
const name = ref<string>(user.value.name)
const profile_image = ref<string>(
  user.value.profilePicture === null
    ? '/@src/assets/image/profile.png'
    : basic_url + '/api/uploads/profile_picture/' + user.value.profilePicture
)
const phone_number = ref<string>(user.value.telephone)
const email = ref<string>(user.value.email)
const address_line_1 = ref<string>(user.value.addressLine1)
const address_line_2 = ref<string>(user.value.addressLine2)
const position = ref<string>(user.value.role)
const zip_code = ref<string>(user.value.zipCode)
const zip_str = ref<any[]>(
  user.value.preferredZipCodes === undefined ? [] : user.value.preferredZipCodes
)
const pref_zip = ref()
const passwordActionsOpen = ref(false)
const abilityActionsOpen = ref(false)
const current_password = ref()
const new_password = ref()
const confirm_password = ref()

//abilities
const selectedAbilities = ref<any>([])
const abilityOptions = ref<any>([])
const isAbilityUpdating = ref(false)

//skills
const serviceHomeRemodelsOptions = ref<any>([])
const educationOptions = ref<any>([])
const artsOptions = ref<any>([])

const selectedServiceHomeRemodels = ref<any>([])
const selectedEducations = ref<any>([])
const selectedArts = ref<any>([])

const fetchAbilities = async () => {
  const abilities = await abilityService.getAll()

  for (let i = 0; i < abilities.data.results.length; i++) {
    var data = {
      value: (abilities.data.results[i] as any).id,
      name: (abilities.data.results[i] as any).name,
    }
    abilityOptions.value.push(data)
  }
}

const fetchSkills = async () => {
  const serviceHomeRemodels = await skillService.getAllByType('Service-Home Remodel')

  for (let i = 0; i < serviceHomeRemodels.data.results.length; i++) {
    var data = {
      value: (serviceHomeRemodels.data.results[i] as any).id,
      name: (serviceHomeRemodels.data.results[i] as any).name,
    }
    serviceHomeRemodelsOptions.value.push(data)
  }

  const educations = await skillService.getAllByType('Education')

  for (let i = 0; i < educations.data.results.length; i++) {
    var data = {
      value: (educations.data.results[i] as any).id,
      name: (educations.data.results[i] as any).name,
    }
    educationOptions.value.push(data)
  }

  const arts = await skillService.getAllByType('Arts')

  for (let i = 0; i < arts.data.results.length; i++) {
    var data = {
      value: (arts.data.results[i] as any).id,
      name: (arts.data.results[i] as any).name,
    }
    artsOptions.value.push(data)
  }
}

const fetchContractorCategories = async () => {
  user.value.abilities.forEach((ability: any) => {
    selectedAbilities.value.push(ability)
  })

  user.value.skills.forEach((skill: any) => {
    serviceHomeRemodelsOptions.value.forEach((serviceHomeRemodel: any) => {
      if (serviceHomeRemodel.value === skill) {
        selectedServiceHomeRemodels.value.push(skill)
      }
    })

    educationOptions.value.forEach((education: any) => {
      if (education.value === skill) {
        selectedEducations.value.push(skill)
      }
    })

    artsOptions.value.forEach((art: any) => {
      if (art.value === skill) {
        selectedArts.value.push(skill)
      }
    })
  })
}

const updatePassword = async () => {
  isPasswordUpdating.value = true

  if (new_password.value !== confirm_password.value) {
    notif.error('New password and repeat new password does not match!')
    isLoading.value = false
    return
  }

  if (!Boolean(current_password.value)) {
    notif.error('Old password is required')
    isLoading.value = false
    return
  }

  if (!Boolean(new_password.value)) {
    notif.error('New password is required')
    isLoading.value = false
    return
  }

  if (!Boolean(confirm_password.value)) {
    notif.error('Repeat new password is required')
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
    notif.success('Password updated successfully!')
    current_password.value = ''
    new_password.value = ''
    confirm_password.value = ''
    isPasswordUpdating.value = false
    passwordActionsOpen.value = false
    await userSession.logoutUser()
    router.push({
      name: 'auth',
    })
  } else {
    isPasswordUpdating.value = false
    notif.error('Password update failed!')
  }
}

const updateAbilitySkill = async () => {
  isAbilityUpdating.value = true

  if (selectedAbilities.value.length === 0) {
    notif.error('No abilities are selected..!!')
    isLoading.value = false
    isAbilityUpdating.value = false
    return
  }

  if (selectedServiceHomeRemodels.value.length === 0) {
    notif.error('No Service-Home Remodel categories are selected..!!')
    isLoading.value = false
    isAbilityUpdating.value = false
    return
  }

  if (selectedEducations.value.length === 0) {
    notif.error('No Education categories are selected..!!')
    isLoading.value = false
    isAbilityUpdating.value = false
    return
  }

  if (selectedArts.value.length === 0) {
    notif.error('No Art categories are selected..!!')
    isLoading.value = false
    isAbilityUpdating.value = false
    return
  }

  let skills: any = []
  skills.push(...selectedServiceHomeRemodels.value)
  skills.push(...selectedEducations.value)
  skills.push(...selectedArts.value)

  let userAbilitySkill = {
    id: id.value,
    abilities: selectedAbilities.value,
    skills: skills,
  }

  const ability_update_state = await userService.updateAbilitySkill(userAbilitySkill)

  if (ability_update_state.data.status == 'SUCCESS') {
    notif.success('Abilities and skills are updated successfully.!!')
    userSession.setUser(JSON.stringify(ability_update_state.data.results))
    isAbilityUpdating.value = false
  } else {
    isAbilityUpdating.value = false
    notif.error(ability_update_state.data.Message)
  }
}

const updateContractor = async () => {
  isLoading.value = true

  const state = await apiInstance.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${zip_code.value}.json?access_token=${mapbox_api_key}&cachebuster=1629304083461&autocomplete=true&country=us&types=postcode`
  )

  if (state.data.features.length === 0) {
    notif.error('Please enter a valid zip code..!! currently we are not supporting this zip code..!!')
    isLoading.value = false
    return
  }

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
    preferredZipCodes: zip_str.value,
  }

  if (Boolean(id.value)) {
    const update_state = await userService.update(user)
    if (update_state.data.status == 'SUCCESS') {
      notif.success('Your changes have been successfully saved!')
      userSession.setUser(JSON.stringify(update_state.data.results))
      isLoading.value = false
      //router.go(0)
    } else {
      notif.error('Something went wrong, please try again later!')
      isLoading.value = false
    }
  }
  isLoading.value = false
}

const addPreferedZipcode = async () => {
  console.log(pref_zip.value)
  const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/
  if (!zipRegex.test(pref_zip.value)) {
    notif.error('Please enter a valid zip code')
    return
  }

  const state = await apiInstance.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${pref_zip.value}.json?access_token=${mapbox_api_key}&cachebuster=1629304083461&autocomplete=true&country=us&types=postcode`
  )
  let zipCodeLongitude = state.data.features[0].geometry.coordinates[0]
  let zipCodeLatitude = state.data.features[0].geometry.coordinates[1]

  zip_str.value.push({
    zipCode: pref_zip.value,
    longitude: zipCodeLongitude,
    latitude: zipCodeLatitude,
  })

  let marker = new mapboxgl.Marker({ color: 'black' })
    .setLngLat([zipCodeLongitude, zipCodeLatitude])
    .addTo(map)

  markers.push(marker)

  pref_zip.value = ''
}

const deleteZipCode = async (zip: any) => {
  //remove map marker
  markers.forEach((marker: any) => {
    if (marker._lngLat.lng == zip.longitude && marker._lngLat.lat == zip.latitude) {
      marker.remove()
    }
  })

  //remove from zip_str
  zip_str.value = zip_str.value.filter((e: any) => {
    return e !== zip
  })
}

const addMarker = async (longitude: any, latitude: any) => {
  let marker = new mapboxgl.Marker({ color: 'black' })
    .setLngLat([longitude, latitude])
    .addTo(map)
  markers.push(marker)
}

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

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

function loadLayers() {
  if (!map) {
    return
  }

  // Do nothing if source already added
  // if (map.getSource('places')) {
  //   return
  // }

  // map.addSource('places', {
  //   type: 'geojson',
  //   data: locations as any,
  // })

  // Add a layer showing the places.
  map.addLayer({
    id: 'places',
    type: 'circle',
    source: 'places',
    paint: {
      'circle-color': darkmode.isDark ? themeColors.accent : themeColors.primary,
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': darkmode.isDark
        ? themeColors.accentLight
        : themeColors.primaryMedium,
    },
  })

  map.on('click', 'places', (e: any) => {
    selectedFeature.value = e.features[0]
    selectedFeatureLatLng.value = e.lngLat
  })

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'places', () => {
    if (!map) {
      return
    }

    map.getCanvas().style.cursor = 'pointer'
  })

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'places', () => {
    if (!map) {
      return
    }

    map.getCanvas().style.cursor = ''
  })
}

onMounted(async () => {
  if (!mapElement.value || !geocoderElement.value) {
    return
  }

  await fetchAbilities()
  await fetchSkills()
  await fetchContractorCategories()

  map = new mapboxgl.Map({
    container: mapElement.value,
    style: darkmode.isDark
      ? 'mapbox://styles/mapbox/dark-v10'
      : 'mapbox://styles/mapbox/light-v10',
    center: [-77.04, 38.907],
    zoom: 12,
  })

  geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: true,
    placeholder: 'Search for a location',
  }).on('result', (e: any) => {
    //zipCodeLongitude.value = e.result.center[0]
    //zipCodeLatitude.value = e.result.center[1]
  })

  map.flyTo({
    center: [zipCodeLongitude.value, zipCodeLatitude.value],
    essential: true,
  })

  let marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat([zipCodeLongitude.value, zipCodeLatitude.value])
    .addTo(map)

  markers.push(marker)

  map.on('styledata', () => {
    const loadingStyles = () => {
      if (!map?.isStyleLoaded()) {
        setTimeout(loadingStyles, 1500)
        return
      }

      loadLayers()
    }
    loadingStyles()
  })

  geocoderElement.value.appendChild(geocoder.onAdd(map))

  for (let i = 0; i < user.value.preferredZipCodes.length; i++) {
    addMarker(
      user.value.preferredZipCodes[i].longitude,
      user.value.preferredZipCodes[i].latitude
    )
  }
})

watchPostEffect(() => {
  if (!selectedFeature.value || !popupElement.value || !map) {
    return
  }

  const feature = selectedFeature.value
  const { geometry, properties } = feature
  const { name } = properties
  const coordinates = geometry.coordinates.slice()
  // const logo = selectedFeature.value.properties.logo
  // const openingCount = selectedFeature.value.properties.openingCount
  // const description = selectedFeature.value.properties.description

  console.log('zooming at: ', properties, coordinates)

  // Ensure that if the map is zoomed out such that multiple
  // copies of the feature are visible, the popup appears
  // over the copy being pointed to.
  if (selectedFeatureLatLng.value) {
    while (Math.abs(selectedFeatureLatLng.value.lng - coordinates[0]) > 180) {
      coordinates[0] += selectedFeatureLatLng.value.lng > coordinates[0] ? 360 : -360
    }
  }

  map.flyTo({
    center: coordinates,
    zoom: 15,
    bearing: 0,
    essential: true,
  })

  if (popup) {
    popup.remove()
  }

  popup = new mapboxgl.Popup()
    .on('open', () => {
      selectedFeatureName.value = name
    })
    .on('close', () => {
      selectedFeatureName.value = ''
    })
    .setLngLat(coordinates)
    .setHTML(popupElement.value.innerHTML)
    .addTo(map)
})

watch(
  () => darkmode.isDark,
  () => {
    if (!map) {
      return
    }

    if (darkmode.isDark) {
      map.setStyle('mapbox://styles/mapbox/dark-v10')
    } else {
      map.setStyle('mapbox://styles/mapbox/light-v10')
    }
  }
)
</script>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

.fieldset {
  padding: 20px 0;
  max-width: 480px;
  margin: 0 auto;

  .fieldset-heading {
    margin-bottom: 20px;

    h4 {
      font-family: var(--font-alt);
      font-weight: 600;
      font-size: 1rem;
    }

    p {
      font-size: 0.9rem;
    }
  }

  .v-avatar {
    position: relative;
    display: block;
    margin: 0 auto;

    .edit-button {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }

  .setting-list {
    .setting-form {
      text-align: center;

      .filepond-profile-wrap {
        margin: 0 auto 10px !important;
      }
    }

    .setting-item {
      display: flex;
      align-items: center;
      margin-bottom: 24px;

      .icon-wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        min-width: 50px;
        height: 50px;
        border-radius: var(--radius-rounded);
        background: var(--fade-grey-light-2);
        border: 1px solid var(--fade-grey-dark-3);
        color: var(--light-text);

        &.has-img {
          border-color: var(--primary);

          img {
            width: 36px;
            min-width: 36px;
            height: 36px;
          }
        }

        i {
          font-size: 1.4rem;
        }
      }

      img {
        display: block;
        width: 50px;
        min-width: 50px;
        height: 50px;
        border-radius: var(--radius-rounded);
        border: 1px solid transparent;
      }

      .meta {
        margin-left: 10px;

        >span {
          font-family: var(--font);
          display: block;

          &:first-child {
            font-family: var(--font-alt);
            font-weight: 600;
            color: var(--dark-text);
            font-size: 0.9rem;
          }

          &:nth-child(2),
          &:nth-child(3) {
            font-size: 0.85rem;
            color: var(--light-text);

            i {
              position: relative;
              top: -2px;
              font-size: 4px;
              margin: 0 6px;
            }
          }

          &:nth-child(3) {
            color: var(--primary);
          }

          span {
            display: inline-block;
          }
        }
      }

      .end {
        margin-left: auto;
      }
    }
  }
}

.has-top-nav {
  .dashboard-map-wrapper {
    top: 80px;
    height: calc(100% - 80px);
  }
}

.dashboard-map-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .dashboard-map-wrapper-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;

    &.is-reversed {
      flex-direction: row-reverse;
    }

    .map-section {
      position: relative;
      width: calc(100% - 380px);
    }

    .content-section {
      width: 380px;
      background: var(--white);

      .content-section-header {
        height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 2rem;

        ~.content-section-body {
          height: calc(100% - 80px);
          padding: 0 2rem 2rem;
        }
      }

      .content-section-body {
        height: 100%;
        overflow-y: auto;
        padding: 2rem;

        .content-section-title {
          font-family: var(--font);
          font-size: 0.8rem;
          color: var(--light-text);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .map-box {
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          box-shadow: none;
          cursor: pointer;
          transition: border 0.3s, box-shadow 0.3s;

          &:focus-visible {
            outline-offset: var(--accessibility-focus-outline-offset);
            outline-width: var(--accessibility-focus-outline-width);
            outline-style: var(--accessibility-focus-outline-style);
            outline-color: var(--accessibility-focus-outline-color);
          }

          &.is-active {
            border-color: var(--primary);
            box-shadow: var(--light-box-shadow);
          }

          .map-box-body {
            padding: 0.5rem 0;

            p {
              font-size: 0.95rem;
            }
          }

          .map-box-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .rating {
              i {
                font-size: 0.9rem;
                color: var(--widget-grey);

                &.highlighted {
                  color: var(--yellow);
                }
              }
            }

            .action {
              display: flex;
              align-items: center;
              font-family: var(--font);
              font-size: 0.9rem;
              color: var(--dark-text);

              svg {
                height: 16px;
                width: 16px;
                margin-right: 0.25rem;
                color: var(--light-text);
              }
            }
          }
        }
      }
    }
  }
}

.mapboxgl-popup {
  &.mapboxgl-popup-anchor-bottom {
    .mapboxgl-popup-tip {
      z-index: 30;
      position: relative;
      top: -2px;
    }
  }

  &.mapboxgl-popup-anchor-top {
    .mapboxgl-popup-tip {
      z-index: 30;
      position: relative;
      bottom: -2px;
    }
  }

  &.mapboxgl-popup-anchor-right {
    .mapboxgl-popup-tip {
      z-index: 30;
      position: relative;
      left: -2px;
    }
  }

  &.mapboxgl-popup-anchor-left {
    .mapboxgl-popup-tip {
      z-index: 30;
      position: relative;
      right: -2px;
    }
  }

  .mapboxgl-popup-content {
    border: 1px solid var(--border);
    box-shadow: var(--light-box-shadow);
    padding: 1.25rem;
    border-radius: 0.5rem;

    .map-box-location {
      .map-box-body {
        padding: 0.5rem 0;

        p {
          line-height: 1.4;
        }
      }
    }
  }
}

.geocoder {
  position: absolute;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  top: 1rem;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.mapboxgl-ctrl-geocoder {
  min-width: 100% !important;
  border-radius: 0.65rem !important;
  border: 1px solid var(--border);
  box-shadow: var(--light-box-shadow);

  .mapboxgl-ctrl-geocoder--input {
    &:focus-visible {
      border-radius: 4px;
      outline-offset: var(--accessibility-focus-outline-offset);
      outline-width: var(--accessibility-focus-outline-width);
      outline-style: var(--accessibility-focus-outline-style);
      outline-color: var(--accessibility-focus-outline-color);
    }
  }

  .mapboxgl-ctrl-geocoder--suggestion-title {
    font-family: var(--font);
  }

  .mapboxgl-ctrl-geocoder--suggestion-address {
    font-family: var(--font);
  }

  .mapboxgl-ctrl-geocoder--icon-search {
    top: 13px;
    left: 12px;
    transition: stroke 0.3s;
    fill: var(--light-text);
  }

  .mapboxgl-ctrl-geocoder--pin-right>* {
    top: 11px !important;
    right: 11px !important;
  }

  .mapboxgl-ctrl-geocoder--button {
    background: none !important;
  }

  input {
    height: 44px;
    padding-left: 3rem;
    border-radius: 0.75rem;
    background: var(--white);
    transition: all 0.3s; // transition-all test

    &:focus {
      ~.mapboxgl-ctrl-geocoder--icon-search {
        fill: var(--primary) !important;
      }
    }
  }
}

.is-dark {
  .dashboard-map-wrapper {
    .dashboard-map-wrapper-inner {
      .content-section {
        background: var(--dark-sidebar-dark-3);

        .content-section-body {
          .map-box {
            background: var(--dark-sidebar-light-3);
            border-color: var(--dark-sidebar-light-10);

            &.is-active {
              border-color: var(--primary) !important;
            }
          }
        }
      }
    }
  }

  .mapboxgl-popup {
    &.mapboxgl-popup-anchor-bottom {
      .mapboxgl-popup-tip {
        border-top-color: var(--dark-sidebar-dark-3);
      }
    }

    &.mapboxgl-popup-anchor-top {
      .mapboxgl-popup-tip {
        border-bottom-color: var(--dark-sidebar-dark-3);
      }
    }

    &.mapboxgl-popup-anchor-left {
      .mapboxgl-popup-tip {
        border-right-color: var(--dark-sidebar-dark-3);
      }
    }

    &.mapboxgl-popup-anchor-right {
      .mapboxgl-popup-tip {
        border-left-color: var(--dark-sidebar-dark-3);
      }
    }

    .mapboxgl-popup-content {
      background: var(--dark-sidebar-dark-3);
      border-color: var(--dark-sidebar-light-10);

      .mapboxgl-popup-close-button {
        color: var(--dark-dark-text) !important;
      }
    }
  }

  .mapboxgl-marker {
    svg {
      circle {
        fill: var(--dark-sidebar-light-3) !important;
      }
    }
  }

  .mapboxgl-ctrl-geocoder {
    background: var(--dark-sidebar-dark-3);
    border-color: var(--dark-sidebar-light-10);

    input {
      color: var(--white);
      background: var(--dark-sidebar-dark-3);
    }

    .suggestions-wrapper {
      .suggestions {
        background: var(--dark-sidebar-dark-3);
        border-color: var(--dark-sidebar-light-10);
      }
    }

    .suggestions>.active>a,
    .suggestions>li>a:hover {
      background: var(--dark-sidebar-dark-6);
    }

    .mapboxgl-ctrl-geocoder--suggestion-title {
      color: var(--dark-dark-text);
    }

    .mapboxgl-ctrl-geocoder--suggestion-address {
      color: var(--light-text);
    }
  }
}

@media only screen and (max-width: 767px) {
  .has-top-nav {
    .dashboard-map-wrapper {
      top: 0;
      height: 100%;
    }
  }

  .dashboard-map-wrapper {
    overflow-x: hidden;

    .dashboard-map-wrapper-inner {
      flex-direction: column;

      &.is-reversed {
        flex-direction: column;
      }

      .map-section {
        min-height: 30vh;
        width: 100%;
      }

      .content-section {
        height: 70vh;
      }
    }
  }

  .geocoder {
    padding: 0 2rem;
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .has-top-nav {
    .dashboard-map-wrapper {
      top: 0;
      height: 100%;
    }
  }

  .dashboard-map-wrapper {
    overflow-x: hidden;

    .dashboard-map-wrapper-inner {
      flex-direction: column;

      &.is-reversed {
        flex-direction: column;
      }

      .map-section {
        min-height: 30vh;
        width: 100%;
      }

      .content-section {
        height: calc(70vh - 60px);
        width: 100%;
      }
    }
  }

  .geocoder {
    padding: 0 2rem;
  }
}
</style>
