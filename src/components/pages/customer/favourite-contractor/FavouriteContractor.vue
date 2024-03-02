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
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
          @input="filter"
        />
      </VControl>
    </div>

    <div v-if="isError" class="error-container">
      <SomeThingWentWrong />
    </div>

    <div class="user-grid user-grid-v1">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        v-if="total === 0"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="item in users" :key="item.id" class="column is-3">
          <div class="grid-item">
            <VAvatar
              :picture="
                item.profilePicture === null
                  ? '/@src/assets/image/profile.png'
                  : basic_url + '/api/uploads/profile_picture/' + item.profilePicture
              "
              :badge="item.badge"
              size="big"
            />
            <h3 class="dark-inverted">{{ item.name }}</h3>
            <p>Contractor</p>
            <br />

            <VIconButton
              color="danger"
              circle
              icon="feather:heart"
              @click="contractorSelect(item.id)"
            />
          </div>
        </div>

        <div v-if="isDataLoading" v-for="key in 20" :key="key" class="column is-3">
          <div class="grid-item">
            <VPlaceloadAvatar size="big" centered class="mb-2" />

            <VPlaceloadText
              class="mb-4"
              width="80%"
              :lines="3"
              last-line-width="60%"
              centered
            />

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
import { onMounted, onUnmounted, ref } from 'vue'

import { userService } from '/@src/service/user-service'
import { useNotyf } from '/@src/composable/useNotyf'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { basic_url } from '/@src/utils/basic_config'

const notif = useNotyf()
const router = useRouter()

const filters = ref('')
const isDataLoading = ref(true)
const isError = ref(false)

let user: any = useStorage('user', [])

const users = ref<any>([])
const page = ref(1)
const limit = ref(20)
const total = ref<any>(null)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = async () => {
  if (isDataLoading.value === false) {
    let element = document.querySelector('.user-grid-v1')
    if (element!.getBoundingClientRect().bottom < window.innerHeight) {
      if (users.value.length < total.value) {
        page.value++
        isDataLoading.value = true

        let params = {
          page: page.value,
          pageSize: limit.value,
          searchTerm: filters.value,
          id: user.value.id,
        }

        const contractors_state = await userService.getAllFavouriteById(params)
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
          notif.error('Something went wrong!')
        }
      }
    }
  }
}

const filter = async () => {
  await fetchFavouriteContractor()
}

const fetchFavouriteContractor = async () => {
  let params = {
    page: page.value,
    pageSize: limit.value,
    searchTerm: filters.value,
    id: user.value.id,
  }

  const contractors_state = await userService.getAllFavouriteById(params)
  if ((contractors_state.state.error as any) === null) {
    users.value = []
    page.value = 1
    users.value = contractors_state.state.data
    total.value = contractors_state.state.total
    isDataLoading.value = false
  } else {
    isError.value = true
    isDataLoading.value = false
    notif.error('Something went wrong!')
  }
}

onMounted(async () => {
  await fetchFavouriteContractor()
})

const contractorSelect = async (contractor_id: any) => {
  if (Boolean(contractor_id)) {
    let userFavouriteUser = {
      userId: user.value.id,
      favouriteUserId: contractor_id,
    }

    let save_favourite_state = await userService.saveFavourite(userFavouriteUser)

    if (save_favourite_state.data.status == 'SUCCESS') {
      notif.success('Contractor has been removed from your favourite list')
      await fetchFavouriteContractor()
    } else {
      notif.error('Something went wrong!')
    }
  } else {
    router.push({
      name: 'customer',
    })
  }
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

    > .v-avatar {
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
