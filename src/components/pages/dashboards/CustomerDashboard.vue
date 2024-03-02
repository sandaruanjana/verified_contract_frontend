<template>
  <div class="personal-dashboard personal-dashboard-v1">
    <!--Header-->
    <div class="dashboard-header">
      <VAvatar :picture="profile_image" size="large" />
      <div class="start">
        <h3>Welcome back, {{ username }}</h3>
        <p>We're very happy to see you again</p>
      </div>
      <!-- <div class="end">
        <VButton dark="3">View Reports</VButton>
        <VButton color="primary" elevated>Manage Store</VButton>
      </div> -->
    </div>

    <!--Body-->
    <div class="dashboard-body">
      <div class="columns is-multiline">
        <!--Card-->
        <div class="column is-7">
          <div class="dashboard-card">
            <div class="card-head">
              <h3 class="dark-inverted">Projects Completion</h3>
              <a class="action-link" tabindex="0">Reports</a>
            </div>
            <ApexChart
              id="completion-chart"
              :height="completionOptions.chart.height"
              :type="completionOptions.chart.type"
              :series="completionOptions.series"
              :options="completionOptions"
            >
            </ApexChart>
          </div>
        </div>

        <!--Card-->
        <div class="column is-5 personal-dashboard-v2">
          <div class="dashboard-card has-margin-bottom">
            <div class="card-head">
              <h3 class="dark-inverted">Active Projects</h3>
              <router-link
                :to="{ name: 'customer-project-status' }"
                class="action-link"
                tabindex="0"
                >View All</router-link
              >
            </div>
            <div class="active-projects">
              <!--Project-->
              <VBlock
                v-for="project in projects"
                :title="project.name"
                :key="project.id"
                center
              >
                <template #icon>
                  <VAvatar
                    initials="P"
                    :color="getColorByKey(randomInteger(0, 3))"
                    size="medium"
                    squared
                  />
                </template>
                <template #action>
                  <VAvatarStack :avatars="avatarStack1" size="small" />
                  <ProjectWidgetDropdown />
                </template>
              </VBlock>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import ApexChart from 'vue3-apexcharts'
import { onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useNotyf } from '/@src/composable/useNotyf'

import ApexChart from 'vue3-apexcharts'
import { projectService } from '/@src/service/project-service'
import ApiResponse from '/@src/utils/api-response-interface'
// import { customersOptions } from '/@src/data/dashboards/personal-v1/customersChart'
// import { teamGaugeOptions } from '/@src/data/dashboards/personal-v1/teamGaugeChart'
// import { profitChartOptions } from '/@src/data/dashboards/personal-v1/profitChart'
import { completionOptions } from '/@src/data/personal-v2/taskCompletionChart'
import { basic_url } from '/@src/utils/basic_config'

const notfy = useNotyf()
const router = useRouter()

let user: any = useStorage('user', [])

const customer_id = ref(user.value.id)
const username = ref<string>(user.value.name)
const position = ref<string>(user.value.role)
const profile_image = ref<string>(
  user.value.profilePicture === null
    ? '/@src/assets/image/profile.png'
    : basic_url + '/api/uploads/profile_picture/' + user.value.profilePicture
)

const customer_dashboard_info = ref<ApiResponse>()
const GalleryCount = ref(0)
const ProjectProposalsCount = ref(0)
const projects = ref<any>([])

const fetchInProgressProject = async () => {
  let params = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    status: 'IN_PROGRESS',
  }

  const project_state = await projectService.getAllAssigneeByStatus(params)
  if ((project_state.state.error as any) === null) {
    projects.value = []
    projects.value = project_state.state.data
  } else {
    notfy.error('Something went wrong!')
  }
}

const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getColorByKey = (key: number) => {
  if (key === 0) {
    return 'h-blue'
  } else if (key === 1) {
    return 'h-orange'
  } else if (key === 2) {
    return 'h-green'
  } else if (key === 3) {
    return 'h-red'
  }
}

onMounted(async () => {
  await fetchInProgressProject()
})
</script>

<style lang="scss">
@import '../../../scss/abstracts/mixins';

