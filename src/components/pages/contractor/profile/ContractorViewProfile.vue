<script setup lang="ts">
import { onceImageErrored } from '/@src/utils/via-placeholder'
import {onMounted, ref} from "vue";
import {contractorService} from "/@src/service/contractor-service";
import {useRoute, useRouter} from "vue-router";


const route = useRoute()
const router = useRouter()

const id = ref<any>(0)
const contractorData = ref<any>({})
const contractorCategories = ref<any>({})
const contractorProjects = ref<any>({})

const fetchContractorProfileView = async () => {
  id.value = route.query.id
  const {ProfileView} = await contractorService.getContractorProfileViewById(id.value)

  if (Boolean(ProfileView.data)) {
    console.log('data',ProfileView.data)
    contractorData.value = ProfileView.data
    contractorCategories.value = ProfileView.data.Category
    contractorProjects.value = ProfileView.data.Projects

  }else {
    console.error("no contractor by that id")
    await router.push({name: 'error'})
  }
}

const gotoURL = (URL: string) => {
  // window.location.href = URL
  window.open(URL, '_blank');
}


onMounted(async () => {
  await fetchContractorProfileView()
})
</script>

<template>
  <div class="profile-wrapper">
    <div class="profile-header has-text-centered">
      <VAvatar
        size="xl"
        :picture="contractorData.Image"

      />

      <h3 class="title is-4 is-narrow is-thin">{{contractorData.Name}}</h3>
      <p class="light-text">
        {{contractorData.SmallInfo}}
      </p>
      <div class="profile-stats">
        <div class="profile-stat">
          <i aria-hidden="true" class="lnil lnil-users-alt"></i>
          <span>{{contractorData.ProjectCount}} + Customers</span>
        </div>
        <div class="separator"></div>
        <div class="profile-stat">
          <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
          <span>{{contractorData.ProjectCount}} Projects</span>
        </div>
        <div class="separator"></div>
        <div class="socials">
          <a><i  aria-hidden="true" class="fab fa-facebook-f" @click="gotoURL(contractorData.URLFb)"></i></a>
          <a><i aria-hidden="true" class="fab fa-twitter" @click="gotoURL(contractorData.URLTwitter)"></i></a>
          <a><i aria-hidden="true" class="fab fa-linkedin-in" @click="gotoURL(contractorData.URLLinkedin)"></i></a>
        </div>
      </div>
    </div>

    <div class="profile-body">
      <div class="columns">
        <div class="column is-8">
          <div class="profile-card">
            <div class="profile-card-section">
              <div class="section-title">
                <h4>About Me</h4>
<!--                <RouterLink :to="{ name: 'sidebar-layouts-profile-edit' }">-->
<!--                  <i aria-hidden="true" class="lnil lnil-pencil"></i>-->
<!--                </RouterLink>-->
                <i aria-hidden="true" class="lnil lnil-pencil"></i>
              </div>
              <div class="section-content">
                <p class="description">
                  {{contractorData.Bio}}
                </p>
              </div>
            </div>

            <div class="profile-card-section">
              <div class="profile-card-section no-padding">
                <div class="section-title">
                  <h4>Projects</h4>
                  <a><i aria-hidden="true" class="lnil lnil-pencil"></i></a>
<!--                  <a class="action-link" tabindex="0">View All</a>-->
                </div>
                <div class="section-content">
                  <div class="recommendations-wrapper">
                    <!--Recommendation-->
                    <div class="recommendations-item" v-for="(p, key) in contractorProjects">
                      <VAvatar
                        size="large"
                        :picture="p.ImageUrl"
                      />
                      <h3 class="dark-inverted">{{p.ProjectName}}</h3>
                      <p>{{p.Description}}</p>
                      <div class="meta">
                        <span>{{ p.Category }}</span>
                        <span>{{p.Date}}</span>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>

          </div>

          <!--Recommendations-->

        </div>
        <div class="column is-4">


          <!--Tools-->
          <div class="profile-card">
            <div class="profile-card-section no-padding">
              <div class="section-title">
                <h4>Contact Me</h4>
