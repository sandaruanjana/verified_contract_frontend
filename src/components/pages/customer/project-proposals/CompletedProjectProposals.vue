<template>
    <div v-if="viewProjectActionOpen">
        <ViewProjectModal :isOpen="viewProjectActionOpen" @exit="viewProjectActionOpen = false" :project_id="projectId"
            :bodyData="bodyData" />
    </div>

    <div v-if="is_contractor_prfile_open">
        <ContractorProfileModal :isOpen="is_contractor_prfile_open" @exit="is_contractor_prfile_open = false"
            :contractor_id="contractor_id_for_view_profile" />
    </div>

    <div v-if="openContractorRateModalOpen">
        <VModal :open="openContractorRateModalOpen" size="large" actions="center"
            @close="openContractorRateModalOpen = false" title="Contractor">
            <template #content>


                <VCardAction :avatar="contractor_profile_image" :title="contractor.name" subtitle="Contractor">
                    <template #action>
                        <VButton @click="
                    ; (is_contractor_prfile_open = true), (contractor_id_for_view_profile = contractor.id)
        " color="primary" raised>View Profile</VButton>
                    </template>
                    <p>
                    <ul>
                        <li>Email: {{ contractor.email }}</li>
                        <li>Phone: {{ contractor.telephone }}</li>
                    </ul>
                    </p>
                </VCardAction>

                <h3 class="title is-4 is-narrow is-thin" style=" margin-top: 2.5vh; ">Feedback</h3>

                <VueStarRating @update:rating="ratingContractor" v-model:rating="rating" :increment="0.1"
                    :read-only="false" :show-rating="true" :star-size="30" style=" margin-top: 1.5vh; " />

                <div class="field" style=" margin-top: 2.5vh; ">
                    <label>Comment</label>
                    <div class="control">
                        <VField>
                            <VControl>
                                <textarea v-model="comment" style=" margin-top: 1.0vh; " class="textarea" rows="4"
                                    placeholder="Your comment..."> </textarea>
                            </VControl>
                        </VField>

                    </div>
                </div>

            </template>

            <template #action>
                <VButton @click="ratingContractor" color="primary" raised>
                    Save Changes
                </VButton>
            </template>
        </VModal>
    </div>


    <AllContractorsBidModal :isOpen="is_project_has_proposal" @exit="bidModalExit" :proposal_id="selected_proposal_id"
        @project_win="; (is_project_has_proposal = false), (render = true)" />

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
                                <input v-model="wrapperState.searchInput" type="text" class="input is-rounded"
                                    placeholder="Filter..." />
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
                        <VPlaceholderSection title="No matches" subtitle="There is no data that match your query."
                            class="my-6">
                            <template #image>
                                <img class="light-image" src="/@src/assets/illustrations/placeholders/search-4.svg"
                                    alt="" />
                                <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                                    alt="" />
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
                        <VButton color="primary" @click="viewProposal(row)"> View </VButton>
                        <VButton color="warning" @click="openContractorRateModal(row)" style="margin-left: 15px">
                            Feedback
                        </VButton>
                    </template>

                    <template v-if="column.key === 'actions'">

                    </template>
                </template>
            </VFlexTable>

            <!--Table Pagination-->
            <VFlexPagination v-model:current-page="wrapperState.page" class="mt-5" :item-per-page="wrapperState.limit"
                :total-items="wrapperState.total" :max-links-displayed="2" no-router />
        </template>
    </VFlexTableWrapper>


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
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import type { VFlexTableWrapperDataResolver } from '/@src/components/base/table/VFlexTableWrapper.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import sleep from '/@src/utils/sleep'
import VTag from '/@src/components/base/tags/VTag.vue'
//@ts-ignore
import VueStarRating from 'vue-star-rating'
import ApiResponse from '/@src/utils/api-response-interface'
import { userService } from '/@src/service/user-service'
import { basic_url } from '/@src/utils/basic_config'


