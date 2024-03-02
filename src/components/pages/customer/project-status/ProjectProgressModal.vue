<template>
  <VModal
    :open="isOpen"
    title="Project Progress"
    size="large"
    actions="center"
    @close="close"
  >
    <template #content>
      <VLoader card="rounded" size="large" :active="is_contractor_loading">
        <div v-if="!is_contractor_loading">
          <VCardAction
            :avatar="
              contractor.profilePicture === null
                ? '/@src/assets/image/profile.png'
                : basic_url + '/api/uploads/profile_picture/' + contractor.profilePicture
            "
            :title="contractor.name"
            subtitle="Contractor"
          >
            <template #action>
              <div v-if="is_contractor_favorite">
                <VIconButton
                  color="danger"
                  circle
                  icon="feather:heart"
                  @click="saveFavoriteContractor"
                />
              </div>
              <div v-else>
                <VIconButton
                  circle
                  icon="feather:heart"
                  @click="saveFavoriteContractor"
                />
              </div>
            </template>
          </VCardAction>
        </div>
      </VLoader>

      <br />
      <br />
      <div class="page-content-inner">
        <div
          v-for="projectProgress in projectProgresses"
          :key="projectProgress.id"
          class="list-view-item"
          style="margin-bottom: 16px"
        >
          <VCard radius="rounded" elevated style="border-radius: 8px">
            <div class="card-head">
              <VTag color="primary" :label="projectProgress.week"
                >Week {{ projectProgress.week }}</VTag
              >
              <VTag
                color="info"
                :label="
                  moment(projectProgress.createdTime).utc().format('YYYY-MM-DD HH:mm:ss')
                "
              />
            </div>

            <br />
            <h2 class="title is-4 is-narrow is-thin">{{ projectProgress.title }}</h2>

            <div class="card-inner">
              <p>
                {{ projectProgress.description }}
              </p>
            </div>

            <br />

            <div class="columns">
              <div
                class="column"
                v-for="projectProgressImage in projectProgress.images"
                :key="projectProgressImage.id"
              >
                <VPhotosSwipe
                  :items="[
                    {
                      src: basic_url + '/api/uploads/image/' + projectProgressImage.name,
                      thumbnail:
                        basic_url + '/api/uploads/image/' + projectProgressImage.name,
                      w: 600,
                      h: 400,
                      alt: 'attachment image 1',
                    },
                  ]"
                />
                <div class="image-overlay"></div>
              </div>
            </div>
          </VCard>
        </div>

        <div v-if="isDataLoading" v-for="index in 5" :key="index">
          <VPlaceloadWrap>
            <VPlaceload
              height="220px"
              mobileHeight="100px"
              width="100%"
              mobileWidth="100%"
              class="mx-2"
            />
          </VPlaceloadWrap>
          <br />
        </div>
      </div>
    </template>
    <template #action> </template>
  </VModal>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import { userService } from '/@src/service/user-service'
import { basic_url } from '/@src/utils/basic_config'
import moment from 'moment'

const notif = useNotyf()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  project_id: String,
  contractor_id: String,
})

const emit = defineEmits(['exit'])
const { project_id, contractor_id, isOpen } = toRefs(props)
const contractor = ref<any>()
const is_contractor_loading = ref(true)
const is_contractor_error = ref(false)
const is_contractor_favorite = ref(false)

const isDataLoading = ref(true)
const isError = ref(false)

const projectProgresses = ref<any>([])
const page = ref(1)
const limit = ref(5)
const total = ref<any>(null)

onMounted(() => {
  //@ts-ignore
  document!.querySelector('.modal-card-body').addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  //@ts-ignore
  //document!.querySelector('.modal-card-body').removeEventListener('scroll', handleScroll)
})

const handleScroll = async () => {
  if (isDataLoading.value === false) {
    let element = document.querySelector('.page-content-inner')
    if (element!.getBoundingClientRect().bottom < window.innerHeight) {
      if (projectProgresses.value.length < total.value) {
        page.value++
        isDataLoading.value = true

        let params = {
          page: page.value,
          pageSize: limit.value,
          searchTerm: '',
          projectId: project_id?.value,
        }

        const project_progress_state = await projectService.getProjectProgress(params)
        if ((project_progress_state.state.error as any) === null) {
          if (project_progress_state.state.data.length !== 0) {
            //delay for 1 second
            await new Promise((resolve) => setTimeout(resolve, 1000))
            projectProgresses.value.push(...project_progress_state.state.data)
            total.value = project_progress_state.state.total
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

const fetchProjectProgress = async () => {
  let params = {
    page: page.value,
    pageSize: limit.value,
    searchTerm: '',
    projectId: project_id?.value,
  }

  const project_progress_state = await projectService.getProjectProgress(params)
  if ((project_progress_state.state.error as any) === null) {
    projectProgresses.value = []
    page.value = 1
    projectProgresses.value = project_progress_state.state.data
    total.value = project_progress_state.state.total
    isDataLoading.value = false
  } else {
    isError.value = true
    isDataLoading.value = false
    notif.error('Something went wrong!')
  }
}

onMounted(async () => {
  await fetchContractor()
  await fetchProjectProgress()
})

const fetchContractor = async () => {
  const contractor_state = await userService.getById(contractor_id?.value)
  if (contractor_state.data.status == 'SUCCESS') {
    contractor.value = contractor_state.data.results
    is_contractor_favorite.value = contractor.value.isFavourite === 1 ? true : false
    is_contractor_loading.value = false
  } else {
    is_contractor_error.value = true
    is_contractor_loading.value = false
    notif.error('Something went wrong!')
  }
}

const saveFavoriteContractor = async () => {
  is_contractor_favorite.value = !is_contractor_favorite.value

  let userFavouriteUser = {
    favouriteUserId: contractor_id?.value,
  }

  let save_favourite_state = await userService.saveFavourite(userFavouriteUser)

  if (save_favourite_state.data.status == 'SUCCESS') {
    if (is_contractor_favorite.value) {
      notif.success('Contractor has been added from your favourite list')
    } else {
      notif.success('Contractor has been removed from your favourite list')
    }
  } else {
    notif.error('Something went wrong!')
  }
}

const close = () => {
  emit('exit', false)
}
</script>

<style lang="scss">
</style>