<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import { usePanels } from '/@src/stores/panels'

export type NavbarTheme = 'default' | 'colored' | 'fade'
export type SubnavId =
  | 'closed'
  | 'home'
  | 'add-progress'
  | 'public-projects'
  | 'my-project'
  | 'gallery'

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
  switch (subnav) {
    case 'home':
      router.push({
        name: 'contractor',
      })
      break
    case 'gallery':
      router.push({
        name: 'contractor-gallery',
      })
      break
    case 'my-project':
      router.push({
        name: 'contractor-my-project',
      })
      break
    case 'public-projects':
      router.push({
        name: 'contractor-all-public-project',
      })
      break
    case 'add-progress':
      router.push({
        name: 'contractor-add-progress',
      })
      break

    default:
      break
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
        <RouterLink :to="{ name: 'contractor' }" class="navbar-item is-brand">
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
        <!-- <li>
          <a
            :class="[activeMobileSubsidebar === 'layouts' && 'is-active']"
            tabindex="0"
            @keydown.space.prevent="activeMobileSubsidebar = 'layouts'"
            @click="activeMobileSubsidebar = 'layouts'"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:grid"></i>
          </a>
        </li>
        <li
          :class="[activeMobileSubsidebar === 'elements' && 'is-active']"
          tabindex="0"
          @keydown.space.prevent="activeMobileSubsidebar = 'elements'"
          @click="activeMobileSubsidebar = 'elements'"
        >
          <a>
            <i aria-hidden="true" class="iconify" data-icon="feather:box"></i>
          </a>
        </li>
        <li
          :class="[activeMobileSubsidebar === 'components' && 'is-active']"
          tabindex="0"
          @keydown.space.prevent="activeMobileSubsidebar = 'components'"
          @click="activeMobileSubsidebar = 'components'"
        >
          <a>
            <i aria-hidden="true" class="iconify" data-icon="feather:cpu"></i>
          </a>
        </li>
        <li>
          <i aria-hidden="true" class="iconify" data-icon="feather:message-circle"></i>
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
        </li> -->
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
        <RouterLink :to="{ name: 'contractor' }" class="brand">
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
        <Toolbar class="desktop-toolbar"> </Toolbar>

        <!-- <LayoutSwitcher /> -->
        <UserProfileDropdown right />
      </template>

      <!-- Custom navbar links -->
      <template #links>
        <div class="centered-links" :class="[activeSubnav === 'search' && 'is-hidden']">
          <a
            :class="[
              (activeSubnav === 'home' || route.path == '/contractor') && 'is-active',
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
              (activeSubnav === 'public-projects' ||
                route.path.startsWith('/contractor/all-public-project')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            @keydown.space.prevent="toggleSubnav('public-projects')"
            @click="toggleSubnav('public-projects')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:file-plus"></i>
            <span>Public Projects</span>
          </a>
          <a
            :class="[
              (activeSubnav === 'my-project' ||
                route.path.startsWith('/contractor/my-project')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('my-project')"
            @click="toggleSubnav('my-project')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:folder"></i>
            <span>My Projects</span>
          </a>
          <a
            :class="[
              (activeSubnav === 'gallery' ||
                route.path.startsWith('/contractor/gallery')) &&
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
              (activeSubnav === 'add-progress' ||
                route.path.startsWith('/contractor/add-progress')) &&
                'is-active',
            ]"
            class="centered-link centered-link-toggle"
            tabindex="0"
            @keydown.space.prevent="toggleSubnav('add-progress')"
            @click="toggleSubnav('add-progress')"
          >
            <i aria-hidden="true" class="iconify" data-icon="feather:folder-plus"></i>
            <span>Add Progress</span>
          </a>
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
