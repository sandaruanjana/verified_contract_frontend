<template>
  <div v-if="isError">
    <SomeThingWentWrong />
  </div>
  <form class="form-layout" @submit.prevent>
    <div class="form-outer">
      <div class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left">
            <h3>Private Project</h3>
          </div>
        </div>
      </div>
      <div class="form-body">
        <VLoader v-if="isPageLoading" card="rounded" size="large" :active="isPageLoading">
          <div class="list-view list-view-v1">
            <div class="list-view-inner">
              <TransitionGroup name="list-complete" tag="div">
                <div class="list-view-item">
                  <div class="list-view-item-inner">
                    <div class="meta-left">
                      <h3>Loading ...</h3>
                    </div>
                    <div class="meta-right">
                      <div class="tags">
                        <VTag label="Contractor" color="primary" rounded elevated />
                      </div>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </VLoader>
        <div v-if="!isPageLoading" class="list-view list-view-v1">
          <div class="list-view-inner">
            <TransitionGroup name="list-complete" tag="div">
              <div class="list-view-item">
                <div class="list-view-item-inner">
                  <VAvatar :picture="contractor.profilePicture === null
    ? '/@src/assets/image/profile.png'
    : basic_url +
    '/api/uploads/profile_picture/' +
    contractor.profilePicture
    " size="large" />
                  <div class="meta-left">
                    <h3>{{ contractor.name }}</h3>
                  </div>
                  <div class="meta-right">
                    <div class="tags">
                      <VTag label="Contractor" color="primary" rounded elevated />
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading">
            <h4>Project Info</h4>
            <p>This helps us to know about your project</p>
          </div>

          <form @submit.prevent="handleCreateProject">
            <div class="columns is-multiline">
              <div class="column is-6">
                <Field v-slot="{ field, errorMessage }" name="project_name"><V-Field>
                    <label>Project Name</label>
                    <V-Control icon="feather:briefcase" :has-error="Boolean(errorMessage)">
                      <input v-bind="field" type="text" class="input" placeholder="" autocomplete="given-name" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field></Field>
              </div>
              <div class="column is-6">
                <v-date-picker v-model="date" color="green" trim-weeks>
                  <template #default="{ inputValue, inputEvents }">
                    <V-Field>
                      <label>Prefered Date</label>
                      <V-Control icon="feather:calendar">
                        <input class="input" type="text" placeholder="Select a date" :value="inputValue"
                          v-on="inputEvents" />
                      </V-Control>
                    </V-Field>
                  </template>
                </v-date-picker>
              </div>
              <div class="column is-12">
                <Field v-slot="{ field, errorMessage }" name="address_line_1">
                  <V-Field>
                    <label>Address Line 1</label>
                    <V-Control icon="feather:map-pin" :has-error="Boolean(errorMessage)">
                      <input v-bind="field" type="text" class="input" placeholder="" autocomplete="address-line1"
                        inputmode="text" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field>
              </div>
              <div class="column is-12">
                <Field v-slot="{ field, errorMessage }" name="address_line_2">
                  <V-Field>
                    <label>Address Line 2</label>
                    <V-Control icon="dashicons:location-alt" :has-error="Boolean(errorMessage)">
                      <input v-bind="field" type="text" class="input" placeholder="" autocomplete="address-line2"
                        inputmode="text" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field>
              </div>
              <div class="column is-12">
                <Field v-slot="{ field, errorMessage }" name="project_nature">
                  <V-Field>
                    <label>Project Nature</label>
                    <V-Control icon="feather:file-text" :has-error="Boolean(errorMessage)">
                      <input v-bind="field" type="text" class="input" placeholder="" autocomplete="text"
                        inputmode="text" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field>
              </div>
              <div class="column is-6">
                <Field v-slot="{ field, errorMessage }" name="zip_code">
                  <V-Field>
                    <label>Zip Code</label>
                    <V-Control icon="bx:current-location" :has-error="Boolean(errorMessage)">
                      <input v-bind="field" type="number" class="input" placeholder="" autocomplete="postal-code" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field>
              </div>
              <div class="column is-6">


                <Field v-slot="{ field, errorMessage }" name="selectedCategory">
                  <V-Field>
                    <!-- v-model="selectedCategory"  -->
                    <label>Category</label>
                    <V-Control :has-error="Boolean(errorMessage)">
                      <Multiselect v-model="selectedCategory" :options="categoryOptions" label="name" track-by="name"
                        placeholder="Category" :searchable="true" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field>

                <!-- <Field v-slot="{ field, errorMessage }" name="category">
                  <V-Field>
                    <label>Category</label>
                    <V-Control icon="bx:category" :has-error="Boolean(errorMessage)">
                      <input v-bind="field" type="text" class="input" placeholder="" autocomplete="given-name" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field> -->
              </div>
              <!-- <div class="column is-12-tablet is-6-desktop">
                <div class="mt-4">
                  <V-Field>
                    <label>Sub Category 1</label>
                    <V-Control>
                      <Multiselect
                        v-model="selectedServiceHomeRemodels"
                        :options="serviceHomeRemodelsOptions"
                        label="name"
                        track-by="name"
                        placeholder="Service-Home Remodel"
                        :searchable="true"
                      />
                    </V-Control>
                  </V-Field>
                </div>
              </div> -->
              <!-- <div class="column is-12-tablet is-6-desktop">
                <div class="mt-4">
                  <V-Field>
                    <label>Sub Category 2</label>
                    <V-Control>
                      <Multiselect
                        v-model="selectedEducations"
                        :options="educationOptions"
                        label="name"
                        track-by="name"
                        placeholder="Education"
                        :searchable="true"
                      />
                    </V-Control>
                  </V-Field>
                </div>
              </div> -->
              <!-- <div class="column is-12-tablet is-12-desktop">
                <div class="mt-4">
                  <V-Field>
                    <label>Sub Category 3</label>
                    <V-Control>
                      <Multiselect
                        v-model="selectedArts"
                        :options="artsOptions"
                        label="name"
                        track-by="name"
                        placeholder="Arts"
                        :searchable="true"
                      />
                    </V-Control>
                  </V-Field>
                </div>
              </div> -->

              <div class="column is-12">
                <Field v-slot="{ field, errorMessage }" name="project_value">
                  <V-Field>
                    <label>Project Value</label>
                    <V-Control icon="bx:dollar" :has-error="Boolean(errorMessage)">
                      <input v-bind="field" type="number" class="input" placeholder="" autocomplete="off" />
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field>
              </div>

              <div class="column is-12">
                <Field v-slot="{ field, errorMessage }" name="project_description">
                  <V-Field>
                    <label>Special Instructions</label>
                    <V-Control :has-error="Boolean(errorMessage)">
                      <textarea v-bind="field" class="textarea" rows="4"
                        placeholder="Tell us about any details you'd like us to know..." autocomplete="off"
                        autocapitalize="off" spellcheck="true"></textarea>
                      <p v-if="errorMessage" class="help is-danger">
                        {{ errorMessage }}
                      </p>
                    </V-Control>
                  </V-Field>
                </Field>
              </div>
              <div class="column is-6">
                <VField grouped>
                  <VControl>
                    <div class="file">
                      <label class="file-label">
                        <input :disabled="file_list.length == 5" accept="image/*" class="file-input" type="file"
                          name="resume" @change="onEventFilePicked" />
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                          </span>
                          <span class="file-label"> Choose a image… </span>
                        </span>
                      </label>
                    </div>
                  </VControl>
                </VField>
              </div>
            </div>
            <div v-for="(file, index) in file_list" :key="file.url">
              <div class="columns is-12">
                <div class="column">
                  <img class="img" :src="file.url" alt="base64" />
                </div>
                <div class="column">
                  <V-Field>
                    <label>Description</label>
                    <V-Control>
                      <textarea class="textarea" rows="4" placeholder="Write about any details..." autocomplete="off"
                        autocapitalize="off" spellcheck="true" @change="clearImageDescription"
                        @keypress="onKeyPress($event, index)"></textarea>
                    </V-Control>
                  </V-Field>
                </div>
                <VIconButton color="danger" light raised circle icon="feather:x" @click="removeImage(index)" />
              </div>
            </div>
            <!-- <VCheckbox
              v-model="options"
              value="true"
              label="Action"
              color="primary"
              @click="actionOptionsHandler(true)"
            />
            <VCheckbox
              v-model="options"
              value="false"
              label="Dont action"
              color="primary"
              @click="actionOptionsHandler(false)"
            />
            <VControl raw subcontrol>
              <VCheckbox
                v-model="isRequestQuotation"
                value="true"
                label="Request Quotation"
                color="primary"
              />
            </VControl> -->
            <br />
            <div class="">
              <div class="buttons">
                <V-Button :to="{ name: 'customer' }" light dark-outlined>
                  Cancel
                </V-Button>
                <V-Button :loading="isLoading" type="submit" color="primary" raised>
                  Save
                </V-Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { Field, useForm } from 'vee-validate'
