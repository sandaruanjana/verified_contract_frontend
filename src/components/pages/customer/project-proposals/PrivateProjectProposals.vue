<template>
  <div v-if="contractorActionOpen">
    <ContractorsTableModal :isOpen="contractorActionOpen" @exit="contractorActionOpen = false"
      :project_id="selected_proposal_id" @project_win="projectWin" />
  </div>

  <VModal :open="rejectReasonModalOpen" title="Rejected reason" size="small" actions="center"
    @close="; (rejectReasonModalOpen = false), (rejectReason = '')">
    <template #content>
      <VField>
        <VControl>
          <textarea v-model="rejectReason" class="textarea" rows="5" placeholder="Reason" readonly></textarea>
        </VControl>
      </VField>
    </template>
    <template #action> </template>
  </VModal>

  <VModal :open="deleteConfirmationModalOpen" title="Confirmation" size="small" actions="center"
    @close="handleDeleteConfirmationModalClose">
    <template #content>
      <div class="has-text-centered">
        <i class="iconify" style="font-size: 60px" data-icon="feather:alert-circle"></i>
      </div>
      <VPlaceholderSection title="Are you sure you want to delete?" subtitle="This action cannot be undone." />
    </template>
    <template #action>
      <VButton color="danger" raised @click="confirmDeleteProposal" :loading="isLoadingDeleteProposal">
        Yes, Delete!
      </VButton>
    </template>
  </VModal>

  <div class="task-grid">
    <div class="grid-header">
      <h3>Rejected Projects</h3>
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
                <VFlexTableCell>
                  <VPlaceload width="60%" class="mx-1" />
                </VFlexTableCell>
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
            <VButton @click="; (rejectReason = row.rejectReason), (rejectReasonModalOpen = true)">
              Reason
            </VButton>
            <VButton @click="selectProject(row.id)" color="primary" style="margin-left: 15px">
              Select
            </VButton>
            <VButton color="danger" @click="openDeleteConfirmationModal(row.id)" style="margin-left: 15px">
              DELETE
            </VButton>
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
import { computed, reactive, ref } from 'vue'
import type { VFlexTableWrapperDataResolver } from '/@src/components/base/table/VFlexTableWrapper.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import sleep from '/@src/utils/sleep'

const notif = useNotyf()

let user: any = useStorage('user', [])
const is_project_has_proposal = ref(false)
const selected_proposal_id = ref('')
const selected_project_id = ref('')
const contractorActionOpen = ref(false)
const rejectReasonModalOpen = ref(false)
const rejectReason = ref('')

const filters = ref('')
const pageQuery = ref(1)
const limitQuery = ref(10)
const total = ref(0)
const sortQuery = ref('')
const render = ref(false)

const deleteConfirmationModalOpen = ref(false);
const isLoadingDeleteProposal = ref(false);

const openDeleteConfirmationModal = (proposal_id: any) => {
  selected_proposal_id.value = proposal_id;
  deleteConfirmationModalOpen.value = true;
};

const handleDeleteConfirmationModalClose = () => {
  deleteConfirmationModalOpen.value = false;
};

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
  nature: {
    label: 'Nature',
    grow: true,
    sortable: false,
  },
  category: {
    label: 'Category',
    grow: true,
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
    status: 'REJECTED',
    render: render.value,
  }

  render.value = false

  const projects = await projectService.getAllAssigneeByStatus(params)
  // wait more time
  await sleep(1000)
  // the return of the function must be an array
  return projects.state.data
}

const projectWin = async () => {
  contractorActionOpen.value = false
  render.value = true
}

const selectProject = async (id: any) => {
  selected_proposal_id.value = id
  contractorActionOpen.value = true
}

const bidModalExit = async () => {
  is_project_has_proposal.value = false
}


const confirmDeleteProposal = async () => {
  deleteConfirmationModalOpen.value = false;
  isLoadingDeleteProposal.value = true;

  // Perform the delete operation
  const response = await projectService.deleteProjectById(selected_proposal_id.value);

  if (response.data.results === true) {
    notif.success("Proposal Deleted Successfully");
    render.value = true;
  } else {
    notif.error("Proposal Deletion Failed");
    render.value = true;
  }

  isLoadingDeleteProposal.value = false;
};

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