<!--                <RouterLink :to="{ name: 'sidebar-layouts-profile-edit-skills' }">-->
<!--                  <i aria-hidden="true" class="lnil lnil-pencil"></i>-->
<!--                </RouterLink>-->
                <i aria-hidden="true" class="lnil lnil-pencil"></i>
<!--                <a class="action-link" tabindex="0">View All</a>-->
              </div>
              <div class="section-content">
                <div class="tools-wrapper">
                  <!--Email-->
                  <div class="tools-item">
                    <VIconWrap icon="feather:mail">

                    </VIconWrap>

                    <div class="meta">
                      <span class="dark-inverted">Email</span>
                      <span>{{contractorData.Email}}</span>
                    </div>
                  </div>

                  <!--Telephone-->
                  <div class="tools-item">
                    <VIconWrap icon="feather:phone">

                    </VIconWrap>

                    <div class="meta">
                      <span class="dark-inverted">Telephone</span>
                      <span>{{contractorData.PhoneNumber}}</span>
                    </div>
                  </div>

                  <!--Address-->
                  <div class="tools-item">
                    <VIconWrap icon="feather:map-pin">

                    </VIconWrap>

                    <div class="meta">
                      <span class="dark-inverted">Address</span>
                      <span>{{contractorData.AddressLine1}},{{contractorData.AddressLine2}}. </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <!--Recent Views-->
          <div class="profile-card">
            <div class="profile-card-section no-padding">
              <div class="section-title">
                <h4>Categories</h4>
<!--                <a class="action-link" tabindex="0">View All</a>-->
              </div>
              <div class="section-content">
                <div class="people-wrapper">
                  <!--Category-->
                  <a href="#" class="people-item" v-for="(c, key) in contractorCategories">
                    <VAvatar
                      :initials="c.SubCategory === 'sub_cat_1' ? 'SHR' : c.SubCategory === 'sub_cat_2' ? 'Ed': 'Art'"
                      :color="c.SubCategory === 'sub_cat_1' ? 'h-blue' : c.SubCategory === 'sub_cat_2' ? 'h-red': 'h-green'"
                      size="medium"
                    />

                    <div class="meta">
                      <span class="dark-inverted">{{c.Name}}</span>
                      <span>{{c.SubCategory === 'sub_cat_1' ? 'Service-Home Remodel' : c.SubCategory === 'sub_cat_2' ? 'Education': 'Arts'}}</span>
                    </div>
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/mixins';

.is-navbar {
  .profile-wrapper {
    margin-top: 30px;
  }
}

