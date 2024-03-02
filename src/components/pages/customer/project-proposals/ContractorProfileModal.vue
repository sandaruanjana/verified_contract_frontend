<template>
  <VModal :open="isOpen" title="Contractors Profile" size="big" actions="center" @close="close">
    <template #content>
      <VLoader v-if="is_contractor_loading" card="rounded" size="small" :active="is_contractor_loading">
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

      <div v-if="!is_contractor_loading" class="list-view list-view-v1">
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
                  <p>Name : {{ contractor.name }}</p>
                  <p>
                    Address : {{ contractor.addressLine1 }}
                    {{ contractor.addressLine2 }}
                  </p>
                  <p>Phone Number : {{ contractor.telephone }}</p>
                  <p>Email : {{ contractor.email }}</p>
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

      <br />

      <h2 v-if="!is_gallery_loading" class="title is-4">Gallery</h2>

      <VLoader v-if="is_gallery_loading" card="rounded" size="small" :active="is_gallery_loading">
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

      <div v-if="!is_gallery_loading" class="list-view list-view-v1">
        <div class="list-view-item">
          <div v-if="!is_gallery_loading && userImages.length === 0">
            <VMessage color="danger">There are no photos this contractor</VMessage>
          </div>
          <div v-if="!is_gallery_loading && userImages.length > 0" class="detail-photo-grid">
            <div v-for="image in userImages" :key="image.id">
              <img :src="basic_url + '/api/uploads/image/' + image.name" alt="" />
            </div>
          </div>
        </div>
      </div>

      <br />

      <!-- <VLoader v-if="is_feedback_loading" card="rounded" size="small" :active="is_feedback_loading">
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
      </VLoader> -->

      <!-- <div v-if="!is_feedback_loading">
        <h2 class="title is-4 is-narrow is-thin">Contractor Rating</h2>
        <VueStarRating v-model:rating="rating" :increment="0.1" :read-only="true" :show-rating="true" :star-size="30" />
      </div>

      <br /> -->

      <!-- <VLoader v-if="is_feedback_loading" card="rounded" size="small" :active="is_feedback_loading">
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
      </VLoader> -->
      <!-- 
      <div v-if="!is_feedback_loading">
        <h2 class="title is-4 is-narrow is-thin">Feedback</h2>
        <br />
        <div v-for="feed in feedback?.data" :key="feed.Name" class="list-view list-view-v1">
          <div v-if="feed.Rate !== 0">
            <div class="list-view-inner">
              <TransitionGroup name="list-complete" tag="div">
                <div class="list-view-item">
                  <div class="list-view-item-inner">
                    <VAvatar :picture="contractor?.data[0].Image" size="large" />
                    <div class="meta-left">
                      <p>{{ feed?.Name }}</p>
                      <VueStarRating v-model:rating="feed.Rate" :increment="0.1" :read-only="true" :show-rating="true"
                        :star-size="15" />
                      <p>{{ feed.Comment }}</p>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </div> -->
    </template>
  </VModal>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { contractorService } from '/@src/service/contractor-service'
import { userService } from '/@src/service/user-service'
import { galleryService } from '/@src/service/gallery-service'
import ApiResponse from '/@src/utils/api-response-interface'
//@ts-ignore
import VueStarRating from 'vue-star-rating'
import { basic_url } from '/@src/utils/basic_config'

const notif = useNotyf()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  contractor_id: String,
})

const emit = defineEmits(['exit'])

const { contractor_id, isOpen } = toRefs(props)
const contractor = ref<any>()
const userImages = ref<any>([])
let gallery = ref<ApiResponse>()
let feedback = ref<ApiResponse>()

const is_contractor_loading = ref(true)
const is_contractor_error = ref(false)

const is_gallery_loading = ref(true)
const is_gallery__error = ref(false)

const is_feedback_loading = ref(true)
const is_feedback__error = ref(false)
const rating = ref()
const rates = ref([] as any)

const fetchContractor = async () => {
  const contractor_state = await userService.getById(contractor_id?.value)
  if (contractor_state.data.status == 'SUCCESS') {
    contractor.value = contractor_state.data.results
    is_contractor_loading.value = false
  } else {
    is_contractor_error.value = true
    is_contractor_loading.value = false
    notif.error('Something went wrong!')
  }
}

const fetchGallery = async () => {
  let params = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    userId: contractor_id?.value,
    isPublic: 1,
  }

  const user_gallery_state = await galleryService.get(params)
  if ((user_gallery_state.state.error as any) === null) {
    userImages.value = []
    userImages.value = user_gallery_state.state.data
    is_gallery_loading.value = false
  } else {
    is_gallery__error.value = true
    is_gallery_loading.value = false
    notif.error('Something went wrong!')
  }
}

const fetchFeedback = async () => {
  const state = await contractorService.getAllFeedbackByContractorId(contractor_id?.value)
  if ((state.error as any) === null) {
    feedback.value = state

    if (feedback.value?.data !== 'null') {
      for (let i = 0; i < feedback.value?.data.length; i++) {
        if (feedback.value?.data[i].Rate !== 0) {
          rating.value = feedback.value?.data[i].Rate
        }
      }
    }

    is_feedback_loading.value = false
  } else {
    is_feedback__error.value = true
    is_feedback_loading.value = false
    notif.error(state.error)
  }
}

onMounted(async () => {
  await Promise.all([fetchContractor(), fetchGallery()])
})

const close = () => {
  emit('exit', false)
}
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

.detail-photo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
</style>