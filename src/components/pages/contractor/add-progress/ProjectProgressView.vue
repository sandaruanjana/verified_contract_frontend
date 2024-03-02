<template>
  <VModal :open="progressActionsOpen" size="medium" title="Add Project Progress" actions="center" @close="
        ; (progressActionsOpen = false), clearImageDescription(), (file_list.value = [])
    ">
    <template #content>
      <VTag style="display: flex; justify-content: center; font-size: 13px" color="primary"
        :label="'Week ' + (current_week + 1)" />
      <br />

      <VField>
        <VControl>
          <input v-model="progress_title.value.value" type="text" class="input" placeholder="Title" />
          <p v-if="progress_title.errorMessage" style="font-size: 15px" class="help is-danger">
            {{ progress_title.errorMessage }}
          </p>
        </VControl>
      </VField>
      <VField>
        <VControl>
          <textarea v-model="progress_description.value.value" class="textarea" rows="4"
            placeholder="Description..."></textarea>
          <p v-if="progress_description.errorMessage" style="font-size: 15px" class="help is-danger">
            {{ progress_description.errorMessage }}
          </p>
        </VControl>
      </VField>
      <VField grouped>
        <VControl>
          <div class="file">
            <label class="file-label">
              <input :disabled="file_list.length == 3" accept="image/*" class="file-input" type="file" name="resume"
                @change="onEventFilePicked" />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-cloud-upload-alt"></i>
                </span>
                <span class="file-label"> Choose a image… </span>
              </span>
            </label>
          </div>
        </VControl>
      </VField>
      <div v-for="(file, index) in file_list" :key="file.url">
        <div class="columns is-12">
          <div class="column">
            <img class="img" :src="file.url" alt="base64" />
          </div>
          <div class="column">
            <V-Field>
              <label>Description</label>
              <V-Control>
                <textarea class="textarea" rows="4" placeholder="Write about any details..." autocomplete="off"
                  autocapitalize="off" spellcheck="true" @change="clearImageDescription"
                  @keypress="onKeyPress($event, index)"></textarea>
              </V-Control>
            </V-Field>
          </div>
          <VIconButton color="danger" light raised circle icon="feather:x" @click="removeImage(index)" />
        </div>
      </div>
    </template>
    <template #action>
      <VButton :loading="is_progress_saving" color="primary" @click="saveProgress" raised>Save</VButton>
    </template>
  </VModal>

  <VModal :open="projectCompleteModalOpen" title="" size="small" actions="center"
    @close="projectCompleteModalOpen = false">
    <template #content>
      <div class="has-text-centered">
        <i class="iconify" style="font-size: 60px" data-icon="feather:alert-circle"></i>
      </div>

      <VPlaceholderSection title="Are you sure!" subtitle="You won't be able to revert this!" />
    </template>
    <template #action>
      <VButton color="primary" :loading="isLoadingProjectRequestComplete" raised @click="completeProject">Yes, Complete!
      </VButton>
    </template>
  </VModal>

  <div class="user-grid-toolbar">
    <div class="buttons">
      <VButton color="info" raised @click="openAddProjectProgressModal()">
        <span class="icon">
          <i aria-hidden="true" class="fas fa-plus"></i>
        </span>
        <span>Add Progress</span>
      </VButton>

      <VButton color="primary" raised @click="openCompleteProjectModal()" style="margin-left: 5px">
        <span class="icon">
          <i aria-hidden="true" class="fas fa-check"></i>
        </span>
        <span>Complete</span>
      </VButton>
    </div>
  </div>

  <div v-if="isError" class="error-container">
    <SomeThingWentWrong />
  </div>

  <div v-if="total === 0">
    <NoDataAvailable />
  </div>

  <div class="page-content-inner">
    <div v-for="projectProgress in projectProgresses" :key="projectProgress.id" class="list-view-item"
      style="margin-bottom: 16px">
      <VCard radius="rounded" elevated style="border-radius: 8px">
        <div class="card-head">
          <VTag color="primary" :label="projectProgress.week">Week {{ projectProgress.week }}</VTag>
          <VTag color="info" :label="moment(projectProgress.createdTime).utc().format('YYYY-MM-DD HH:mm:ss')
            " />
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
          <div class="column" v-for="projectProgressImage in projectProgress.images" :key="projectProgressImage.id">
            <VPhotosSwipe :items="[
              {
                src: basic_url + '/api/uploads/image/' + projectProgressImage.name,
                thumbnail:
                  basic_url + '/api/uploads/image/' + projectProgressImage.name,
                w: 600,
                h: 400,
                alt: 'attachment image 1',
              },
            ]" />
            <div class="image-overlay"></div>
          </div>
        </div>
      </VCard>
    </div>

    <div v-if="isDataLoading" v-for="index in 5" :key="index">
      <VPlaceloadWrap>
        <VPlaceload height="220px" mobileHeight="100px" width="100%" mobileWidth="100%" class="mx-2" />
      </VPlaceloadWrap>
      <br />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { ref } from 'vue-demi'
