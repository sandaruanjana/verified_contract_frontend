<template>
  <VModal
    :open="deleteImageModalOpen"
    title=""
    size="small"
    actions="center"
    @close="deleteImageModalOpen = false"
  >
    <template #content>
      <div class="has-text-centered">
        <i class="iconify" style="font-size: 60px" data-icon="feather:alert-circle"></i>
      </div>

      <VPlaceholderSection
        title="Are you sure!"
        subtitle="You won't be able to revert this!"
      />
    </template>
    <template #action>
      <VButton
        :loading="isImageDeleting"
        color="danger"
        raised
        @click="deleteSelectedImage"
        >Yes, delete it!</VButton
      >
    </template>
  </VModal>

  <VModal
    :open="uploadImageModalOpen"
    title="Upload Public Image"
    actions="center"
    size="small"
    @close=";(uploadImageModalOpen = false), ((previewImage = ''), (selectImage = ''))"
  >
    <template #content>
      <VControl>
        <div class="file">
          <label class="file-label">
            <input
              class="file-input"
              accept="image/*"
              type="file"
              name="resume"
              @change="onEventFilePicked"
            />
            <span class="file-cta">
              <span class="file-icon">
                <i aria-hidden="true" class="fas fa-cloud-upload-alt"></i>
              </span>
              <span class="file-label"> Choose a file… </span>
            </span>
          </label>
        </div>
      </VControl>
      <br />
      <div class="has-text-centered">
        <div class="upload-demo-wrap">
          <img v-if="previewImage" class="img" :src="previewImage" alt="base64" />
          <br />

          <VField v-if="selectImage">
            <VControl>
              <textarea
                v-model="image_description.value.value"
                class="textarea"
                rows="4"
                placeholder="Enter image description..."
              ></textarea>
              <p
                v-if="image_description.errorMessage"
                style="font-size: 15px"
                class="help is-danger"
              >
                {{ image_description.errorMessage }}
              </p>
            </VControl>
          </VField>
        </div>
      </div>
    </template>
    <template #cancel><wbr /></template>
    <template #action>
      <VField grouped>
        <VControl>
          <VButton
            class="upload-result"
            size="big"
            :loading="isImageUploading"
            :disabled="!selectImage && !image_description.value.value"
            outlined
            @click="uploadImage"
          >
            Confirm
          </VButton>
        </VControl>
      </VField>
    </template>
  </VModal>

  <div>
    <div class="user-grid-toolbar">
      <VControl icon="feather:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
          @input="filter"
        />
      </VControl>

      <div class="buttons">
        <VButton color="primary" raised @click="uploadImageModalOpen = true">
          <span class="icon">
            <i aria-hidden="true" class="fas fa-upload"></i>
          </span>
          <span>Upload Image</span>
        </VButton>
      </div>
    </div>

    <div v-if="isError" class="error-container">
      <SomeThingWentWrong />
    </div>

    <div class="user-grid user-grid-v1">
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
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>

      <TransitionGroup name="list" tag="div" class="columns is-multiline">
        <!--Grid item-->
        <div v-for="item in userImages" :key="item.id" class="column is-3">
          <div class="card v-card">
            <div v-if="item.name" class="card-image">
              <figure class="image is-16by9">
                <img :src="basic_url + '/api/uploads/image/' + item.name" alt="" />
              </figure>
            </div>
            <div class="card-content">
              <div class="inner-content pt-5">{{ item.description }}</div>
              <br />
              <div class="card-footer">
                <div class="card-footer-item">
                  <div class="buttons">
                    <div class="center-button">
                      <VButton
                        class="is-danger"
                        icon="feather:trash"
                        icon-right
                        @click="setSelectedImage(item.id)"
                      >
                        Delete
                      </VButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isDataLoading" v-for="key in 20" :key="key" class="column is-3">
          <div class="grid-item">
            <VPlaceloadAvatar size="big" centered class="mb-2" />

            <VPlaceloadText
              class="mb-4"
              width="80%"
              :lines="3"
              last-line-width="60%"
              centered
            />

            <div class="people">
              <VPlaceloadAvatar size="small" class="mx-1" />
              <VPlaceloadAvatar size="small" class="mx-1" />
              <VPlaceloadAvatar size="small" class="mx-1" />
              <VPlaceloadAvatar size="small" class="mx-1" />
            </div>

            <VButtons>
              <VButton placeload="100%" dark-outlined>loading ...</VButton>
              <VButton placeload="100%" dark-outlined>loading ...</VButton>
            </VButtons>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useNotyf } from '/@src/composable/useNotyf'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { galleryService } from '/@src/service/gallery-service'
import { useField } from 'vee-validate'
import { basic_url } from '/@src/utils/basic_config'
import * as yup from 'yup'

