<template>
  <div v-if="is_contractor_prfile_open">
    <ContractorProfileModal
      :isOpen="is_contractor_prfile_open"
      @exit="is_contractor_prfile_open = false"
      :contractor_id="contractor_id"
    />
  </div>

  <VModal
    title="Contractors Bids"
    :open="isOpen"
    size="big"
    actions="center"
    @close="close"
  >
    <template #content>
      <VModal
        :open="confrim_contractor_open"
        title="Confirm Contractor"
        size="small"
        actions="center"
        @close="confrim_contractor_open = false"
      >
        <template #content>
          <div class="has-text-centered">
            <i
              class="iconify"
              style="font-size: 60px"
              data-icon="feather:alert-circle"
            ></i>
          </div>

          <VPlaceholderSection
            title="Are you sure!"
            subtitle="You won't be able to revert this!"
          />
        </template>
        <template #action>
          <VButton color="danger" :loading="is_confirm" raised @click="win_project"
            >Yes, Confirm!</VButton
          >
        </template>
      </VModal>

      <VFlexTableWrapper
        v-model:page="queryParam.page"
        v-model:limit="queryParam.limit"
        v-model:searchTerm="queryParam.searchTerm"
        v-model:sort="queryParam.sort"
        :columns="columns"
        :data="fetchData"
        :total="total"
        class="mt-4"
      >
        <!--
      Here we retrieve the internal wrapperState.
      Note that we can not destructure it
    -->
        <template #default="wrapperState">
          <!--Table Pagination-->
          <VFlexPagination
            v-model:current-page="wrapperState.page"
            :item-per-page="wrapperState.limit"
            :total-items="wrapperState.total"
            :max-links-displayed="2"
            no-router
          >
            <!-- The controls can be updated anywhere in the slot -->
            <template #before-pagination>
              <VFlex class="mr-4">
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
              </VFlex>
            </template>

            <template #before-navigation>
              <VFlex class="mr-4">
                <VField>
                  <VControl>
                    <div class="select is-rounded">
                      <select v-model="wrapperState.limit">
                        <option :value="1">1 results per page</option>
                        <option :value="5">5 results per page</option>
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
                <VPlaceholderSection
                  title="No matches"
                  subtitle="There is no data that match your query."
                  class="my-6"
                >
                </VPlaceholderSection>
              </div>
            </template>

            <!-- This is the body cell slot -->
            <template #body-cell="{ row, column }">
              <template v-if="column.key === 'address'">
                <span
                  :class="[
                    column.cellClass,
                    column.inverted && 'dark-inverted',
                    !column.inverted && (column.bold ? 'dark-text' : 'light-text'),
                  ]"
                  :title="row.AddressLine1"
                >
                  {{ row.addressLine1 }}, {{ row.addressLine2 }}
                </span>
              </template>
              <template v-if="column.key === 'actions'">
                <VButton
                  @click="
                    ;(is_contractor_prfile_open = true), (contractor_id = row.userId)
                  "
                >
                  View Profile
                </VButton>
                <VButton
                  @click="
                    ;(confrim_contractor_open = true),
                      (proposal_id = row.projectId),
                      (contractor_id = row.userId)
                  "
                  color="primary"
                  style="margin-left: 15px"
                >
                  Accept
                </VButton>
              </template>
            </template>
          </VFlexTable>

          <!--Table Pagination-->
          <VFlexPagination
            v-model:current-page="wrapperState.page"
            class="mt-5"
            :item-per-page="wrapperState.limit"
            :total-items="wrapperState.total"
            :max-links-displayed="2"
            no-router
          />
        </template>
      </VFlexTableWrapper>
    </template>
    <template #action> </template>
  </VModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRefs } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import { VFlexTableWrapperDataResolver } from '/@src/components/base/table/VFlexTableWrapper.vue'
import sleep from '/@src/utils/sleep'

const notif = useNotyf()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  proposal_id: String,
})

const emit = defineEmits(['exit', 'project_win'])

const { proposal_id, isOpen } = toRefs(props)
const confrim_contractor_open = ref(false)
const contractor_id = ref('')
const is_confirm = ref(false)
const is_contractor_prfile_open = ref(false)

const filters = ref('')
const pageQuery = ref(1)
const limitQuery = ref(5)
const total = ref(0)
const sortQuery = ref('')
const render = ref(false)

// we don't have to set "searchable" parameter
// this will be handled by the fetchData function
const columns = {
  userName: {
    label: 'Name',
    grow: true,
    sortable: true,
  },
  userTelephone: {
    label: 'Telephone',
    grow: true,
    sortable: false,
  },
  amount: {
    label: 'Bid Amount',
    grow: true,
    sortable: false,
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
    projectId: proposal_id?.value,
    render: render.value,
    isOpen: isOpen.value,
  }

  render.value = false

  const projectBids = await projectService.getAllBids(params)
  // wait more time
  await sleep(1000)
  // the return of the function must be an array
  return projectBids.state.data
}

const win_project = async () => {
  if (Boolean(contractor_id.value) && Boolean(proposal_id?.value)) {
    is_confirm.value = true
    let formData = new FormData()
    //@ts-ignore
    formData.append('id', proposal_id?.value)
    formData.append('status', 'ACCEPTED')
    formData.append('userId', contractor_id.value)

    const state = await projectService.updateStatusAndAssignUser(formData)

    if (state.data.status == 'SUCCESS') {
      notif.success('Contractor has been confirmed')
      is_confirm.value = false
      confrim_contractor_open.value = false
      render.value = true
      emit('project_win', true)
    } else {
      is_confirm.value = false
      notif.error('Something went wrong!')
    }
  }
}

const close = () => {
  emit('exit', false)
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