import { useRouter } from 'vue-router'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import { useField } from 'vee-validate'
import * as yup from 'yup'
import { basic_url } from '/@src/utils/basic_config'
import moment from 'moment'

const router = useRouter()
const notif = useNotyf()

const project_id = ref()
const file_list = ref<any>([])
const description_data = ref<string>('')
const current_week = ref(0)
const progressActionsOpen = ref(false)
const is_progress_saving = ref(false)

const projectCompleteModalOpen = ref(false)
const isLoadingProjectRequestComplete = ref(false)

const isDataLoading = ref(true)
const isError = ref(false)

const projectProgresses = ref<any>([])
const page = ref(1)
const limit = ref(5)
const total = ref<any>(null)

if (!Boolean(router.currentRoute.value.params.id)) {
  router.push({ name: 'contractor-add-progress' })
} else {
  project_id.value = router.currentRoute.value.params.id
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
          projectId: project_id.value,
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
    projectId: project_id.value,
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
  await fetchProjectProgress()
})

const progress_title: any = useField(
  'progress_title',
  yup.string().required('Please enter a image title')
)

const progress_description: any = useField(
  'progress_description',
  yup.string().required('Please enter a image description')
)

const saveProgress = async () => {
  const title = await progress_title.validate()
  const description = await progress_description.validate()

  if (title.valid && description.valid && Boolean(project_id.value)) {
    is_progress_saving.value = true

    let projectProgressImages: any = []

    if (file_list.value.length != 0) {
      for (var i = 0; i < file_list.value.length; i++) {
        projectProgressImages.push({
          name: file_list.value[i].url,
          description: file_list.value[i].description,
        })
      }
    }

    let projectProgress = {
      projectId: project_id.value,
      week: current_week.value + 1,
      title: progress_title.value.value,
      description: progress_description.value.value,
      images: projectProgressImages.length === 0 ? null : projectProgressImages,
    }

    const state = await projectService.saveProjectProgress(projectProgress)

    if (state.data.status == 'SUCCESS') {
      notif.success('Project progress added successfully')
      is_progress_saving.value = false
      progressActionsOpen.value = false
      file_list.value = []
      current_week.value = 0
      clearImageDescription()
      await fetchProjectProgress()
    } else {
      is_progress_saving.value = false
      notif.error('Something went wrong!')
    }
  }
}

const openAddProjectProgressModal = async () => {
  progressActionsOpen.value = true
  progress_title.resetField()
  progress_description.resetField()
  await fetchProjectProgressLastWeekNumber()
}

const openCompleteProjectModal = async () => {
  projectCompleteModalOpen.value = true
}

const completeProject = async () => {
  isLoadingProjectRequestComplete.value = true
  let formData = new FormData()
  formData.append('id', project_id.value)
  formData.append('status', 'COMPLETED')

  const state = await projectService.updateStatus(formData)

  if (state.data.status == 'SUCCESS') {
    notif.success({
      message: 'Project completed successfully',
      duration: 3000,
    })
    isLoadingProjectRequestComplete.value = false
    projectCompleteModalOpen.value = false
    router.go(-1)
  } else {
    isLoadingProjectRequestComplete.value = false
    projectCompleteModalOpen.value = false
    notif.error({
      message: 'Something went wrong!',
      duration: 3000,
    })
  }
}

