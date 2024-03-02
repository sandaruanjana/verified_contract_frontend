<template>
  <div v-if="viewProjectActionOpen">
    <ViewProjectModal :isOpen="viewProjectActionOpen" @exit="viewProjectActionOpen = false" :project_id="projectId"
      :bodyData="bodyData" />
  </div>

  <VModal :open="bidActionsOpen" title="Submit your bid amount" size="small" actions="center"
    @close="; (bidActionsOpen = false), bid_amount.resetField()">
    <template #content>
      <VField>
        <VControl icon="lnil lnil-dollar">
          <input v-model="bid_amount.value.value" type="number" class="input" placeholder="Amount" />
        </VControl>
        <p v-if="bid_amount.errorMessage" style="font-size: 15px" class="help is-danger">
          {{ bid_amount.errorMessage }}
        </p>
      </VField>
    </template>
    <template #action>
      <VButton color="danger" :loading="isLoadingProjectBidRequest" raised @click="bidProject">Bid
      </VButton>
    </template>
  </VModal>

  <div class="s-card mb-5">
    <div class="columns is-multiline">
      <div class="column is-12-tablet is-4-desktop">
        <div class="mt-4">
          <V-Field>
            <V-Control>
              <Multiselect v-model="selectedCategory" :options="categoryOptions" label="name" track-by="name"
                placeholder="Category" :searchable="true" />
            </V-Control>
          </V-Field>
        </div>
      </div>
      <!-- <div class="column is-12-tablet is-4-desktop">
        <div class="mt-4">
          <V-Field>
            <V-Control>
              <Multiselect v-model="selectedEducations" :options="educationOptions" label="name" track-by="name"
                placeholder="Education" :searchable="true" />
            </V-Control>
          </V-Field>
        </div>
      </div> -->
      <!-- <div class="column is-12-tablet is-4-desktop">
        <div class="mt-4">
          <V-Field>
            <V-Control>
              <Multiselect v-model="selectedArts" :options="artsOptions" label="name" track-by="name" placeholder="Arts"
                :searchable="true" />
            </V-Control>
          </V-Field>
        </div>
      </div> -->
      <div class="column is-12-tablet is-10-desktop"></div>
      <div class="column is-12-tablet is-2-desktop">
        <VButton @click="render = true" color="primary" icon="feather:refresh-ccw" raised outlined>
          Refresh
        </VButton>
      </div>
    </div>
  </div>

  <VFlexTableWrapper v-model:page="queryParam.page" v-model:limit="queryParam.limit"
    v-model:searchTerm="queryParam.searchTerm" v-model:sort="queryParam.sort" :columns="columns" :data="fetchData"
    :total="total" class="mt-4">
    <!--
      Here we retrieve the internal wrapperState.
      Note that we can not destructure it
    -->
    <template #default="wrapperState">
      <!--Table Pagination-->
      <VFlexPagination v-model:current-page="wrapperState.page" :item-per-page="wrapperState.limit"
        :total-items="wrapperState.total" :max-links-displayed="2" no-router>
        <!-- The controls can be updated anywhere in the slot -->
        <template #before-pagination>
          <VFlex class="mr-4">
            <VField>
              <VControl icon="feather:search">
                <input v-model="wrapperState.searchInput" type="text" class="input is-rounded" placeholder="Filter..." />
              </VControl>
            </VField>
          </VFlex>
        </template>

        <template #before-navigation>
          <VFlex class="mr-4">
            <VField>
              <VControl>
                <div class="select is-rounded">
                  <select v-model="wrapperState.limit">
                    <option :value="1">1 results per page</option>
                    <option :value="10">10 results per page</option>
                    <option :value="15">15 results per page</option>
                    <option :value="25">25 results per page</option>
                    <option :value="50">50 results per page</option>
                  </select>
                </div>
              </VControl>
            </VField>
          </VFlex>
        </template>
      </VFlexPagination>

      <VFlexTable rounded clickable>
        <template #body>
          <!--
            The wrapperState.loading will be update
            when the fetchData function is running
          -->
          <div v-if="wrapperState.loading" class="flex-list-inner">
            <div v-for="key in wrapperState.limit" :key="key" class="flex-table-item">
              <VFlexTableCell :column="{ grow: true, media: true }">
                <VPlaceloadAvatar size="medium" />

                <VPlaceloadText :lines="2" width="60%" last-line-width="20%" class="mx-2" />
              </VFlexTableCell>
              <VFlexTableCell>
                <VPlaceload width="60%" class="mx-1" />
              </VFlexTableCell>
              <VFlexTableCell>
                <VPlaceload width="60%" class="mx-1" />
              </VFlexTableCell>
              <VFlexTableCell>
                <VPlaceload width="60%" class="mx-1" />
              </VFlexTableCell>
              <VFlexTableCell>
                <VPlaceload width="60%" class="mx-1" />
              </VFlexTableCell>
              <VFlexTableCell :column="{ align: 'end' }">
                <VPlaceload width="45%" class="mx-1" />
              </VFlexTableCell>
            </div>
          </div>

          <!-- This is the empty state -->
          <div v-else-if="wrapperState.data.length === 0" class="flex-list-inner">
            <VPlaceholderSection title="No matches" subtitle="There is no data that match your query." class="my-6">
              <template #image>
                <img class="light-image" src="/@src/assets/illustrations/placeholders/search-4.svg" alt="" />
                <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-4-dark.svg" alt="" />
              </template>
            </VPlaceholderSection>
          </div>
        </template>

        <!-- This is the body cell slot -->
        <template #body-cell="{ row, column }">
          <template v-if="column.key === 'address'">
            <span :class="[
              column.cellClass,
              column.inverted && 'dark-inverted',
              !column.inverted && (column.bold ? 'dark-text' : 'light-text'),
            ]" :title="row.AddressLine1">
              {{ row.addressLine1 }}, {{ row.addressLine2 }}
            </span>
          </template>
          <template v-if="column.key === 'actions'">
            <VButton @click="openViewProjectModal(row)"> View</VButton>
            <VButton @click="openRequestBidModal(row.id, row.bidAmount)" :color="row.isBided === 0 ? 'primary' : 'danger'"
              style="margin-left: 15px">
              Bid</VButton>
          </template>
        </template>
      </VFlexTable>

      <!--Table Pagination-->
      <VFlexPagination v-model:current-page="wrapperState.page" class="mt-5" :item-per-page="wrapperState.limit"
        :total-items="wrapperState.total" :max-links-displayed="2" no-router />
    </template>
  </VFlexTableWrapper>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { useField } from 'vee-validate'
