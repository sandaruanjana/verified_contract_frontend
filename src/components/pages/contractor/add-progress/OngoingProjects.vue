<template>
  <div class="list-view-toolbar">
    <VField>
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        />
      </VControl>
    </VField>
  </div>

  <div v-if="isError" class="error-container">
    <SomeThingWentWrong />
  </div>

  <div class="page-content-inner">
    <!--List-->
    <div class="list-view list-view-v2">
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
            src="/@src/assets/illustrations/placeholders/search-2.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-2-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <div>
        <div class="list-view-inner">
          <TransitionGroup name="list-complete" tag="div">
            <div v-for="project in projects" :key="project.id" class="list-view-item">
              <div class="list-view-item-inner">
                <div class="meta-left">
                  <h3>
                    <span>{{ project.name }}</span>
                  </h3>
                  <p>
                    <i
                      aria-hidden="true"
                      class="iconify"
                      data-icon="feather:file-text"
                    ></i>
                    <span> {{}} {{ project.specialInstructions }}</span>
                  </p>
                  <p>
                    <i aria-hidden="true" class="iconify" data-icon="feather:map-pin"></i>
                    <span>
                      {{}} {{ project.addressLine1 }}, {{ project.addressLine2 }}</span
                    >
                  </p>
                  <span>
                    <span> Date : {{ project.preferredDate }} </span>
                    <i aria-hidden="true" class="fas fa-circle icon-separator"></i>
                    <span> Category : {{ project.category }} </span>
                    <i aria-hidden="true" class="fas fa-circle icon-separator"></i>
                    <span> Nature : {{ project.nature }} </span>
                  </span>

                  <div class="icon-list">
                    <!-- <span>
                      <i aria-hidden="true" class="lnil lnil-sun"></i>
                      <span></span>
                    </span> -->
                  </div>
                </div>
                <div class="meta-right">
                  <VButton @click="selectProject(project.id)" color="primary" raised
                    >Select</VButton
                  >
                </div>
              </div>
            </div>

            <div v-if="isDataLoading" v-for="index in 20" :key="index">
              <VPlaceloadWrap>
                <VPlaceload
                  height="100px"
                  mobileHeight="100px"
                  width="100%"
                  mobileWidth="100%"
                  class="mx-2"
                />
              </VPlaceloadWrap>
              <br />
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'

const notif = useNotyf()
const router = useRouter()

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
    let element = document.querySelector('.list-view-v2')
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

        const project_state = await projectService.getAllAssignByStatus(params)
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

const fetchInProgressProject = async () => {
  let params = {
    page: page.value,
    pageSize: limit.value,
    searchTerm: filters.value,
    status: 'IN_PROGRESS',
  }

  const project_state = await projectService.getAllAssignByStatus(params)
  if ((project_state.state.error as any) === null) {
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
  await fetchInProgressProject()
})

const selectProject = async (id: any) => {
  router.push({
    name: 'contractor-project-progress',
    params: {
      id: id,
    },
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

      > img {
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

        > span {
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

          > span {
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

          > span {
            color: var(--primary);
          }

          .icon-list {
            > span {
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

        > img {
          width: 100%;
          max-width: 100%;
          min-height: 160px;
          max-height: 160px;
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-left: 0;

          > span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            > span {
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

          > img {
            width: 100%;
            max-width: 100%;
            min-height: 160px;
            max-height: 160px;
            margin-bottom: 1rem;
          }

          .meta-left {
            margin-left: 0;

            > span {
              margin-bottom: 16px;
            }

            .icon-list {
              flex-wrap: wrap;

              > span {
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
