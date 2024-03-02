<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'

export type NavbarTheme = 'default' | 'colored' | 'fade'
export type SubnavId =
  | 'closed'
  | 'create-project'
  | 'project-status'
  | 'favourite'
  | 'gallery'
  | 'proposal'
  | 'search'
  | 'home'

const props = withDefaults(
  defineProps<{
    theme?: NavbarTheme
    nowrap?: boolean
  }>(),
  {
    theme: 'default',
  }
)

const viewWrapper = useViewWrapper()
const panels = usePanels()
const route = useRoute()
const router = useRouter()

const filter = ref('')
const isMobileSidebarOpen = ref(false)
const activeMobileSubsidebar = ref('dashboard')
const activeSubnav = ref<SubnavId>('closed')

function toggleSubnav(subnav: SubnavId) {
  if (subnav === 'create-project') {
    router.push({
      name: 'customer-create-project',
    })
  } else if (subnav === 'home') {
    router.push({
      name: 'customer',
    })
  } else if (subnav === 'project-status') {
    router.push({
      name: 'customer-project-status',
    })
  } else if (subnav === 'favourite') {
    router.push({
      name: 'customer-favourite-contractor',
    })
  } else if (subnav === 'gallery') {
    router.push({
      name: 'customer-gallery',
    })
  } else if (subnav === 'proposal') {
    router.push({
      name: 'customer-project-proposal',
    })
  }
}

watch(
  () => route.fullPath,
  () => {
    activeSubnav.value = 'closed'
    isMobileSidebarOpen.value = false
  }
)
</script>