const notif = useNotyf()
const router = useRouter()

const filters = ref('')
const isDataLoading = ref(true)
const isError = ref(false)

let user: any = useStorage('user', [])

const deleteImageModalOpen = ref(false)
const uploadImageModalOpen = ref(false)

const selectImage = ref()
const previewImage = ref()

const selectedImageId = ref('')
const isImageUploading = ref(false)
const isImageDeleting = ref(false)

const userImages = ref<any>([])
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
    let element = document.querySelector('.user-grid-v1')
    if (element!.getBoundingClientRect().bottom < window.innerHeight) {
      if (userImages.value.length < total.value) {
        page.value++
        isDataLoading.value = true

        let params = {
          page: page.value,
          pageSize: limit.value,
          searchTerm: filters.value,
          userId: user.value.id,
          isPublic: 0,
        }

        const user_gallery_state = await galleryService.get(params)
        if ((user_gallery_state.state.error as any) === null) {
          if (user_gallery_state.state.data.length !== 0) {
            //delay for 1 second
            await new Promise((resolve) => setTimeout(resolve, 1000))
            userImages.value.push(...user_gallery_state.state.data)
            total.value = user_gallery_state.state.total
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

const filter = async () => {
  await fetchGalleryImages()
}

const fetchGalleryImages = async () => {
  let params = {
    page: page.value,
    pageSize: limit.value,
    searchTerm: filters.value,
    userId: user.value.id,
    isPublic: 1,
  }

  const user_gallery_state = await galleryService.get(params)
  if ((user_gallery_state.state.error as any) === null) {
    userImages.value = []
    page.value = 1
    userImages.value = user_gallery_state.state.data
    total.value = user_gallery_state.state.total
    isDataLoading.value = false
  } else {
    isError.value = true
    isDataLoading.value = false
    notif.error('Something went wrong!')
  }
}

onMounted(async () => {
  await fetchGalleryImages()
})

const image_description: any = useField(
  'image_description',
  yup.string().required('Please enter a image description')
)

const uploadImage = async () => {
  const { valid } = await image_description.validate()

  if (previewImage.value.length > 5242880) {
    notif.error('Image size should be less than 5MB')
    return
  }

  if (valid && previewImage.value && previewImage.value !== '') {
    isImageUploading.value = true

    let formData = new FormData()
    formData.append('imageFile', selectImage.value)
    formData.append('userId', user.value.id)
    formData.append('description', image_description.value.value)
    formData.append('isPublic', '1')

    let upload_image_state = await galleryService.upload(formData)

    if (upload_image_state.state.data.status == 'SUCCESS') {
      notif.success('Image has been uploaded successfully')
      isImageUploading.value = false
      uploadImageModalOpen.value = false
      previewImage.value = ''
      selectImage.value = ''
      image_description.resetField()
      await fetchGalleryImages()
    } else {
      isImageUploading.value = false
      uploadImageModalOpen.value = false
      previewImage.value = ''
      selectImage.value = ''
      image_description.resetField()
      notif.error('Something went wrong!')
    }
  }
}

const onEventFilePicked = async (event: any) => {
  let base64Image = await getBase64(event.target.files[0])
  previewImage.value = base64Image
  selectImage.value = event.target.files[0]
}

const setSelectedImage = (id: any) => {
  selectedImageId.value = id
  deleteImageModalOpen.value = true
}

const deleteSelectedImage = async () => {
  isImageDeleting.value = true

  if (Boolean(selectedImageId.value)) {
    const deleteImageState = await galleryService.delete(selectedImageId.value)

    if (deleteImageState.state.data.status == 'SUCCESS') {
      isImageDeleting.value = false
      deleteImageModalOpen.value = false
      notif.success('Image has been deleted successfully')
      await fetchGalleryImages()
    } else {
      isImageDeleting.value = false
      deleteImageModalOpen.value = false
      notif.error('Something went wrong!')
    }
  } else {
    router.push({
      name: 'contractor',
    })
  }
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
</script>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

.is-dark {
  .user-grid {
    .grid-item {
      @include vuero-card--dark;
    }
  }
}

.user-grid-v1 {
  .columns {
    margin-left: -0.5rem !important;
    margin-right: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }

  .grid-item {
    @include vuero-s-card;

    text-align: center;

    > .v-avatar {
      display: block;
      margin: 0 auto 4px;
    }

    h3 {
      font-family: var(--font-alt);
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--dark-text);
    }

    p {
      font-size: 0.85rem;
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

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .user-grid-v1 {
    .columns {
      display: flex;

      .column {
        min-width: 50% !important;
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .user-grid-v1 {
    .columns {
      .column {
        min-width: 33.3% !important;
      }
    }
  }
}
</style>
