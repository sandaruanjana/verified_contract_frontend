<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>Profile Info</h3>
          <p>Edit your Profile Page</p>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton :to="{ name: 'contractor' }" icon="lnir lnir-arrow-left rem-100" light dark-outlined>
              Go Back
            </VButton>
            <VButton color="primary" raised :loading="isLoading" tabindex="0" @keydown.space.prevent="onSave"
              @click="onSave">
              Save Changes
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <div class="form-body">
      <!--Fieldset-->

      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Personal Info</h4>
          <p>Others deserve to know you more</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:briefcase">
                <input type="text" class="input" placeholder="Small Info" autocomplete="organization-title"
                  v-model="smallInfo" />
              </VControl>
            </VField>
          </div>

          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl>
                <textarea class="textarea" rows="4" placeholder="About / Bio" autocomplete="off" autocapitalize="off"
                  spellcheck="true" v-model="bio"></textarea>
              </VControl>
            </VField>
          </div>
        </div>
      </div>

      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Social Profiles</h4>
          <p>This can help others finding you on social media</p>
        </div>
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="fab fa-linkedin">
                <input type="text" class="input" placeholder="Linkedin URL" inputmode="url" v-model="linkedinURL" />
              </VControl>
            </VField>
          </div>

          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="fab fa-twitter">
                <input type="text" class="input" placeholder="Twitter URL" inputmode="url" v-model="twitterURL" />
              </VControl>
            </VField>
          </div>

          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="fab fa-facebook-f">
                <input type="text" class="input" placeholder="Facebook URL" inputmode="url" v-model="fbURL" />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useNotyf } from '/@src/composable/useNotyf'
import { userService } from '/@src/service/user-service'
import { basic_url } from '/@src/utils/basic_config'
import { useUserSession } from '/@src/stores/userSession'

const user: any = useStorage('user', [])
const isLoading = ref(false)
const notyf = useNotyf()
const userSession = useUserSession()
const { y } = useWindowScroll()

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
const longitude = ref<string>(user.value.longitude)
const latitude = ref<string>(user.value.latitude)
const zip_str = ref<string[]>(
  user.value.preferredZipCodes === undefined ? [] : user.value.preferredZipCodes
)
const smallInfo = ref<string>(user.value.smallInfo)
const bio = ref<string>(user.value.bio)
const fbURL = ref<string>(user.value.facebookUrl)
const linkedinURL = ref<string>(user.value.linkedInUrl)
const twitterURL = ref<string>(user.value.twitterUrl)

const isScrolling = computed(() => {
  return y.value > 30
})

const onSave = async () => {
  console.log('onSave')
  if (
    smallInfo.value &&
    bio.value &&
    fbURL.value &&
    linkedinURL.value &&
    twitterURL.value
  ) {
    console.log('onSave 2')
    isLoading.value = true

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
      longitude: longitude.value,
      latitude: latitude.value,
      preferredZipCodes: zip_str.value,
      smallInfo: smallInfo.value,
      bio: bio.value,
      facebookUrl: fbURL.value ? fbURL.value : "",
      linkedInUrl: linkedinURL.value ? linkedinURL.value : "",
      twitterUrl: twitterURL.value ? twitterURL.value : "",
    }

    const update_state = await userService.update(user)

    if (update_state.data.status == 'SUCCESS') {
      notyf.success('Profile updated successfully')
      userSession.setUser(JSON.stringify(update_state.data.results))
      isLoading.value = false
    } else {
      isLoading.value = false
      notyf.error('Something went wrong, please try again later!')
    }
  } else {
    notyf.warning('Please fill the empty fields..!!')
    isLoading.value = false
  }
  isLoading.value = false
}
</script>