import { computed, onMounted, reactive, ref } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import { skillService } from '/@src/service/skill-service'
import * as yup from 'yup'
import type { VFlexTableWrapperDataResolver } from '/@src/components/base/table/VFlexTableWrapper.vue'
import sleep from '/@src/utils/sleep'

const notif = useNotyf()

let user: any = useStorage('user', [])
const projectId = ref('')
const bidActionsOpen = ref(false)
const isLoadingProjectBidRequest = ref(false)
const viewProjectActionOpen = ref(false)

//skills
const serviceHomeRemodelsOptions = ref<any>([])
const educationOptions = ref<any>([])
const artsOptions = ref<any>([])

const selectedServiceHomeRemodels = ref<any>([])
const selectedEducations = ref<any>([])
const selectedArts = ref<any>([])

const bodyData = ref<Object>()


const categoryOptions = ref<any>([])
const selectedCategory = ref<any>([])


categoryOptions.value.push("Construction")
categoryOptions.value.push("Commercial Remodel")
categoryOptions.value.push("Plumbing")
categoryOptions.value.push("Painter")
categoryOptions.value.push("Roofing")
categoryOptions.value.push("Electrical")
categoryOptions.value.push("Lawn Care/ Landscaping")
categoryOptions.value.push("Pool Care")
categoryOptions.value.push("Appliance Repair")
categoryOptions.value.push("Woodworker")
categoryOptions.value.push("Furniture Repair/Restoration")

// selectedCategory.value = categoryOptions.value[0]

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

onMounted(async () => {
  await fetchSkills()
})

