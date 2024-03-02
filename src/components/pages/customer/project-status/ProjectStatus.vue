<template>
  <div v-if="projectProgressActionsOpen">
    <ProjectProgressModal
      :isOpen="projectProgressActionsOpen"
      @exit="projectProgressActionsOpen = false"
      :project_id="selected_project_id"
      :contractor_id="selected_contractor_id"
    />
  </div>

  <div>
    <div class="card-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
          @input="filter"
        />
      </VControl>
    </div>

    <div v-if="isError">
      <SomeThingWentWrong />
    </div>

    <div class="card-grid card-grid-v3">
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
            src="/@src/assets/illustrations/placeholders/search-3.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-3-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <!--Card Grid v3-->
      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid Item-->
        <div v-for="project in projects" :key="project.id" class="column is-4">
          <div class="card-grid-item">
            <!-- <label v-if="item.lockable" class="h-toggle">
              <input type="checkbox" :checked="item.locked" />
              <span class="toggler">
                <span class="active">
                  <i aria-hidden="true" class="iconify" data-icon="feather:lock"></i>
                </span>
                <span class="inactive">
                  <i aria-hidden="true" class="iconify" data-icon="feather:check"></i>
                </span>
              </span>
            </label> -->
            <!-- <VAvatar size="large" :picture="item.image" :badge="item.badge" squared /> -->
            <h3 class="dark-inverted">{{ project.name }}</h3>
            <VTag color="purple" :label="project.preferredDate" />
            <div class="description">
              <p>{{ project.description }}</p>
            </div>
            <!-- <div class="people">
              <VAvatar
                v-for="user in item.team"
                :key="user.id"
                size="small"
                v-bind="getAvatarData(user)"
              />
            </div> -->

            <button
              @click="selectProject(project)"
              class="button v-button is-dark-outlined"
            >
              <span class="icon">
                <i aria-hidden="true" class="iconify" data-icon="feather:eye"></i>
              </span>
              <span>View</span>
            </button>
          </div>
        </div>

        <div v-if="isDataLoading" v-for="key in 20" :key="key" class="column is-4">
          <div class="card-grid-item">
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { projectService } from '/@src/service/project-service'
import { useNotyf } from '/@src/composable/useNotyf'
import ProjectProgressModal from './ProjectProgressModal.vue'

const notif = useNotyf()

const projectProgressActionsOpen = ref(false)
const selected_project_id = ref('')
const selected_contractor_id = ref('')

const filters = ref('')
const isDataLoading = ref(true)
const isError = ref(false)

const projects = ref<any>([])
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
    let element = document.querySelector('.card-grid-v3')
    if (element!.getBoundingClientRect().bottom < window.innerHeight) {
      if (projects.value.length < total.value) {
        page.value++
        isDataLoading.value = true

        let params = {
          page: page.value,
          pageSize: limit.value,
          searchTerm: filters.value,
          status: 'IN_PROGRESS',
        }

        const project_state = await projectService.getAllAssigneeByStatus(params)
        if ((project_state.state.error as any) === null) {
          if (project_state.state.data.length !== 0) {
            //delay for 1 second
            await new Promise((resolve) => setTimeout(resolve, 1000))
            projects.value.push(...project_state.state.data)
            total.value = project_state.state.total
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
  await fetchProjects()
}

const fetchProjects = async () => {
  let params = {
    page: page.value,
    pageSize: limit.value,
    searchTerm: filters.value,
    status: 'IN_PROGRESS',
  }

  const project_state = await projectService.getAllAssigneeByStatus(params)
  if ((project_state.state.error as any) === null) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    projects.value = []
    page.value = 1
    projects.value = project_state.state.data
    total.value = project_state.state.total
    isDataLoading.value = false
  } else {
    isError.value = true
    isDataLoading.value = false
    notif.error('Something went wrong!')
  }
}

onMounted(async () => {
  await fetchProjects()
})

const selectProject = async (project: any) => {
  selected_project_id.value = project.id
  selected_contractor_id.value = project.assignUserId
  projectProgressActionsOpen.value = true
}
</script>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';

.card-grid {
  .columns {
    margin-left: -0.5rem !important;
    margin-right: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.card-grid-v3 {
  .card-grid-item {
    @include vuero-s-card;

    position: relative;
    text-align: center;
    padding: 30px;

    .h-toggle {
      position: absolute;
      top: 28px;
      right: 10px;
      transform: scale(0.85);
    }

    > .v-avatar {
      display: block;
      margin: 0 auto 10px;
      border-radius: 16px;

      .avatar {
        object-fit: cover;
        border: 1px solid var(--fade-grey-dark-4);
        box-shadow: var(--light-box-shadow);
      }

      .badge {
        bottom: 22px;
        right: -12px;
      }
    }

    > h3 {
      font-size: 1.1rem;
      font-weight: 600;
      font-family: var(--font-alt);
      color: var(--dark-text);
    }

    > p {
      font-size: 0.9rem;
    }

    .description {
      padding: 12px 0;
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

.is-dark {
  .card-grid-v3 {
    .card-grid-item {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .card-grid-v3 .card-grid-item > h3 {
    font-size: 1rem;
  }
}
</style>