import { useStorage } from '@vueuse/core'
import { useUserSession } from '/@src/stores/userSession'

import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { projectService } from '/@src/service/project-service'
import { userService } from '/@src/service/user-service'
import { skillService } from '/@src/service/skill-service'
import SomeThingWentWrong from '../../../error/SomeThingWentWrong.vue'
import { basic_url } from '/@src/utils/basic_config'
import apiInstance from '/@src/utils/api-client'

const router = useRouter()
const userSession = useUserSession()

const notif = useNotyf()
const contractor_id = ref<any>()
const project_value = ref<any>()

if (!Boolean(router.currentRoute.value.params.id)) {
  router.push({
    name: 'customer-create-project',
  })
}

contractor_id.value = router.currentRoute.value.params.id

let user: any = useStorage('user', [])
const date = ref<any>(new Date())
const customer_id = ref(user.value.id)
const action = ref<any>(true)
const file_list = ref<any>([])
const description_data = ref<string>('')
const mode = ref<string>('Private')
const isLoading = ref(false)
const isPageLoading = ref(true)
const contractor = ref<any>()
const isError = ref(false)
const options = ref(['true'])
const isRequestQuotation = ref(['true'])
const mapbox_api_key = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

//skills
const serviceHomeRemodelsOptions = ref<any>([])
const educationOptions = ref<any>([])
const artsOptions = ref<any>([])

