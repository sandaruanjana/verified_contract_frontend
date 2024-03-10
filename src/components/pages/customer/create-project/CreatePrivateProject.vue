<template>

  <div v-if="isError" class="error-container">
    <div class="error-wrapper">
      <div class="error-inner has-text-centered">
        <h3 class="dark-inverted">Internal Server Error</h3>
        <p>
          Looks like an unexpacted problem occured. Please try again or contact the
          website administrator.
        </p>
      </div>
    </div>
  </div>

  <div>
    <div class="user-grid-toolbar" style="margin-top: 25px">
      <div class="s-card mb-5">
        <div class="columns is-multiline">
          <div class="column is-12-tablet is-6-desktop">
            <div class="mt-3">
              <VControl icon="feather:search">
                <input v-model="filters" class="input custom-text-filter" placeholder="Search..." />
              </VControl>
            </div>
          </div>
          <!-- <div class="column is-12-tablet is-6-desktop">
            <div class="mt-4">
              <V-Field>
                <V-Control>
                  <Multiselect
                    v-model="selectedAbilities"
                    :options="abilityOptions"
                    label="name"
                    track-by="name"
                    placeholder="Search Abilities..."
                    :searchable="true"
                  />
                </V-Control>
              </V-Field>
            </div>
          </div> -->
          <!-- <div class="column is-12-tablet is-4-desktop">
            <div class="mt-4">
              <V-Field>
                <V-Control>
                  <Multiselect
                    v-model="selectedServiceHomeRemodels"
                    :options="serviceHomeRemodelsOptions"
                    label="name"
                    track-by="name"
                    placeholder="Service-Home Remodel"
                    :searchable="true"
                  />
                </V-Control>
              </V-Field>
            </div>
          </div> -->
          <!-- <div class="column is-12-tablet is-4-desktop">
            <div class="mt-4">
              <V-Field>
                <V-Control>
                  <Multiselect
                    v-model="selectedEducations"
                    :options="educationOptions"
                    label="name"
                    track-by="name"
                    placeholder="Education"
                    :searchable="true"
                  />
                </V-Control>
              </V-Field>
            </div>
          </div> -->
          <!-- <div class="column is-12-tablet is-3-desktop">
            <div class="mt-4">
              <V-Field>
                <V-Control>
                  <Multiselect
                    v-model="selectedArts"
                    :options="artsOptions"
                    label="name"
                    track-by="name"
                    placeholder="Arts"
                    :searchable="true"
                  />
                </V-Control>
              </V-Field>
            </div>
          </div> -->

          <div class="column is-12-tablet is-1-desktop">
            <div class="mt-4">
              <V-Field>
                <V-Control>
                  <VButton color="primary" raised @click="filterContractors">
                    Filter
                  </VButton>
                </V-Control>
              </V-Field>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isError" class="error-container">
      <SomeThingWentWrong />
    </div>

    <div class="user-grid user-grid-v1">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage v-if="total === 0" title="We couldn't find any matching results." subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria." larger>
        <template #image>
          <img class="light-image" src="/@src/assets/illustrations/placeholders/search-4.svg" alt="" />
          <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-4-dark.svg" alt="" />
        </template>
      </VPlaceholderPage>

      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="item in users" :key="item.id" class="column is-3">
          <div class="grid-item">
            <VAvatar :picture="item.profilePicture === null
    ? '/src/assets/image/profile.png'
    : basic_url + '/api/uploads/profile_picture/' + item.profilePicture
    " :badge="item.badge" size="big" />
            <h3 class="dark-inverted">{{ item.name }}</h3>
            <p>Contractor</p>
            <br />
            <div style="display: flex; align-items: center; justify-content: center; margin-top: 1.5vh;">
              <VueStarRating v-model:rating="contractorRatings[item.id]" :increment="0.1" :read-only="true"
                :show-rating="true" :star-size="15" />
            </div>
            <br />
            <button class="button v-button is-dark-outlined" @click="contractorSelect(item.id)">
              <span class="icon">
                <i aria-hidden="true" class="iconify" data-icon="bx:select-multiple"></i>
              </span>
              <span>Select</span>
            </button>
          </div>
        </div>

        <div v-if="isDataLoading" v-for="key in 20" :key="key" class="column is-3">
          <div class="grid-item">
            <VPlaceloadAvatar size="big" centered class="mb-2" />

            <VPlaceloadText class="mb-4" width="80%" :lines="3" last-line-width="60%" centered />

            <div class="people">
              <VPlaceloadAvatar size="small" class="mx-1" />
              <VPlaceloadAvatar size="small" class="mx-1" />
              <VPlaceloadAvatar size="small" class="mx-1" />
              <VPlaceloadAvatar size="small" class="mx-1" />
            </div>

            <VButtons>
              <VButton placeload="100%" dark-outlined>loading ...</VButton>
              <VButton placeload="100%" dark-outlined>loading ...</VButton>
            </VButtons>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { abilityService } from '/@src/service/ability-service'
import { skillService } from '/@src/service/skill-service'
import { useNotyf } from '/@src/composable/useNotyf'
import { useRouter } from 'vue-router'
import { userService } from '/@src/service/user-service'
import { basic_url } from '/@src/utils/basic_config'
import { useStorage } from '@vueuse/core'
//@ts-ignore
import VueStarRating from 'vue-star-rating'

const notif = useNotyf()
const router = useRouter()

let user: any = useStorage('user', [])

const filters = ref('')
const isDataLoading = ref(true)
const isError = ref(false)
const contractorRatings = ref({})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