const filters = ref('')
const pageQuery = ref(1)
const limitQuery = ref(10)
const total = ref(0)
const sortQuery = ref('')
const render = ref(false)

// we don't have to set "searchable" parameter
// this will be handled by the fetchData function
const columns = {
  preferredDate: {
    label: 'Date',
    grow: true,
    sortable: true,
  },
  name: {
    label: 'Name',
    grow: true,
    sortable: false,
  },
  specialInstructions: {
    label: 'Description',
    grow: true,
    sortable: false,
  },
  address: {
    label: 'Site Address',
    grow: true,
  },
  category: {
    label: 'Category',
    grow: true,
  },
  actions: {
    label: 'Action',
    align: 'center',
  },
} as const

// this is an example of useXxx function that we can reuse across components.
// it will return writable computeds that works like ref values
// but the values will be sync with the route query params
function useQueryParam() {
  const searchTerm = computed({
    get: () => {
      return filters.value
    },
    set(value) {
      filters.value = value
    },
  })

  const sort = computed({
    get: () => {
      return sortQuery.value
    },
    set(value) {
      sortQuery.value = value
    },
  })

  const limit = computed({
    get: () => {
      return limitQuery.value
    },
    set(value) {
      limitQuery.value = value
    },
  })

  const page = computed({
    get: () => {
      return pageQuery.value
    },
    set(value) {
      pageQuery.value = value
    },
  })

  return reactive({
    searchTerm,
    sort,
    limit,
    page,
  })
}

const queryParam = useQueryParam()

// the fetchData function will be called each time one of the parameter changes
const fetchData: VFlexTableWrapperDataResolver = async ({
  searchTerm,
  start,
  limit,
  sort,
  controller,
}) => {
  // sort will be a string like "name:asc"
  let [sortField, sortOrder] =
    sort && sort.includes(':') ? sort.split(':') : [undefined, undefined]

  let params = {
    page: start + 1,
    pageSize: limit,
    searchTerm: searchTerm,
    userId: user.value.id,
    isPublic: 1,
    radius: 100,

    category: selectedCategory.value
      ? selectedCategory.value
      : '',
    categoryOneId: '',
    categoryTwoId: '',
    // categoryTwoId: selectedEducations.value ? selectedEducations.value : '',
    categoryThreeId: '',
    render: render.value,
  }

  render.value = false

  const projects = await projectService.getAllByIsPublicAndDistance(params)
  // wait more time
  await sleep(1000)
  // the return of the function must be an array
  return projects.state.data
}

const bid_amount: any = useField(
  'bid_amount',
  yup.number().required('Bid amount is required')
)

const openViewProjectModal = async (row: any) => {
  projectId.value = row.id
  bodyData.value = row
  viewProjectActionOpen.value = true
}

const openRequestBidModal = async (id: any, amount: any) => {
  projectId.value = id
  if (amount !== 0) {
    bid_amount.value.value = amount
  }
  bidActionsOpen.value = true
}

const bidProject = async () => {
  if (Boolean(projectId.value)) {
    const { valid } = await bid_amount.validate()

    if (valid) {
      isLoadingProjectBidRequest.value = true

      let params = {
        projectId: projectId.value,
        amount: bid_amount.value.value,
      }

      const state = await projectService.saveBid(params)

      if (state.data.status == 'SUCCESS') {
        notif.success({
          message: 'Bid submit successfully',
          duration: 3000,
        })
        isLoadingProjectBidRequest.value = false
        bid_amount.resetField()
        bidActionsOpen.value = false
        render.value = true
      } else {
        notif.error({
          message: 'Bid submit failed',
          duration: 3000,
        })
        isLoadingProjectBidRequest.value = false
        bidActionsOpen.value = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';

.flex-table-cell {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-family: var(--font);
  word-break: keep-all;
  white-space: normal !important;
}

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

    >.v-avatar {
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

    >h3 {
      font-size: 1.1rem;
      font-weight: 600;
      font-family: var(--font-alt);
      color: var(--dark-text);
    }

    >p {
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
  .card-grid-v3 .card-grid-item>h3 {
    font-size: 1rem;
  }
}
</style>
