<template>
  <div class="promotion-page-wrapper">
    <div class="wrapper-outer">
      <div class="wrapper-inner">
        <div class="action-box">
          <div class="box-content">
            <img
              class="light-image is-larger"
              src="/@src/assets/illustrations/placeholders/promotion.svg"
              alt=""
            />
            <img
              class="dark-image is-larger"
              src="/@src/assets/illustrations/placeholders/promotion-dark.svg"
              alt=""
            />
            <h3 class="dark-inverted">
              Empower your team to do greater things collaboratively
            </h3>
            <div class="price mb-2">
              <span class="dark-inverted"> {{ chargedAmount }}</span>
              <span>Per Month</span>
            </div>

            <div class="">
              <VField v-slot="{ id }">
                <VControl>
                  <Multiselect
                    v-model="selectedZipcodeValues"
                    :attrs="{ id }"
                    mode="tags"
                    :searchable="true"
                    :create-tag="true"
                    :options="ZipcodeOptions"
                    placeholder="Add Preferred Zip Codes"
                  />
                </VControl>
              </VField>
            </div>
            <div class="buttons" v-show="!isSubscribed">
              <VButton dark-outlined> Skip</VButton>
              <!--              <RouterLink-->
              <!--                :to="{ name: 'contractor-payment-charge-credit-card' }"-->
              <!--                class="account-menu-item"-->
              <!--              >-->
              <VButton class="account-menu-item" color="primary" raised @click="handleUpgrade"> Upgrade</VButton>
              <!--              </RouterLink>-->
            </div>
            <div class="buttons" v-show="isSubscribed">
              <VButton color="primary" disabled> Subscribed</VButton>
            </div>
          </div>
        </div>
      </div>

      <div class="side-wrapper">
        <div class="side-inner">
          <div class="side-title">
            <h3 class="dark-inverted">Features to make it better</h3>
            <p>Take a look at some incredible features</p>
          </div>

          <div class="action-list">
            <VBlock title="Includes 8 team seats">
              <p>Each team member on your account can create projects and tasks.</p>

              <template #icon>
                <VIconWrap
                  icon="feather:check"
                  dark="3"
                  dark-primary
                  dark-card-bordered
                />
              </template>
            </VBlock>

            <VBlock title="Integrations">
              <p>Add up to 5 addons to your main application to help you manage.</p>

              <template #icon>
                <VIconWrap
                  icon="feather:check"
                  dark="3"
                  dark-primary
                  dark-card-bordered
                />
              </template>
            </VBlock>

            <VBlock title="Scale">
              <p>
                Your application grows in parallel of your business, without any effort.
              </p>

              <template #icon>
                <VIconWrap
                  icon="feather:check"
                  dark="3"
                  dark-primary
                  dark-card-bordered
                />
              </template>
            </VBlock>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {contractorService} from '/@src/service/contractor-service'
import {useNotyf} from "/@src/composable/useNotyf";
import {useStorage} from "@vueuse/core";
import {useRouter} from 'vue-router'

const router = useRouter()
const notif = useNotyf()
let user: any = useStorage('user', [])

const contractorID = ref<string>(user.value.Id)
const isSubscribed = ref(true)
const chargedAmount = ref(5);

const selectedZipcodeValues = ref()
const ZipcodeOptions = ref([])

onMounted(async () => {
  const result = await contractorService.checkIfContractorSubscribed(contractorID.value);
  isSubscribed.value = (result.data as any).Success === true;

  const {data} = await contractorService.getAllUSZips();
  ZipcodeOptions.value = data;
});

watch(selectedZipcodeValues, (newValue, oldValue) => {
  console.log("selected zip codes : ", newValue, oldValue)
  chargedAmount.value = 5 + newValue.length
})


const handleUpgrade = () => {
  console.log("router link worked: ")

  router.push({
    name: 'contractor-payment-charge-credit-card',
    params: {
      chargedAmount: chargedAmount ? chargedAmount.value : 5,
      zipCodesStr: selectedZipcodeValues.value ? selectedZipcodeValues.value.toString() : ""
    }
  })
}

</script>

<style lang="scss" scoped>
@import '../../../../scss/abstracts/_mixins.scss';

.promotion-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 560px;
  margin: 0 auto;
  max-width: 840px;

  .wrapper-outer {
    @include vuero-s-card;

    display: flex;
    padding: 0;

    .wrapper-inner {
      .action-box {
        border: none;
        background: none;
        border-radius: 0;
        border-right: 1px solid var(--fade-grey-dark-3);

        .price {
          text-align: center;
          padding-top: 8px;

          span {
            display: block;
            font-family: var(--font);

            &:first-child {
              font-size: 2.8rem;
              font-weight: 600;
              color: var(--dark-text);
              line-height: 1;

              &::before {
                position: relative;
                top: -12px;
                content: '$';
                font-size: 60%;
              }
            }

            &:nth-child(2) {
              font-size: 0.75rem;
              color: var(--light-text);
              text-transform: uppercase;
            }
          }
        }
      }
    }

    .side-wrapper {
      flex-grow: 2;
      padding: 40px;
      min-width: 40%;

      .side-inner {
        .side-title {
          font-family: var(--font);
          margin-bottom: 16px;

          h3 {
            font-family: var(--font-alt);
            font-weight: 600;
            color: var(--dark-text);
          }

          p {
            font-size: 0.9rem;
          }
        }

        .action-list {
          .media-flex {
            .icon-wrap {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 32px;
              width: 32px;
              min-width: 32px;
              border-radius: var(--radius-rounded);
              background: var(--white);
              border: 1px solid var(--fade-grey-dark-3);
              box-shadow: var(--light-box-shadow);
              color: var(--primary);

              svg {
                width: 16px;
                height: 16px;
                stroke-width: 3px;
              }
            }

            .flex-meta {
              span {
                font-weight: 400;
                font-size: 0.9rem;
              }

              p {
                font-size: 0.9rem;
                max-width: 240px;
              }
            }
          }
        }
      }
    }
  }

  .wrapper-inner {
    .action-box {
      @include vuero-s-card;

      padding: 40px;

      .box-content {
        text-align: center;
        font-family: var(--font);

        img {
          display: block;
          width: 100%;
          max-width: 220px;
          margin: 0 auto 8px;

          &.is-larger {
            max-width: 300px;
          }
        }

        h3 {
          font-size: 1.1rem;
          font-family: var(--font-alt);
          font-weight: 600;
          max-width: 320px;
          margin: 0 auto 8px;

          span {
            color: var(--primary);
          }
        }

        p {
          font-size: 0.9rem;
        }

        .buttons {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          padding-top: 30px;

          .button {
            margin: 0 4px;
            min-width: 180px;
          }
        }
      }
    }
  }
}

.is-dark {
  .promotion-page-wrapper {
    .wrapper-inner {
      .action-box {
        @include vuero-card--dark;
      }
    }

    .wrapper-outer {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (max-width: 767px) {
  .promotion-page-wrapper {
    .wrapper-outer {
      flex-direction: column;

      .wrapper-inner {
        .action-box {
          padding: 20px 20px 40px;
          border-right: none;
          border-bottom: 1px solid var(--fade-grey-dark-3);

          .box-content {
            .buttons {
              .button {
                min-width: 130px;
              }
            }
          }
        }
      }

      .side-wrapper {
        padding: 40px 20px;
      }
    }
  }
}
</style>