//abilities
const selectedAbilities = ref<any>([])
const abilityOptions = ref<any>([])

//skills
const serviceHomeRemodelsOptions = ref<any>([])
const educationOptions = ref<any>([])
const artsOptions = ref<any>([])

const selectedServiceHomeRemodels = ref<any>([])
const selectedEducations = ref<any>([])
const selectedArts = ref<any>([])

const users = ref<any>([])
const page = ref(1)
const limit = ref(20)
const total = ref<any>(null)

const project_value = ref<any>();

const handleScroll = async () => {
  if (isDataLoading.value === false) {
    let element = document.querySelector('.user-grid-v1')
    if (element!.getBoundingClientRect().bottom < window.innerHeight) {
      if (users.value.length < total.value) {
        page.value++
        isDataLoading.value = true

        let skills: any = []

        if (selectedServiceHomeRemodels.value.length !== 0) {
          skills.push(selectedServiceHomeRemodels.value)
        }

        if (selectedEducations.value.length !== 0) {
          skills.push(selectedEducations.value)
        }

        if (selectedArts.value.length !== 0) {
          skills.push(selectedArts.value)
        }

        let params = {
          page: page.value,
          pageSize: limit.value,
          searchTerm: filters.value,
          abilities: selectedAbilities.value,
          skills: skills,
          longitude: user.value.longitude,
          latitude: user.value.latitude,
          role: 'CONTRACTOR',
        }

        const contractors_state = await userService.getByDistanceRange(params)
        if ((contractors_state.state.error as any) === null) {
          if (contractors_state.state.data.length !== 0) {
            //delay for 1 second
            await new Promise((resolve) => setTimeout(resolve, 1000))
            users.value.push(...contractors_state.state.data)
            total.value = contractors_state.state.total
            isDataLoading.value = false
          } else {
            isDataLoading.value = false
          }
        } else {
          isError.value = true
          isDataLoading.value = false
          notif.error(contractors_state.state.error)
        }
      }
    }
  }
}

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

const filterContractors = async () => {
  let skills: any = []

  if (selectedServiceHomeRemodels.value.length !== 0) {
    skills.push(selectedServiceHomeRemodels.value)
  }

  if (selectedEducations.value.length !== 0) {
    skills.push(selectedEducations.value)
  }

  if (selectedArts.value.length !== 0) {
    skills.push(selectedArts.value)
  }

  let params = {
    page: page.value,
    pageSize: limit.value,
    searchTerm: filters.value,
    abilities: selectedAbilities.value,
    skills: skills,
    longitude: user.value.longitude,
    latitude: user.value.latitude,
    role: 'CONTRACTOR',
  }

  const contractors_state = await userService.getByDistanceRange(params)
  if ((contractors_state.state.error as any) === null) {
    users.value = []
    page.value = 1
    users.value = contractors_state.state.data
    total.value = contractors_state.state.total
    isDataLoading.value = false
  } else {
    isError.value = true
    isDataLoading.value = false
    notif.error(contractors_state.state.error)
  }
}


const getRating = async (contractorId: any) => {
  const response = await userService.getContractorRating(contractorId)

  if (response.data.status === "SUCCESS") {
    return response.data.results
  } else {
    return 0.00
  }
}


const fetchRatings = async () => {
  if (users.value.length !== 0) {
    for (let i = 0; i < users.value.length; i++) {
      contractorRatings.value[users.value[i].id] = await getRating(users.value[i].id);
    }
  }
};

onMounted(async () => {
  await fetchAbilities()
  await fetchSkills()

  let skills: any = []
  skills.push(...selectedServiceHomeRemodels.value)
  skills.push(...selectedEducations.value)
  skills.push(...selectedArts.value)

  let params = {
    page: page.value,
    pageSize: limit.value,
    searchTerm: filters.value,
    abilities: selectedAbilities.value,
    skills: skills,
    longitude: user.value.longitude,
    latitude: user.value.latitude,
    role: 'CONTRACTOR',
  }

  const contractors_state = await userService.getByDistanceRange(params)
  if ((contractors_state.state.error as any) === null) {
    users.value = []
    page.value = 1
    users.value = contractors_state.state.data
    total.value = contractors_state.state.total
    isDataLoading.value = false
  } else {
    isError.value = true
    isDataLoading.value = false
    notif.error(contractors_state.state.error)
  }

  await fetchRatings()

})

const contractorSelect = async (contractor_id: any) => {
  router.push({
    name: 'customer-create-private-project',
    params: { id: contractor_id },
  })
}
</script>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

.is-dark {
  .user-grid {
    .grid-item {
      @include vuero-card--dark;
    }
  }
}

.user-grid-v1 {
  .columns {
    margin-left: -0.5rem !important;
    margin-right: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }

  .grid-item {
    @include vuero-s-card;

    text-align: center;

    >.v-avatar {
      display: block;
      margin: 0 auto 4px;
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.85rem;
    }

    .people {
      display: flex;
      justify-content: center;
      padding: 8px 0 30px;

      .v-avatar {
        margin: 0 4px;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;

      .button {
        width: calc(50% - 4px);
        color: var(--light-text);

        &:hover,
        &:focus {
          border-color: var(--fade-grey-dark-4);
          color: var(--primary);
          box-shadow: var(--light-box-shadow);
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .user-grid-v1 {
    .columns {
      display: flex;

      .column {
        min-width: 50% !important;
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .user-grid-v1 {
    .columns {
      .column {
        min-width: 33.3% !important;
      }
    }
  }
}
</style>
