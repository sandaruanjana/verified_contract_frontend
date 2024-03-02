<template>
  <div v-if="viewProjectActionOpen">
    <ViewProjectModal :isOpen="viewProjectActionOpen" @exit="viewProjectActionOpen = false" :project_id="projectId"
      :bodyData="bodyData" />
  </div>

  <VModal :open="rejectModalOpen" title="" size="small" actions="center" @close="rejectModalOpen = false">
    <template #content>
      <div class="has-text-centered">
        <i class="iconify" style="font-size: 60px" data-icon="feather:alert-circle"></i>
      </div>

      <VPlaceholderSection title="Are you sure!" subtitle="You won't be able to revert this!" />
    </template>
    <template #action>
      <VButton color="danger" raised @click="; (rejectModalOpen = false), (rejectReasonModalOpen = true)">Yes, Reject it!
      </VButton>
    </template>
  </VModal>

  <VModal :open="acceptActionOpen" title="" size="small" actions="center" @close="acceptActionOpen = false">
    <template #content>
      <div class="has-text-centered">
        <i class="iconify" style="font-size: 60px" data-icon="feather:alert-circle"></i>
      </div>

      <VPlaceholderSection title="Are you sure!" subtitle="You won't be able to revert this!" />
    </template>
    <template #action>
      <VButton color="danger" :loading="isLoadingProjectStatusUpdateRequest" raised @click="acceptProject">Yes, accept!
      </VButton>
    </template>
  </VModal>

  <VModal :open="rejectReasonModalOpen" title="Enter your reason" size="small" actions="center"
    @close="; (rejectReasonModalOpen = false), (rejectReason = '')">
    <template #content>
      <VField>
        <VControl>
          <textarea v-model="rejectReason" class="textarea" rows="5" placeholder="Reason"></textarea>
        </VControl>
      </VField>
    </template>
    <template #action>
      <VButton color="danger" :loading="isLoadingProjectRequestReject" raised @click="rejectProject">Submit
      </VButton>
    </template>
  </VModal>

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
              <VFlexTableCell :column="{ align: 'end' }">
                <VPlaceload width="80%" class="mx-1" />
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
            <VButton @click="openAcceptProjectModal(row.id)" color="primary" style="margin-left: 10px">
              Accept</VButton>
            <VButton @click="openRejectProjectModal(row.id)" color="danger" style="margin-left: 10px">
              Reject</VButton>
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
import { ref, computed, reactive } from 'vue'
import type { VFlexTableWrapperDataResolver } from '/@src/components/base/table/VFlexTableWrapper.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import sleep from '/@src/utils/sleep'

const notif = useNotyf()
const projectId = ref('')
const bodyData = ref('')
const rejectReasonModalOpen = ref(false)
const rejectReason = ref('')
const rejectModalOpen = ref(false)
const isLoadingProjectRequestReject = ref(false)
const acceptActionOpen = ref(false)
const isLoadingProjectStatusUpdateRequest = ref(false)
const viewProjectActionOpen = ref(false)

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
  actions: {
    label: 'Action',
    align: 'center',
    grow: true,
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
    status: 'INITIATE',
    render: render.value,
  }

  render.value = false

  const projects = await projectService.getAllAssignByPrivate(params)
  // wait more time
  await sleep(1000)
  // the return of the function must be an array
  return projects.state.data
}

const openViewProjectModal = async (row: any) => {
  projectId.value = row.id
  bodyData.value = row;
  viewProjectActionOpen.value = true
}

const openAcceptProjectModal = async (id: any) => {
  projectId.value = id
  acceptActionOpen.value = true
}

const openRejectProjectModal = async (id: any) => {
  projectId.value = id
  rejectModalOpen.value = true
}

const acceptProject = async () => {
  if (Boolean(projectId.value)) {
    isLoadingProjectStatusUpdateRequest.value = true
    let formData = new FormData()
    formData.append('id', projectId.value)
    formData.append('status', 'ACCEPTED')

    const state = await projectService.updateStatus(formData)

    if (state.data.status == 'SUCCESS') {
      notif.success({
        message: 'Project accepted successfully',
        duration: 3000,
      })
      isLoadingProjectStatusUpdateRequest.value = false
      acceptActionOpen.value = false
      render.value = true
    } else {
      isLoadingProjectStatusUpdateRequest.value = false
      acceptActionOpen.value = false
      notif.error({
        message: 'Something went wrong!',
        duration: 3000,
      })
    }
  }
}

const rejectProject = async () => {
  if (Boolean(projectId.value)) {
    isLoadingProjectRequestReject.value = true
    let formData = new FormData()
    formData.append('id', projectId.value)
    formData.append('status', 'REJECTED')
    formData.append('rejectReason', rejectReason.value)

    const state = await projectService.updateStatus(formData)

    if (state.data.status == 'SUCCESS') {
      notif.success({
        message: 'Project rejected successfully',
        duration: 3000,
      })
      isLoadingProjectRequestReject.value = false
      rejectReasonModalOpen.value = false
      render.value = true
    } else {
      isLoadingProjectRequestReject.value = false
      rejectModalOpen.value = false
      notif.error({
        message: 'Something went wrong!',
        duration: 3000,
      })
    }
  }
}
</script>

<style lang="scss">
.flex-table-cell {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-family: var(--font);
  word-break: keep-all;
  white-space: normal !important;
}
</style>
