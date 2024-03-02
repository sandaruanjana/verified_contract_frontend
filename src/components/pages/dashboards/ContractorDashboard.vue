<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'

import { customersOptions } from '/@src/data/personal-v1/customersChart'
import { teamGaugeOptions } from '/@src/data/personal-v1/teamGaugeChart'
import { profitChartOptions } from '/@src/data/personal-v1/profitChart'

import { onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import ApiResponse from '/@src/utils/api-response-interface'

import { contractorService } from '/@src/service/contractor-service'
import { basic_url } from '/@src/utils/basic_config'

// import { customersOptions } from '/@src/data/dashboards/personal-v1/customersChart'
// import { teamGaugeOptions } from '/@src/data/dashboards/personal-v1/teamGaugeChart'
// import { profitChartOptions } from '/@src/data/dashboards/personal-v1/profitChart'
const router = useRouter()

const user: any = useStorage('user', [])
const contractor_id = ref(user.value.id)
const username = ref<string>(user.value.name)
const position = ref<string>(user.value.role)
const profile_image = ref<string>(
  user.value.profilePicture === null
    ? '/@src/assets/image/profile.png'
    : basic_url + '/api/uploads/profile_picture/' + user.value.profilePicture
)

const contractor_dashboard_info = ref<ApiResponse>()
const GalleryCount = ref(0)
const MyProjectsCount = ref(0)
const PublicProjectsCount = ref(0)

const LoadDashboardInfo = async () => {
  contractor_dashboard_info.value = await contractorService.LoadContractorDashboardInfo(
    contractor_id.value
  )
  GalleryCount.value = contractor_dashboard_info.value.data.GalleryCount
  MyProjectsCount.value = contractor_dashboard_info.value.data.MyProjectsCount
  PublicProjectsCount.value = contractor_dashboard_info.value.data.PublicProjectsCount
}
const test = ref(123)

onMounted(async () => {
  await LoadDashboardInfo()
})
</script>

<template>
  <div class="personal-dashboard personal-dashboard-v1">
    <!--Personal Dashboard V1-->
    <!--Header-->
    <div class="dashboard-header">
      <VAvatar :picture="profile_image" size="large" />
      <div class="start">
        <h3>Welcome back, {{ username }}</h3>
        <p>We're very happy to see you again on your personal dashboard.</p>
      </div>
      <div class="end">
        <VButton dark="3">View Reports</VButton>
        <VButton color="primary" elevated>Manage Profile</VButton>
      </div>
    </div>

    <!--Body-->
    <div class="dashboard-body">
      <div class="columns is-multiline">
        <!--Card-->
        <div class="column is-6">
          <div class="dashboard-card">
            <h4 class="dark-inverted">Your Quick Stats</h4>

            <div class="quick-stats">
              <div class="quick-stats-inner">
                <!--Stat-->
                <div class="quick-stat">
                  <VBlock
                    @click="
                      $router.push({
                        name: 'contractor-all-public-project',
                      })
                    "
                    title="Public Projects"
                    :subtitle="PublicProjectsCount"
                    center
                    m-responsive
                    t-responsive
                  >
                    <template #icon>
                      <VIconBox color="purple" rounded>
                        <i aria-hidden="true" class="lnil lnil-folder"></i>
                      </VIconBox>
                    </template>
                  </VBlock>
                </div>

                <!--Stat-->
                <div class="quick-stat">
                  <VBlock
                    @click="
                      $router.push({
                        name: 'contractor-my-project',
                      })
                    "
                    title="My Projects"
                    :subtitle="MyProjectsCount"
                    center
                    m-responsive
                    t-responsive
                  >
                    <template #icon>
                      <VIconBox color="orange" rounded>
                        <i aria-hidden="true" class="lnil lnil-pulse"></i>
                      </VIconBox>
                    </template>
                  </VBlock>
                </div>

                <!--Stat-->
                <div class="quick-stat">
                  <VBlock
                    @click="
                      $router.push({
                        name: 'contractor-gallery',
                      })
                    "
                    title="Gallery"
                    :subtitle="GalleryCount"
                    center
                    m-responsive
                    t-responsive
                  >
                    <template #icon>
                      <VIconBox color="green" rounded>
                        <i aria-hidden="true" class="lnil lnil-gallery"></i>
                      </VIconBox>
                    </template>
                  </VBlock>
                </div>

                <!--Stat-->
                <div class="quick-stat">
                  <VBlock
                    @click="
                      $router.push({
                        name: 'contractor-add-progress',
                      })
                    "
                    title="Add Progress"
                    center
                    m-responsive
                    t-responsive
                  >
                    <template #icon>
                      <VIconBox color="info" rounded>
                        <i aria-hidden="true" class="lnil lnil-add-files"></i>
                      </VIconBox>
                    </template>
                  </VBlock>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Card-->
        <div class="column is-6">
          <div class="dashboard-card">
            <ApexChart
              :height="customersOptions.chart.height"
              :type="customersOptions.chart.type"
              :series="customersOptions.series"
              :options="customersOptions"
            >
            </ApexChart>
          </div>
        </div>

        <!--Card-->
        <div class="column is-4">
          <div class="dashboard-card is-upgrade">
            <i aria-hidden="true" class="lnil lnil-crown-alt-1"></i>
            <div class="cta-content">
              <h4>Hey {{ username }}, you're doing great.</h4>
              <p class="white-text">Start using our team and project management tools</p>
              <a class="link inverted-text">Learn More</a>
            </div>
          </div>
        </div>

        <!--Card-->
        <div class="column is-4">
          <div class="dashboard-card is-gauge">
            <div class="people">
              <VAvatar picture="/demo/avatars/21.jpg" />
              <VAvatar initials="%" color="h-purple" />
              <VAvatar picture="/demo/avatars/39.jpg" />
            </div>
            <ApexChart
              :height="teamGaugeOptions.chart.height"
              :type="teamGaugeOptions.chart.type"
              :series="teamGaugeOptions.series"
              :options="teamGaugeOptions"
            >
            </ApexChart>
          </div>
        </div>

        <!--Card-->
        <!--        <div class="column is-4">-->
        <!--          <div class="dashboard-card">-->
        <!--            <ApexChart-->
        <!--              :height="profitChartOptions.chart.height"-->
        <!--              :type="profitChartOptions.chart.type"-->
        <!--              :series="profitChartOptions.series"-->
        <!--              :options="profitChartOptions"-->
        <!--            >-->
        <!--            </ApexChart>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

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
</style>