.profile-wrapper {
  max-width: 1040px;
  margin: 0 auto;

  .profile-header {
    text-align: center;

    > img {
      display: block;
      margin: 0 auto;
      max-width: 300px;
    }

    .v-avatar {
      margin: 0 auto 12px;
    }

    .anim-icon {
      margin-bottom: 12px;
    }

    .title {
      margin-bottom: 6px;
    }

    p {
      font-size: 1rem;
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.3;
    }

    .profile-stats {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px 0;

      .profile-stat {
        display: flex;
        align-items: center;
        color: var(--light-text);
        font-family: var(--font);

        span {
          font-size: 0.9rem;
        }

        i {
          font-size: 1.2rem;
          margin-right: 6px;
        }
      }

      .separator {
        height: 25px;
        width: 2px;
        border-right: 1px solid var(--fade-grey-dark-6);
        margin: 0 10px;
      }

      .socials {
        display: flex;
        justify-content: center;

        a {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 28px;
          width: 28px;
          background: var(--white);
          border: 1px solid var(--fade-grey-dark-6);
          box-shadow: var(--light-box-shadow);
          border-radius: var(--radius-rounded);
          margin: 0 2px;
          transition: all 0.3s; // transition-all test

          &:hover {
            border-color: var(--primary);

            i {
              color: var(--primary);
            }
          }

          i {
            font-size: 0.9rem;
            color: var(--light-text);
            transition: color 0.3s;
          }
        }
      }
    }
  }

  .profile-body {
    padding: 10px 0 20px;

    .profile-card {
      @include vuero-s-card;

      padding: 30px;

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      .profile-card-section {
        padding-bottom: 20px;

        &:not(:last-child) {
          margin-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-4);
        }

        &.no-padding {
          padding-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 0.8rem;
            text-transform: uppercase;
            color: var(--dark-text);
            margin-right: 6px;
          }

          i {
            color: var(--primary);
          }

          .action-link {
            position: relative;
            top: -2px;
            margin-left: auto;
            text-transform: uppercase;
            font-size: 0.8rem;
          }

          .control {
            margin-left: auto;

            .form-switch {
              transform: scale(0.8);
            }
          }
        }

        .section-content {
          .description {
            font-size: 0.95rem;
          }

          .experience-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-left: -8px;
            margin-right: -8px;

            .experience-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              img {
                display: block;
                width: 50px;
                min-width: 50px;
                height: 50px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--fade-grey-dark-4);
              }

              .meta {
                margin-left: 10px;

                > span {
                  font-family: var(--font);
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.85rem;
                  }

                  &:nth-child(2),
                  &:nth-child(3) {
                    font-size: 0.85rem;
                    color: var(--light-text);

                    i {
                      position: relative;
                      top: -2px;
                      font-size: 4px;
                      margin: 0 6px;
                    }
                  }

                  &:nth-child(3) {
                    color: var(--primary);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .languages-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-left: -8px;
            margin-right: -8px;

            .languages-item {
              display: flex;
              align-items: center;
              width: calc(50% - 16px);
              margin: 8px;

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }
              }

              .meta {
                margin-left: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .skills-wrapper {
            .skills-item {
              display: flex;
              align-items: center;

              &:not(:last-child) {
                margin-bottom: 16px;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 42px;
                min-width: 42px;
                height: 42px;
                border-radius: var(--radius-rounded);
                border: 1px solid var(--primary);

                &.has-icon {
                  background: var(--fade-grey-light-2);
                  border: 1px solid var(--fade-grey-dark-3);
                  color: var(--light-text);

                  i {
                    font-size: 1.4rem;
                  }
                }

                img {
                  display: block;
                  width: 34px;
                  min-width: 34px;
                  height: 34px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid var(--fade-grey-dark-4);
                }

                .count {
                  position: absolute;
                  bottom: 0;
                  right: -4px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 22px;
                  height: 22px;
                  border-radius: var(--radius-rounded);
                  background: var(--white);
                  border: 1px solid var(--primary);

                  span {
                    font-family: var(--font);
                    font-weight: 500;
                    font-size: 0.75rem;
                  }
                }
              }

              .skill-info {
                font-family: var(--font);
                margin-left: 12px;
                line-height: 1.3;

                span {
                  display: block;

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }

              .people {
                margin-left: auto;
                display: flex;
                justify-content: flex-end;

                .v-avatar {
                  margin: 0 4px;
                }
              }
            }
          }

          .recommendations-wrapper {
            display: flex;
            flex-wrap: wrap;
            margin-left: -8px;
            margin-right: -8px;

            .recommendations-item {
              width: calc(50% - 16px);
              margin: 8px;
              background: var(--fade-grey-light-3);
              text-align: center;
              padding: 30px 20px;
              border-radius: var(--radius);

              > .v-avatar {
                display: block;
                margin: 0 auto 8px;
              }

              h3 {
                font-size: 1rem;
                font-family: var(--font-alt);
                font-weight: 600;
                color: var(--dark-text);
                margin-bottom: 8px;
              }

              p {
                font-size: 0.85rem;
                margin-bottom: 16px;
              }

              .meta {
                span {
                  display: block;

                  &:first-child {
                    font-weight: 600;
                    font-family: var(--font-alt);
                    font-size: 0.95rem;
                    color: var(--primary);
                  }

                  &:nth-child(2) {
                    font-size: 0.9rem;
                    color: var(--light-text);
                  }
                }
              }
            }
          }

          .network-notifications {
            h3 {
              font-family: var(--font-alt);
              font-size: 0.9rem;
              margin-bottom: 6px;
            }

            p {
              font-size: 0.9rem;
              max-width: 480px;
            }
          }

          .tools-wrapper {
            padding-top: 12px;

            .tools-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .icon-wrap {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                min-width: 50px;
                height: 50px;

                img {
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  display: block;
                  width: 32px;
                  min-width: 32px;
                  height: 32px;
                  border-radius: var(--radius-rounded);
                  border: 1px solid transparent;
                }
              }

              .meta {
                margin-left: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .people-wrapper {
            padding-top: 12px;

            .people-item {
              display: flex;
              align-items: center;
              margin-bottom: 16px;

              &:last-child {
                margin-bottom: 0;
              }

              .meta {
                margin-left: 10px;

                > span {
                  display: block;
                  font-family: var(--font);

                  &:first-child {
                    font-family: var(--font-alt);
                    font-weight: 600;
                    color: var(--dark-text);
                    font-size: 0.9rem;
                  }

                  &:nth-child(2) {
                    font-size: 0.85rem;
                    color: var(--light-text);
                  }

                  span {
                    display: inline-block;
                  }
                }
              }
            }
          }

          .more-button {
            padding-top: 16px;

            .button {
              min-width: 180px;
              font-family: var(--font);
              text-transform: uppercase;
              font-size: 0.8rem;
              font-weight: 500;
              margin: 0 auto;
              color: var(--light-text);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .profile-wrapper {
    .profile-header {
      .v-avatar {
        .badge {
          border-color: var(--dark-sidebar-light-6);
        }
      }

      .profile-stats {
        .separator {
          border-color: var(--dark-sidebar-light-20);
        }

        .socials {
          a {
            background: var(--dark-sidebar-light-2);
            border-color: var(--dark-sidebar-light-12);

            &:hover,
            &:focus {
              border-color: var(--primary);

              i {
                color: var(--primary);
              }
            }
          }
        }
      }
    }

    .profile-body {
      .profile-card {
        @include vuero-card--dark;

        .profile-card-section {
          border-color: var(--dark-sidebar-light-12);

          .section-title {
            h4 {
              color: var(--dark-dark-text);
            }

            i {
              color: var(--primary);
            }
          }

          .section-content {
            .icon-wrap {
              > img {
                border-color: var(--dark-sidebar-light-12) !important;
              }
            }

            .experience-wrapper {
              .experience-item {
                > img {
                  border-color: var(--dark-sidebar-light-12);
                }

                .meta {
                  > span {
                    &:nth-child(3) {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .skills-wrapper {
              .skills-item {
                .icon-wrap {
                  border-color: var(--primary) !important;

                  &.has-icon,
                  &.has-img {
                    background: var(--dark-sidebar-light-2) !important;
                    border-color: var(--dark-sidebar-light-12) !important;
                  }
                }

                .people {
                  .v-avatar {
                    &:last-child {
                      .is-fake {
                        background: var(--dark-sidebar-light-2);
                        border: 1px solid var(--dark-sidebar-light-12);
                      }
                    }
                  }
                }
              }
            }

            .recommendations-wrapper {
              .recommendations-item {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);

                .meta {
                  span {
                    &:first-child {
                      color: var(--primary);
                    }
                  }
                }
              }
            }

            .more-button {
              .button {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-12);
              }
            }
          }
        }
      }
    }
  }

  .icon-wrap,
  .icon-wrap.is-placeholder {
    background: var(--dark-sidebar-light-2) !important;
    border-color: var(--dark-sidebar-light-12) !important;
  }
}

@media only screen and (max-width: 767px) {
  .profile-wrapper {
    .profile-body {
      .profile-card {
        padding: 20px;

        .profile-card-section {
          .section-content {
            .experience-wrapper,
            .languages-wrapper,
            .recommendations-wrapper {
              .experience-item,
              .languages-item,
              .recommendations-item {
                width: calc(100% - 16px);
              }
            }

            .skills-wrapper {
              .skills-item {
                .people {
                  .v-avatar {
                    &:not(:last-child) {
                      display: none !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