const selectedServiceHomeRemodels = ref<any>([])
const selectedEducations = ref<any>([])
const selectedArts = ref<any>([])

const selectedCategory = ref<any>([])
const categoryOptions = ref<any>([])

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

selectedCategory.value = categoryOptions.value[0]



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
  const contractor_state = await userService.getById(contractor_id.value)
  if (contractor_state.data.status == 'SUCCESS') {
    contractor.value = contractor_state.data.results
    isPageLoading.value = false
  } else {
    isError.value = true
    isPageLoading.value = false
    notif.error('Something went wrong!')
  }
})

// Define a validation schema
const schema = yup.object({
  project_name: yup.string().required('Please enter a project name'),
  address_line_1: yup.string().required('Please enter an address'),
  address_line_2: yup.string().required('Please enter an address'),
  project_nature: yup.string().required('Please enter a project nature'),
  project_description: yup.string().required('Please enter a project description'),
  zip_code: yup
    .string()
    .required('Please enter a zip code')
    .matches(/^\d{5}$/, 'Please enter a valid zip code'),
  // category: yup.string().required('Please enter a category'),
  project_value: yup.string().required('Please enter a project value'),
})

const { resetForm, handleSubmit } = useForm({
  validationSchema: schema,
})

const actionOptionsHandler = (option: any) => {
  options.value = []
  options.value.push(option)
}