.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v1 {
  .dashboard-header {
    display: flex;
    align-items: center;
    font-family: var(--font);
    margin-bottom: 30px;

    .start {
      margin-left: 12px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.3rem;
        color: var(--dark-text);
      }
    }

    .end {
      margin-left: auto;
      display: flex;
      justify-content: flex-end;

      .button {
        margin-left: 10px;
      }
    }
  }

  .dashboard-body {
    .dashboard-card {
      @include vuero-s-card;

      font-family: var(--font);

      > h4,
      .ApexCharts-title-text {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 12px;
      }

      .quick-stats {
        .quick-stats-inner {
          display: flex;
          flex-wrap: wrap;
          margin-left: -8px;
          margin-right: -8px;

          .quick-stat {
            width: calc(50% - 16px);
            padding: 40px 20px;
            background: var(--widget-grey);
            margin: 8px;
            border-radius: var(--radius-large);
            transition: all 0.3s; // transition-all test

            ::v-deep(.media-flex-center) {
              .flex-meta {
                span {
                  &:first-child {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: var(--dark-text);
                  }
                }
              }
            }
          }
        }
      }
    }

    .dashboard-card {
      &.is-upgrade {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--primary-light-8);
        border-color: var(--primary-light-8);
        padding: 20px 40px;
        min-height: 320px;
        border-radius: var(--radius-large);
        box-shadow: var(--primary-box-shadow);

        .lnil,
        .lnir {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 4rem;
          opacity: 0.3;
        }

        .cta-content {
          text-align: center;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1.2rem;
            color: var(--smoke-white);
            margin-bottom: 8px;
          }
        }

        .link {
          display: block;
          font-family: var(--font-alt);
          font-weight: 500;
          margin-top: 0.5rem;

          &:hover,
          &:focus {
            color: var(--smoke-white);
            opacity: 0.6;
          }
        }
      }

      &.is-gauge {
        position: relative;

        .people {
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          z-index: 5;

          .v-avatar {
            margin: 0 4px;
          }
        }
      }
    }
  }
}

.is-dark {
  .personal-dashboard-v1 {
    .dashboard-header {
      .start {
        h3 {
          color: var(--dark-dark-text);
        }
      }
    }

    .dashboard-body {
      .dashboard-card {
        @include vuero-card--dark;

        &.is-upgrade {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: var(--primary-box-shadow);
        }

        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              background: var(--dark-sidebar-light-2);
              border: 1px solid var(--dark-sidebar-light-12);

              .media-flex-center {
                .flex-meta {
                  span {
                    &:first-child {
                      color: var(--dark-dark-text);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .personal-dashboard-v1 {
    .dashboard-header {
      text-align: center;
      flex-direction: column;

      .start {
        margin: 10px auto;
      }

      .end {
        margin: 0;
        justify-content: space-between;
      }
    }

    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 10px 0;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .personal-dashboard-v1 {
    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 2px 0 0;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}

.personal-dashboard-v2 {
  .dashboard-header {
    @include vuero-s-card;

    display: flex;
    align-items: center;
    padding: 30px;

    .user-meta {
      padding: 0 3rem;
      border-right: 1px solid var(--fade-grey-dark-3) h3 {
        max-width: 180px;
      }
    }

    .user-action {
      padding: 0 3rem;
    }

    .cta {
      position: relative;
      flex-grow: 2;
      max-width: 275px;
      margin-left: auto;
      background: var(--primary-light-8);
      padding: 20px;
      border-radius: var(--radius-large);
      box-shadow: var(--primary-box-shadow);

      .lnil,
      .lnir {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-size: 4rem;
        opacity: 0.3;
      }

      .link {
        font-family: var(--font-alt);
        display: block;
        font-weight: 500;
        margin-top: 0.5rem;

        &:hover,
        &:focus {
          color: var(--smoke-white);
          opacity: 0.6;
        }
      }
    }
  }

  .dashboard-card {
    @include vuero-s-card;

    padding: 30px;

    &:not(:last-child) {
      margin-bottom: 1.5rem;
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 0;
      }
    }

    .active-projects,
    .active-team,
    .active-list {
      padding: 10px 0;
    }
  }
}
</style>
