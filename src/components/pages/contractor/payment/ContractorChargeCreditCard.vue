<template>
  <div>
    <div class="saas-billing-wrapper">
      <div class="billing-options-wrapper">
        <div class="right">
          <div class="payment-form">
            <div class="form-header">
              <h3>Payment information</h3>
              <!--              <span tabindex="0" @keydown.space.prevent="randomCard" @click="randomCard">-->
              <!--              Randomize-->
              <!--            </span>-->
            </div>

            <VCreditCard
              :color="creditcardColor"
              :flipped="isCardFlipped"
              :name="creditcardInput.name"
              :number="creditcardInput.number"
              :cvc="creditcardInput.cvc"
              :expiry="creditcardInput.expiry"
              @flip="isCardFlipped = !isCardFlipped"
            >
              <!-- eslint-disable vue/no-v-html -->
              <div v-if="creditcardLogo" id="ccsingle" v-html="creditcardLogo"></div>
              <!-- eslint-enable vue/no-v-html -->
            </VCreditCard>

            <div class="form-container">
              <div class="columns is-multiline">
                <div class="column is-12">
                  <VField>
                    <label for="name">Name</label>
                    <VControl>
                      <input
                        id="name"
                        v-model="creditcardInput.name"
                        autocomplete="cc-given-name"
                        class="input"
                        maxlength="20"
                        type="text"
                        placeholder="The name on the card"
                        @focus="isCardFlipped = false"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-12">
                  <VField>
                    <label for="cardnumber">Card Number</label>
                    <VControl>
                      <VIMaskInput
                        id="cardnumber"
                        v-model="creditcardInput.number"
                        autocomplete="cc-number"
                        class="input"
                        :options="creditcardMaskNumber"
                        placeholder="Credit card number"
                        @focus="isCardFlipped = false"
                        @accept="creditcardMaskNumberOnAccept"
                      />
                      <!-- eslint-disable vue/no-v-html -->
                      <div
                        id="creditcardIcon"
                        class="creditcardIcon"
                        v-html="creditcardIcon"
                      ></div>
                      <!-- eslint-enable vue/no-v-html -->
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <label for="expirationdate">Expiration</label>
                    <VControl>
                      <VIMaskInput
                        id="expirationdate"
                        v-model="creditcardInput.expiry"
                        autocomplete="cc-exp"
                        class="input"
                        :options="creditcardMaskDate"
                        placeholder="MM / YY"
                        @focus="isCardFlipped = false"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-6">
                  <VField>
                    <label for="securitycode">CVC</label>
                    <VControl>
                      <VIMaskInput
                        id="securitycode"
                        v-model="creditcardInput.cvc"
                        autocomplete="cc-csc"
                        class="input"
                        :options="creditcardMaskCVC"
                        placeholder="3 digits code"
                        @focus="isCardFlipped = true"
                      />
                    </VControl>
                  </VField>
                </div>
                <div class="column is-12">
                  <div class="button-wrap">
                    <VButton color="primary" raised fullwidth @click="chargeAndSubscribeCreditCard">
                      Approve payment
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {contractorService} from '/@src/service/contractor-service'
// import {plans} from '/@src/data/apps/saas-billing'
import {useCreditcardMask} from '/@src/composable/useCreditcardMask'
import {useNotyf} from "/@src/composable/useNotyf";
import {useStorage} from "@vueuse/core";

const route = useRoute()
const router = useRouter()
const notif = useNotyf()
let user: any = useStorage('user', [])


const contractorID = ref<string>(user.value.Id)
const contractorName = ref<string>(user.value.Name)
const contractorEmail = ref<string>(user.value.Email)
const contractorAddressLine1 = ref<string>(user.value.AddressLine1)
const contractorAddressLine2 = ref<string>(user.value.AddressLine2)

const {
  creditcardIcon,
  creditcardLogo,
  creditcardColor,
  creditcardMaskDate,
  creditcardMaskCVC,
  creditcardMaskNumber,
  creditcardMaskNumberOnAccept,
} = useCreditcardMask()

// const selectedPlanId = ref('starter')
// const invoces = ref(false)
// const warnBilling = ref(false)
const chargedAmount = ref(5)
const zipCodesStr = ref()
const isLoading = ref(false)
const isCardFlipped = ref(false)
const creditcardInput = reactive({
  number: '',
  name: '',
  cvc: '',
  expiry: '',
})

const chargeAndSubscribeCreditCard = async () => {
  console.log("creditcardInput ", creditcardInput)
  isLoading.value = true

  if (!creditcardInput.cvc || !creditcardInput.expiry || !creditcardInput.name || !creditcardInput.number) {
    notif.error('Please fill the all fields')
    isLoading.value = false
    return
  }

  if (creditcardInput.number.length !== 19) {
    notif.error('Please enter a valid card number..!!')
    isLoading.value = false
    return
  }

  if (creditcardInput.cvc.length !== 3) {
    notif.error('Please enter a valid cvc number..!!')
    isLoading.value = false
    return
  }

  if (creditcardInput.expiry.length < 4 || creditcardInput.expiry.length > 5) {
    notif.error('Please enter a valid expiry date..!!')
    isLoading.value = false
    return
  }

  let formData = new FormData();
  formData.append('ContractorID', contractorID.value)
  formData.append('ContractorName', contractorName.value)
  formData.append('ContractorEmail', contractorEmail.value)
  formData.append('ContractorAddressLine1', contractorAddressLine1.value)
  formData.append('ContractorAddressLine2', contractorAddressLine2.value)
  formData.append('CardUserName', creditcardInput.name)
  formData.append('CardNumber', creditcardInput.number)
  formData.append('CardCVC', creditcardInput.cvc)
  formData.append('CardExpiry', creditcardInput.expiry)
  formData.append('Amount', chargedAmount.value.toString())
  formData.append('ZipCodesStr', zipCodesStr.value)

  const credit_card_charged_state = await contractorService.chargeAndSubscribeCreditCard(formData)

  if (credit_card_charged_state.data.Success === true) {
    notif.success('Credit card was charged successfully.!!')
    isLoading.value = false
  } else {
    isLoading.value = false
    notif.error(credit_card_charged_state.data.Message)
  }
}