const notif = useNotyf()

let user: any = useStorage('user', [])
const customer_id = ref(user.value.id)
const is_project_has_proposal = ref(false)
const selected_proposal_id = ref('')

const filters = ref('')
const pageQuery = ref(1)
const limitQuery = ref(10)
const total = ref(0)
const sortQuery = ref('')
const render = ref(false)

const viewProjectActionOpen = ref(false)
const projectId = ref('')
const bodyData = ref<Object>()

const deleteConfirmationModalOpen = ref(false);
const openContractorRateModalOpen = ref(false);

const isLoadingDeleteProposal = ref(false);

let feedback = ref<ApiResponse>()
// const rating = ref()
const rates = ref([] as any)
const rating = ref<number>(1);
const is_feedback_loading = ref(true)
const contractor = ref<any>()
const is_contractor_loading = ref(true)
const is_contractor_error = ref(false)
const comment = ref("")

const is_contractor_prfile_open = ref(false)
const contractor_id_for_view_profile = ref('')

const contractor_profile_image = ref<string>(
    user.value.profilePicture === null
        ? '/@src/assets/image/profile.png'
        : basic_url + '/api/uploads/profile_picture/' + contractor.value.profilePicture
)


const openContractorRateModal = (row: any) => {
    contractor.value = "";
    selected_proposal_id.value = "";
    comment.value = "";
    rating.value = 0
    selected_proposal_id.value = row.id;
    fetchContractor(row.assignUserId)
    getContractorRating();
    openContractorRateModalOpen.value = true
};

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
    status: {
        label: 'Status',
        // we can use custom render function for each rows
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.status === 'COMPLETED'
                            ? 'success'
                            : row.status === 'IN_PROGRESS'
                                ? 'info'
                                : row.status === 'Suspended'
                                    ? 'orange'
                                    : undefined,
                },
                // this notation is to render content in the default slot
                {
                    default() {
                        return `${row.status}`
                    },
                },
            ),
    },
    // status: {
    //     label: 'Status',
    //     grow: true,
    // },
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
        status: 'COMPLETED',
        render: render.value,
    }

    render.value = false

    const projects = await projectService.getAllAssigneeByStatus(params)
    // wait more time
    await sleep(1000)
    // the return of the function must be an array
    return projects.state.data
}

const viewProposal = async (row: any) => {
    projectId.value = row.id
    bodyData.value = row
    viewProjectActionOpen.value = true
}

const getContractorRating = async () => {

    const json = {
        projectId: selected_proposal_id.value,
    }

    var response = await projectService.getContractorRating(json)
    if (response.state.data.status === "SUCCESS") {
        rating.value = response.state.data.results.rate
        comment.value = response.state.data.results.comment
    } else if (response.state.data.results === null) {
        notif.warning("Please rate contractor")
    } else {
        notif.error("Get Contractor Rating Failed")
    }

}

const ratingContractor = async (new_rate: any) => {
    const json = {
        projectId: selected_proposal_id.value,
        revieweeUserId: contractor.value.id,
        rate: new_rate.isTrusted === true ? rating.value : new_rate,
        comment: comment.value,
    }

    var response = await projectService.ratingContractor(json)

    if (response.data.status === "SUCCESS") {

        if (new_rate.isTrusted === true) {
            notif.success("Feedback Submitted Successfully")
            openContractorRateModalOpen.value = false
        } else {
            notif.success("Rating Added Successfully")

        }

    } else {
        notif.error("Rating Added Failed")
    }

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

const bidModalExit = async () => {
    is_project_has_proposal.value = false
}


const fetchContractor = async (contractor_id: any) => {
    const contractor_state = await userService.getById(contractor_id)
    if (contractor_state.data.status == 'SUCCESS') {
        contractor.value = contractor_state.data.results
        is_contractor_loading.value = false
    } else {
        is_contractor_error.value = true
        is_contractor_loading.value = false
        notif.error('Something went wrong!')
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