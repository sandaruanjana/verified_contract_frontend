<template>
  <VModal :open="isOpen" title="Proposal Details" size="large" actions="center" @close="close">
    <template #content>
      <table class="project-details-table">
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{{ bodyData.name }}</td>
          </tr>
          <tr>
            <td>Preferred Date:</td>
            <td>{{ bodyData.preferredDate }}</td>
          </tr>
          <tr>
            <td>Address Line 1:</td>
            <td>{{ bodyData.addressLine1 }}</td>
          </tr>
          <tr>
            <td>Address Line 2:</td>
            <td>{{ bodyData.addressLine2 }}</td>
          </tr>
          <tr>
            <td>Nature:</td>
            <td>{{ bodyData.nature }}</td>
          </tr>
          <tr>
            <td>Zip Code:</td>
            <td>{{ bodyData.zipCode }}</td>
          </tr>
          <tr>
            <td>Longitude:</td>
            <td>{{ bodyData.longitude }}</td>
          </tr>
          <tr>
            <td>Latitude:</td>
            <td>{{ bodyData.latitude }}</td>
          </tr>
          <tr>
            <td>Category:</td>
            <td>{{ bodyData.category }}</td>
          </tr>
          <tr>
            <td>Special Instructions:</td>
            <td>{{ bodyData.specialInstructions }}</td>
          </tr>
          <!-- <tr>
            <td>Is Request Quotation:</td>
            <td>{{ bodyData.isRequestQuotation }}</td>
          </tr> -->
          <tr>
            <td>Proposal Created Time:</td>
            <td>
              <ClientOnly>
                <VDatePicker v-model="bodyData.createdTime" mode="dateTime">
                  <template #default="{ inputValue, inputEvents }">
                    <VField>
                      <VControl icon="feather:calendar">
                        <input :disabled="true" class="input v-input" type="text" :value="inputValue">
                      </VControl>
                    </VField>
                  </template>
                </VDatePicker>
              </ClientOnly>
            </td>
          </tr>
        </tbody>
      </table>

      <VLoader v-if="isDataLoading" card="rounded" size="small" :active="isDataLoading">
        <div class="detail-photo-grid"></div>
      </VLoader>

      <div v-if="!isDataLoading && projectImages.length === 0">
        <VMessage color="danger">There are no photos for this project</VMessage>
      </div>

      <div v-if="!isDataLoading && projectImages.length > 0" class="detail-photo-grid">
        <div v-for="image in projectImages" :key="image.id">
          <img :src="basic_url + '/api/uploads/image/' + image.name" alt="" />
        </div>
      </div>
    </template>
    <template #action> </template>
  </VModal>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { projectService } from '/@src/service/project-service'
import { basic_url } from '/@src/utils/basic_config'

const notif = useNotyf()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  project_id: String,
  bodyData: Object,
})

const emit = defineEmits(['exit'])
const { project_id, bodyData, isOpen } = toRefs(props)
const isDataLoading = ref(true)
const projectImages = ref<any>([])

const fetchProjectGallery = async () => {
  const gallery_state = await projectService.getImageByProjectId(project_id?.value)
  if ((gallery_state.state.error as any) === null) {
    if (gallery_state.state.data.length !== 0) {
      projectImages.value.push(...gallery_state.state.data)
      isDataLoading.value = false
    } else {
      isDataLoading.value = false
    }
  } else {
    isDataLoading.value = false
    notif.error('Something went wrong!')
  }
}

onMounted(async () => {
  await fetchProjectGallery()
})

const close = () => {
  emit('exit', false)
}
</script>

<style lang="scss">
.detail-photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  grid-template-rows: repeat(3, 150px);

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 8px;
    object-position: center;
  }
}

.project-details-table {
  width: 100%;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.project-details-table td {
  padding: 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.project-details-table tr:nth-child(even) {}

.project-details-table th {
  background-color: #f2f2f2;
  padding: 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
  font-weight: bold;
  color: #333;
}

.project-details-table th:first-child,
.project-details-table td:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.project-details-table th:last-child,
.project-details-table td:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>