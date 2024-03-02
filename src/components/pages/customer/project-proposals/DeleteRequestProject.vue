<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import type {
  VFlexTableWrapperSortFunction,
  VFlexTableWrapperFilterFunction,
} from '/@src/components/base/table/VFlexTableWrapper.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import ApiResponse from '/@src/utils/api-response-interface'

const notif = useNotyf()

let user: any = useStorage('user', [])
const customer_id = ref(user.value.Id)
const deleted_projects = ref<ApiResponse>()
const selected_project_id = ref('')
const contractorActionOpen = ref(false)

const fetchAllProjectProposals = async () => {
  deleted_projects.value = await projectService.getAllDeleteRequestProjectByCustomerId(
    customer_id.value
  )
}

onMounted(async () => {
  await fetchAllProjectProposals()
})

const selectProject = async (project: any) => {
  selected_project_id.value = project.ProjectId
  contractorActionOpen.value = true
}

const locationSorter: VFlexTableWrapperSortFunction = ({ order, a, b }) => {
  if (order === 'asc') {
    return a.Date.localeCompare(b.Date)
  } else if (order === 'desc') {
    return b.Date.localeCompare(a.Date)
  }
  return 0
}

const userFilter: VFlexTableWrapperFilterFunction = ({ searchTerm, row }) => {
  if (!searchTerm) {
    return true
  }

  return (
    row.Name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    row.Description.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  )
}

const projectWin = async () => {
  contractorActionOpen.value = false
  await fetchAllProjectProposals()
}

const columns = {
  Date: {
    label: 'Date',
    sortable: true,
    sort: locationSorter,
  },
  Name: {
    label: 'Name',
    searchable: true,
  },
  Nature: {
    label: 'Nature',
  },
  Category: {
    label: 'Category',
  },
  Visibility: {
    label: 'Visibility',
  },
  Description: {
    label: 'Description',
    searchable: true,
  },
  Address: {
    label: 'Address',
  },
  Action: 'Action',
} as const
</script>

<template>
  <div v-if="contractorActionOpen">
    <ContractorsTableModal
      :isOpen="contractorActionOpen"
      @exit="contractorActionOpen = false"
      :project_id="selected_project_id"
      @project_win="projectWin"
    />
  </div>

  <VFlexTableWrapper
    v-if="!deleted_projects?.isLoading"
    :columns="columns"
    :data="deleted_projects?.data"
  >
    <template #default="wrapperState">
      <VFlexTableToolbar>
        <template #left>
          <!-- We can bind wrapperState.searchInput to any input -->
          <VField>
            <VControl icon="feather:search">
              <input
                v-model="wrapperState.searchInput"
                type="text"
                class="input is-rounded"
                placeholder="Filter..."
              />
            </VControl>
          </VField>
        </template>

        <template #right>
          <!-- We can also bind wrapperState.limit -->
          <VField>
            <VControl>
              <div class="select is-rounded">
                <select v-model="wrapperState.limit">
                  <option :value="5">5 results per page</option>
                  <option :value="10">10 results per page</option>
                  <option :value="15">15 results per page</option>
                  <option :value="25">25 results per page</option>
                  <option :value="50">50 results per page</option>
                </select>
              </div>
            </VControl>
          </VField>
        </template>
      </VFlexTableToolbar>

      <!--
        The VFlexTable "data" and "columns" props
        will be inherited from parent VFlexTableWrapper
      -->
      <VFlexTable rounded>
        <!-- Custom "name" cell content -->
        <template #body-cell="{ row, column }">
          <template v-if="column.key === 'Address'">
            <span
              :class="[
                column.cellClass,
                column.inverted && 'dark-inverted',
                !column.inverted && (column.bold ? 'dark-text' : 'light-text'),
              ]"
              :title="row.AddressLine1"
            >
              {{ row.AddressLine1 }} {{ row.AddressLine2 }}
            </span>
          </template>
          <template v-if="column.key === 'Action'">
            <VButton @click="selectProject(row)" color="primary"> Select </VButton>
          </template>
        </template>
      </VFlexTable>

      <!-- Table Pagination with wrapperState.page binded-->
      <VFlexPagination
        v-model:current-page="wrapperState.page"
        class="mt-6"
        :item-per-page="wrapperState.limit"
        :total-items="wrapperState.total"
        :max-links-displayed="5"
        no-router
      />
    </template>
  </VFlexTableWrapper>
</template>

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