<template>
  <div class="navbar-layout">
    <div class="app-overlay"></div>

    <!-- Mobile navigation -->
    <MobileNavbar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #brand>
        <RouterLink :to="{ name: 'customer' }" class="navbar-item is-brand">
          <img src="/@src/assets/logo/HomeAdvisor-1024x275.jpg" alt="" />
          <!-- <AnimatedLogo width="38px" height="38px" /> -->
        </RouterLink>

        <div class="brand-end">
          <!-- <NotificationsMobileDropdown /> -->
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <MobileSidebar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #links>
        <li>
          <a
            :class="[activeMobileSubsidebar === 'dashboard' && 'is-active']"
            tabindex="0"
            @keydown.space.prevent="activeMobileSubsidebar = 'dashboard'"
            @click="activeMobileSubsidebar = 'dashboard'"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:activity"></i>
          </a>
        </li>
      </template>

      <template #bottom-links>
        <li>
          <a
            tabindex="0"
            @keydown.space.prevent="panels.setActive('search')"
            @click="panels.setActive('search')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:search"></i>
          </a>
        </li>
        <li>
          <a href="#">
            <i aria-hidden="true" class="iconify" data-icon="feather:settings"></i>
          </a>
        </li>
      </template>
    </MobileSidebar>

    <!-- Mobile subsidebar links -->
    <Transition name="slide-x">
      <LayoutsMobileSubsidebar
        v-if="isMobileSidebarOpen && activeMobileSubsidebar === 'layouts'"
      />
      <DashboardsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'dashboard'"
      />
      <ComponentsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'components'"
      />
      <ElementsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'elements'"
      />
    </Transition>

    <!-- Desktop navigation -->
    <Navbar :theme="props.theme">
      <!-- Custom navbar title -->
      <template #title>
        <RouterLink :to="{ name: 'customer' }" class="brand">
          <img
            style="width: 169px; height: 69px"
            src="/@src/assets/logo/HomeAdvisor-1024x275.jpg"
            alt=""
          />
          <!-- <AnimatedLogo width="38px" height="38px" /> -->
        </RouterLink>

        <div class="separator"></div>

        <ProjectsQuickDropdown />
        <h1 class="title is-5">{{ viewWrapper.pageTitle }}</h1>
      </template>

      <!-- Custom navbar toolbar -->
      <template #toolbar>
        <Toolbar class="desktop-toolbar">
          <ToolbarNotification />

          <a
            class="toolbar-link right-panel-trigger"
            tabindex="0"
            @keydown.space.prevent="panels.setActive('activity')"
            @click="panels.setActive('activity')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
          </a>
        </Toolbar>

        <LayoutSwitcher />
        <UserProfileDropdown right />
      </template>

      <!-- Custom navbar links -->
      <template #links>
        <div class="centered-links" :class="[activeSubnav === 'home' && 'is-hidden']">
          <a
            :class="[
              (activeSubnav === 'home' || route.path == '/customer') && 'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('home')"
            @click="toggleSubnav('home')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:home"></i>
            <span>Home</span>
          </a>
          <a
            :class="[
              (activeSubnav === 'create-project' ||
                route.path.startsWith('/customer/create-project') ||
                route.path.startsWith('/customer/create-private-project')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            @keydown.space.prevent="toggleSubnav('create-project')"
            @click="toggleSubnav('create-project')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:file-plus"></i>
            <span>Create project</span>
          </a>
          <a
            :class="[
              (activeSubnav === 'project-status' ||
                route.path.startsWith('/customer/project-status')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('project-status')"
            @click="toggleSubnav('project-status')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
            <span>Project status</span>
          </a>
          <a
            :class="[
              (activeSubnav === 'proposal' ||
                route.path.startsWith('/customer/project-proposal')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('proposal')"
            @click="toggleSubnav('proposal')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:folder"></i>
            <span>Proposals</span>
          </a>
          <!--<a
            :class="[activeSubnav === 'components' && 'is-active']"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('components')"
            @click="toggleSubnav('components')"
          >
            <i aria-hidden="true" class="iconify" data-icon="akar-icons:calculator"></i>
            <span>Budget Calculator</span>
          </a>-->
          <a
            :class="[
              (activeSubnav === 'gallery' ||
                route.path.startsWith('/customer/gallery')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('gallery')"
            @click="toggleSubnav('gallery')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:image"></i>
            <span>Gallery</span>
          </a>
          <a
            :class="[
              (activeSubnav === 'favourite' ||
                route.path.startsWith('/customer/favourite-contractor')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('favourite')"
            @click="toggleSubnav('favourite')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:star"></i>
            <span>Favourite</span>
          </a>
          <!-- <a
            class="centered-link centered-link-search"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('search')"
            @click="toggleSubnav('search')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:search"></i>
            <span>Search</span>
          </a> -->
        </div>

        <div class="centered-search" :class="[activeSubnav !== 'search' && 'is-hidden']">
          <div class="field">
            <div class="control has-icon">
              <input
                v-model="filter"
                type="text"
                class="input is-rounded search-input"
                placeholder="Search records..."
              />
              <div class="form-icon">
                <i aria-hidden="true" class="iconify" data-icon="feather:search"></i>
              </div>
              <div
                class="form-icon is-right"
                tabindex="0"
                @keydown.space.prevent="toggleSubnav('search')"
                @click="toggleSubnav('search')"
              >
                <i aria-hidden="true" class="iconify" data-icon="feather:x"></i>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Custom navbar sub navigation -->
      <template #subnav>
        <div
          :class="[
            !(activeSubnav === 'closed' || activeSubnav === 'search') && 'is-active',
          ]"
          class="navbar-subnavbar"
        >
          <DashboardsSubnav :class="[activeSubnav === 'home' && 'is-active']" />

          <LayoutsSubnav :class="[activeSubnav === 'layouts' && 'is-active']" />

          <ElementsSubnav :class="[activeSubnav === 'elements' && 'is-active']" />

          <ComponentsSubnav :class="[activeSubnav === 'components' && 'is-active']" />
        </div>
      </template>
    </Navbar>

    <!-- <LanguagesPanel /> -->
    <ActivityPanel />
    <TaskPanel />

    <VViewWrapper top-nav>
      <VPageContentWrapper>
        <template v-if="props.nowrap">
          <slot></slot>
        </template>
        <VPageContent v-else class="is-relative">
          <div class="is-navbar-lg">
            <div class="page-title has-text-centered">
              <!-- Mobile Page Title -->
              <div class="title-wrap">
                <h1 class="title is-4">{{ viewWrapper.pageTitle }}</h1>
              </div>

              <Toolbar class="mobile-toolbar">
                <ToolbarNotification />

                <a
                  class="toolbar-link right-panel-trigger"
                  tabindex="0"
                  @keydown.space.prevent="panels.setActive('activity')"
                  @click="panels.setActive('activity')"
                >
                  <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
                </a>
              </Toolbar>
            </div>

            <slot></slot>
          </div>
        </VPageContent>
      </VPageContentWrapper>
    </VViewWrapper>
  </div>
</template>