const onEventFilePicked = async (event: any) => {
  let base64Image = await getBase64(event.target.files[0])
  file_list.value.push({ url: base64Image, description: '' })
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const clearImageDescription = async () => {
  description_data.value = ''
}

const removeImage = async (index: number) => {
  file_list.value.splice(index, 1)
  clearImageDescription()
}

const onKeyPress = async (e: any, index: any) => {
  description_data.value = description_data.value + e.key
  file_list.value[index].description = description_data.value
}

const handleCreateProject = handleSubmit(async (data: any) => {
  isLoading.value = true

  // if (
  //   selectedServiceHomeRemodels.value.length === 0 ||
  //   selectedEducations.value.length === 0 ||
  //   selectedArts.value.length === 0
  // ) {
  //   notif.warning('Please select categories...')
  //   isLoading.value = false
  //   return
  // }

  if (!Boolean(customer_id.value)) {
    await userSession.logoutUser()
    router.push({
      name: 'auth',
    })
  } else {
    // format date to yyyy-mm-dd-hh-mm-ss
    var year = date.value.getFullYear()
    var month = date.value.getMonth() + 1
    var day = date.value.getDate()
    var formattedDate =
      year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)

    let projectImages: any = []

    for (let i = 0; i < file_list.value.length; i++) {
      projectImages.push({
        name: file_list.value[i].url,
        description: file_list.value[i].description,
      })
    }

    const mapbox_state = await apiInstance.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.zip_code}.json?access_token=${mapbox_api_key}&cachebuster=1629304083461&autocomplete=true&country=us&types=postcode`
    )
    let zipCodeLongitude = mapbox_state.data.features[0].geometry.coordinates[0]
    let zipCodeLatitude = mapbox_state.data.features[0].geometry.coordinates[1]

    let project = {
      assignUserId: contractor_id.value,
      name: data.project_name,
      preferredDate: formattedDate,
      addressLine1: data.address_line_1,
      addressLine2: data.address_line_2,
      nature: data.project_nature,
      zipCode: data.zip_code,
      longitude: zipCodeLongitude,
      latitude: zipCodeLatitude,
      category: selectedCategory.value,
      bidAmount: data.project_value,
      categoryOneId:
        selectedServiceHomeRemodels.value.length === 0
          ? null
          : selectedServiceHomeRemodels.value,
      categoryTwoId:
        selectedEducations.value.length === 0 ? null : selectedEducations.value,
      categoryThreeId: selectedArts.value.length === 0 ? null : selectedArts.value,
      specialInstructions: data.project_description,
      status: 'INITIATE',
      isPublic: 0,
      isAction: options.value[0] ? 1 : 0,
      isRequestQuotation: isRequestQuotation.value[0] ? 1 : 0,
      images: projectImages.length === 0 ? null : projectImages,
    }

    if (Boolean(contractor_id.value) && Boolean(customer_id.value)) {
      const savePublicProjectState = await projectService.save(project)

      if (savePublicProjectState.data.status == 'SUCCESS') {
        notif.success('Project created successfully')
        resetForm()
        selectedServiceHomeRemodels.value = null
        selectedEducations.value = null
        selectedArts.value = null
        file_list.value = []
        options.value = ['true']
        isRequestQuotation.value = ['true']
        isLoading.value = false
      } else {
        isLoading.value = false
        isRequestQuotation.value = ['true']
        notif.error('Something went wrong!')
      }
    } else {
      router.push({
        name: 'customer',
      })
    }
  }
})
</script>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

.is-navbar {
  .form-layout {
    margin-top: 30px;
  }
}

.form-layout {
  max-width: 740px;
  margin: 0 auto;

  .form-outer {
    @include vuero-s-card;

    padding: 0;

    .form-header {
      padding: 12px 20px;
      border-bottom: 1px solid var(--fade-grey-dark-3);
      transition: all 0.3s; // transition-all test

      &.is-stuck {
        background: var(--white);
        padding-right: 80px;
        border-left: 1px solid var(--fade-grey-dark-3);
      }

      .form-header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .left {
        h3 {
          font-family: var(--font-alt);
          font-size: 1.2rem;
          font-weight: 600;
          line-height: 1.3;
        }

        p {
          font-size: 0.95rem;
        }
      }
    }

    .form-body {
      padding: 20px 40px 40px;
    }
  }
}

.is-dark {
  .form-layout {
    .form-outer {
      @include vuero-card--dark;

      .form-header {
        border-color: var(--dark-sidebar-light-12);

        &.is-stuck {
          background: var(--dark-sidebar);
          border-color: var(--dark-sidebar-light-6);
        }

        .left {
          h3 {
            color: var(--dark-dark-text);
          }
        }
      }

      .form-body {
        .field {
          .control {

            .input,
            .textarea {
              &:focus {
                border-color: var(--primary);
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .form-layout {
    .form-outer {
      .form-header {
        .form-header-inner {
          flex-direction: column;

          .left {
            text-align: center;
            margin-bottom: 12px;
          }

          .right {
            width: 100%;

            .buttons {
              display: flex;
              justify-content: space-between;
              margin: 0;

              .button {
                margin: 0;
                width: 49%;
              }
            }
          }
        }
      }
    }
  }
}

.list-view-v1 {
  .list-view-item {
    @include vuero-r-card;

    margin-bottom: 16px;
    padding: 16px;

    .list-view-item-inner {
      display: flex;
      align-items: center;

      .meta-left {
        margin-left: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 600;
          font-size: 1rem;
          line-height: 1;
        }

        >span:not(.tag) {
          font-size: 0.9rem;
          color: var(--light-text);

          svg {
            height: 12px;
            width: 12px;
          }
        }
      }

      .meta-right {
        margin-left: auto;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .tags {
          margin-right: 30px;
          margin-bottom: 0;

          .tag {
            margin-bottom: 0;
          }
        }

        .stats {
          display: flex;
          align-items: center;
          margin-right: 30px;

          .stat {
            display: flex;
            align-items: center;
            flex-direction: column;
            text-align: center;
            color: var(--light-text);

            >span {
              font-family: var(--font);

              &:first-child {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--dark-text);
                line-height: 1.4;
              }

              &:nth-child(2) {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
              }
            }

            svg {
              height: 16px;
              width: 16px;
            }

            i {
              font-size: 1.4rem;
            }
          }

          .separator {
            height: 25px;
            width: 2px;
            border-right: 1px solid var(--fade-grey-dark-3);
            margin: 0 16px;
          }
        }

        .network {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-width: 145px;

          >span {
            font-family: var(--font);
            font-size: 0.9rem;
            color: var(--light-text);
            margin-left: 6px;
          }
        }

        .dropdown {
          margin-left: 30px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v1 {
    .list-view-item {
      @include vuero-card--dark;

      .list-view-item-inner {
        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }
        }

        .meta-right {
          .stats {
            .stat {
              span {
                &:first-child {
                  color: var(--dark-dark-text);
                }
              }
            }

            .separator {
              border-color: var(--dark-sidebar-light-16) !important;
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .list-view-v1 {
    .list-view-item {
      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-left: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-left: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            >span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            right: 0;
            margin-left: 0;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .list-view-v1 {
    display: flex;
    flex-wrap: wrap;

    .list-view-item {
      margin: 10px;
      width: calc(50% - 20px);

      .list-view-item-inner {
        position: relative;
        flex-direction: column;

        .v-avatar {
          margin-bottom: 10px;
        }

        .meta-left {
          margin-left: 0;
        }

        .meta-right {
          flex-direction: column;
          margin-left: 0;

          .tags {
            margin: 10px 0;
          }

          .stats {
            margin: 10px 0;
          }

          .network {
            margin: 10px 0 0;
            justify-content: center;

            >span {
              display: none;
            }
          }

          .dropdown {
            position: absolute;
            top: 0;
            right: 0;
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>