onMounted(() => {
  if (!route.params.chargedAmount) router.push({name: "contractor-payment"})
  chargedAmount.value = Number(route.params.chargedAmount);
  zipCodesStr.value = route.params.zipCodesStr;
})

</script>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

/* ==========================================================================
1. SaaS Billing
========================================================================== */
.saas-billing-wrapper {
  max-width: 980px;
  margin: 0 auto;

  .plans-wrapper {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--fade-grey-dark-4);
    padding-bottom: 20px;
    margin-bottom: 20px;

    .right {
      width: 50%;
      padding: 20px 0;
      margin: auto;

      .plan-details {
        > h3 {
          font-family: var(--font);
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--dark-text);
          margin-bottom: 10px;
        }

        .plan-details-inner {
          .plan-description {
            display: flex;
            align-items: center;

            .right {
              flex-grow: 2;

              .plan-pricing {
                padding: 5px 0 10px;
                font-family: var(--font);
                line-height: 1.3;

                span {
                  display: block;
                  font-size: 0.9rem;
                  font-weight: 500;
                  color: var(--primary);
                  font-family: var(--font-alt);

                  &:first-child {
                    color: var(--dark-text);
                  }

                  b {
                    font-size: 2rem;
                    font-family: var(--font);
                  }
                }
              }

              .plan-moto {
                p {
                  font-size: 0.9rem;
                }
              }
            }
          }

          .plan-summary {
            .plan-features {
              ul {
                font-family: var(--font-alt);
                font-size: 0.95rem;
                color: var(--dark-text);
              }
            }
          }
        }
      }
    }
  }

  .billing-options-wrapper {
    display: flex;
    align-items: flex-start;

    .right {
      width: 50%;
      margin: auto;

      .payment-form {
        padding: 20px 30px;
        background: var(--white);
        border-radius: var(--radius);
        border: 1px solid var(--fade-grey-dark-3);

        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          h3 {
            font-family: var(--font-alt);
            font-size: 1rem;
            font-weight: 600;
            color: var(--dark-text);
          }

          span {
            font-family: var(--font);
            color: var(--light-text);
            cursor: pointer;
          }
        }

        .form-container {
          padding: 30px 0 20px;
          max-width: 330px;
          margin: 0 auto;
          color: #707070;

          .column {
            padding: 0.25rem 0.75rem;
          }

          .field {
            margin-bottom: 0;

            .control {
              position: relative;

              .creditcardIcon {
                svg {
                  height: 30px;
                  position: absolute;
                  right: -2px;
                  top: 4px;
                  width: 60px;
                }
              }
            }
          }

          .button-wrap {
            padding-top: 16px;

            .v-button {
              min-height: 50px;
            }
          }
        }
      }
    }
  }
}

/* ==========================================================================
2. SaaS Billing Dark mode
========================================================================== */

.is-dark {
  .saas-billing-wrapper {
    .plans-wrapper {
      border-color: var(--dark-sidebar-light-20);

      .right {
        .plan-details {
          .plan-details-inner {
            .plan-description {
              .right {
                .plan-pricing span {
                  &:first-child {
                    color: var(--dark-dark-text);
                  }

                  &:nth-child(2) {
                    color: var(--primary);
                  }
                }
              }
            }

            .plan-summary {
              .plan-features {
                ul {
                  color: var(--dark-dark-text);
                }
              }
            }
          }
        }
      }
    }

    .billing-options-wrapper {

      .right {
        .payment-form {
          background: var(--dark-sidebar-light-6);
          border-color: var(--dark-sidebar-light-12);

          .form-header {
            h3 {
              color: var(--dark-dark-text);
            }

            span:hover,
            a:hover {
              color: var(--primary);
            }
          }
        }
      }
    }
  }
}

/* ==========================================================================
3. SaaS Billing Media Queries
========================================================================== */

@media only screen and (max-width: 767px) {
  .saas-billing-wrapper {
    .plans-wrapper {
      flex-direction: column;

      .right {
        width: 100%;
        max-width: 100%;
      }

      .right {
        .plan-details {
          .plan-details-inner {
            .plan-summary {
              .plan-features {
                .columns {
                  display: flex;
                }
              }
            }
          }
        }
      }
    }

    .billing-options-wrapper {
      flex-direction: column;

      .right {
        width: 100%;
        max-width: 100%;
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .saas-billing-wrapper {
    max-width: 690px;

    .plans-wrapper {
      flex-direction: column;


      .right {
        width: 100%;
        max-width: 100%;
      }

      .right {
        .plan-details {
          .plan-details-inner {
            .plan-summary {
              .plan-features {
                .columns {
                  display: flex;
                }
              }
            }
          }
        }
      }
    }

    .billing-options-wrapper {
      flex-direction: column;

      .right {
        width: 100%;
        max-width: 100%;
      }
    }
  }
}

</style>