const fetchProjectProgressLastWeekNumber = async () => {
  const project_progress_state =
    await projectService.getProjectProgressLastWeekNumberByProjectId(project_id.value)
  if (project_progress_state.data.status == 'SUCCESS') {
    current_week.value = project_progress_state.data.results
  } else {
    notif.error('Something went wrong!')
  }
}

const clearImageDescription = async () => {
  description_data.value = ''
}

const onKeyPress = async (e: any, index: any) => {
  description_data.value = description_data.value + e.key
  file_list.value[index].description = description_data.value
}

const removeImage = async (index: number) => {
  file_list.value.splice(index, 1)
  clearImageDescription()
}

const onEventFilePicked = async (event: any) => {
  let base64Image = await getBase64(event.target.files[0])
  file_list.value.push({ url: base64Image, description: '' })
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

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';

.list-view-v2 {
  .list-view-item {
    @include vuero-s-card;

    margin-bottom: 16px;
    padding: 16px;

    &:hover,
    &:focus {
      box-shadow: var(--light-box-shadow);
    }

    .list-view-item-inner {
      display: flex;

      >img {
        display: block;
        min-height: 130px;
        max-height: 130px;
        min-width: 190px;
        max-width: 190px;
        object-fit: cover;
        border-radius: var(--radius);
      }

      .meta-left {
        display: flex;
        flex-direction: column;
        margin-left: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1.1rem;
          line-height: 1.5;

          .rating {
            margin-left: 12px;

            i {
              position: relative;
              top: -2px;
              font-size: 12px;
              color: var(--fade-grey-dark-4);

              &.active {
                color: #ffc43b;
              }
            }
          }
        }

        p {
          font-size: 0.95rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }

        >span {
          display: flex;
          align-items: center;
          margin-top: 10px;
          font-family: var(--font);
          font-size: 0.9rem;
          color: var(--primary);

          .icon-separator {
            font-size: 5px;
            color: var(--light-text);
            padding: 0 10px;
          }
        }

        .icon-list {
          margin-top: auto;
          display: flex;

          >span {
            display: flex;
            align-items: center;
            margin-right: 15px;

            span {
              font-size: 0.85rem;
              font-family: var(--font-alt);
              color: var(--dark-text);
            }

            i {
              font-size: 1.2rem;
              margin-right: 6px;
              color: var(--light-text);
            }
          }
        }
      }

      .meta-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .buttons {
          margin-bottom: 0;
          margin-right: 10px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v2 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;

            .rating {
              i:not(.active) {
                color: var(--dark-sidebar-dark-2);
              }
            }
          }

          >span {
            color: var(--primary);
          }

          .icon-list {
            >span {
              span {
                color: var(--dark-dark-text);
              }
            }
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:first-child {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .list-view-v2 {
    .list-view-item {
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        >img {
          width: 100%;
          max-width: 100%;
          min-height: 160px;
          max-height: 160px;
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-left: 0;

          >span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            >span {
              flex-direction: column;
              text-align: center;
              margin: 10px;
              width: calc(33.3% - 20px);

              i {
                margin: 0;
              }
            }
          }
        }

        .meta-right {
          margin: 16px 0 0;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 48%;
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .list-view-v2 {
    .list-view-inner {
      display: flex;
      flex-wrap: wrap;

      .list-view-item {
        padding: 20px;
        margin: 10px;
        width: calc(50% - 20px);

        .list-view-item-inner {
          flex-direction: column;
          height: 100%;
          min-height: 450px;

          >img {
            width: 100%;
            max-width: 100%;
            min-height: 160px;
            max-height: 160px;
            margin-bottom: 1rem;
          }

          .meta-left {
            margin-left: 0;

            >span {
              margin-bottom: 16px;
            }

            .icon-list {
              flex-wrap: wrap;

              >span {
                flex-direction: column;
                text-align: center;
                margin: 10px;
                width: calc(33.3% - 20px);

                i {
                  margin: 0;
                }
              }
            }
          }

          .meta-right {
            margin: auto 0 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            .buttons {
              margin: 16px 0 0;
              width: 100%;
              display: flex;
              justify-content: space-between;

              .button {
                width: 48%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
