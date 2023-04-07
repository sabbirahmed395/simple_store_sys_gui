<template>
  <div
    class="py-5 md:py-0 -mx-3 px-3 sm:-mx-8 sm:px-8 bg-black/[0.15] dark:bg-transparent"
  >
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <MobileMenu />
    <div class="flex mt-[4.7rem] md:mt-0 overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav class="side-nav">
        <router-link
          :to="{ name: 'side-menu-dashboard-overview-1' }"
          tag="a"
          class="intro-x flex items-center pl-5 pt-4 mt-3"
        >
          <img
            alt="Tinker Tailwind HTML Admin Template"
            class="w-20"
            src="@/assets/images/MBM-Logo.png"
          />
          <span class="hidden xl:block text-white text-lg ml-3">
            Store Management System
          </span>
        </router-link>
        <div class="side-nav__devider my-6"></div>
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li
              v-if="menu == 'devider'"
              :key="menu + menuKey"
              class="side-nav__devider my-6"
            ></li>
            <li v-else :key="menu + menuKey">
              <SideMenuTooltip
                tag="a"
                :content="menu.title"
                :href="
                  menu.subMenu
                    ? 'javascript:;'
                    : router.resolve({ name: menu.pageName }).path
                "
                class="side-menu"
                :class="{
                  'side-menu--active': menu.active,
                  'side-menu--open': menu.activeDropdown,
                }"
                @click="linkTo(menu, router, $event)"
              >
                <div class="side-menu__icon">
                  <component :is="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div
                    v-if="menu.subMenu"
                    class="side-menu__sub-icon"
                    :class="{ 'transform rotate-180': menu.activeDropdown }"
                  >
                    <ChevronDownIcon />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.activeDropdown">
                  <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                    <SideMenuTooltip
                      tag="a"
                      :content="subMenu.title"
                      :href="
                        subMenu.subMenu
                          ? 'javascript:;'
                          : router.resolve({ name: subMenu.pageName }).path
                      "
                      class="side-menu"
                      :class="{ 'side-menu--active': subMenu.active }"
                      @click="linkTo(subMenu, router, $event)"
                    >
                      <div class="side-menu__icon">
                        <component :is="subMenu.icon" />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div
                          v-if="subMenu.subMenu"
                          class="side-menu__sub-icon"
                          :class="{
                            'transform rotate-180': subMenu.activeDropdown,
                          }"
                        >
                          <ChevronDownIcon />
                        </div>
                      </div>
                    </SideMenuTooltip>
                    <!-- BEGIN: Third Child -->
                    <transition @enter="enter" @leave="leave">
                      <ul v-if="subMenu.subMenu && subMenu.activeDropdown">
                        <li
                          v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                          :key="lastSubMenuKey"
                        >
                          <SideMenuTooltip
                            tag="a"
                            :content="lastSubMenu.title"
                            :href="
                              lastSubMenu.subMenu
                                ? 'javascript:;'
                                : router.resolve({ name: lastSubMenu.pageName }).path
                            "
                            class="side-menu"
                            :class="{ 'side-menu--active': lastSubMenu.active }"
                            @click="linkTo(lastSubMenu, router, $event)"
                          >
                            <div class="side-menu__icon">
                              <ZapIcon />
                            </div>
                            <div class="side-menu__title">
                              {{ lastSubMenu.title }}
                            </div>
                          </SideMenuTooltip>
                        </li>
                      </ul>
                    </transition>
                    <!-- END: Third Child -->
                  </li>
                </ul>
              </transition>
              <!-- END: Second Child -->
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div class="content">
        <TopBar />
        <router-view />
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { helper as $h } from "@/utils/helper";
import { useSideMenuStore } from "@/stores/side-menu";
// import { useTeachersStore } from "../../stores/teachers";
// import { useStudentsStore } from "../../stores/students";
import TopBar from "@/components/top-bar/Main.vue";
import MobileMenu from "@/components/mobile-menu/Main.vue";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main.vue";
import { linkTo, nestedMenu, enter, leave } from "./index";
import dom from "@left4code/tw-starter/dist/js/dom";

const route = useRoute();
const router = useRouter();
const formattedMenu = ref([]);
const sideMenuStore = useSideMenuStore();
// const teacherStore = useTeachersStore();
// const studentStore = useStudentsStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));
const isTeacher = ref(false);
const isAdmin = ref(false);

provide("forceActiveMenu", (pageName) => {
  route.forceActiveMenu = pageName;
  formattedMenu.value = $h.toRaw(sideMenu.value);
});

watch(
  computed(() => route.path),
  () => {
    delete route.forceActiveMenu;
    formattedMenu.value = $h.toRaw(sideMenu.value);
  }
);

onMounted(() => {
  let user = JSON.parse(localStorage.getItem("auth"));

  if (user) {
    if (user.user_type == "teacher") {
      isTeacher.value = true;
      isAdmin.value = false;
    } else {
      isTeacher.value = false;
      isAdmin.value = true;
    }
  }
  dom("body").removeClass("error-page").removeClass("login").addClass("main");
  formattedMenu.value = $h.toRaw(sideMenu.value);
  // let rawMenu = $h.toRaw(sideMenu.value);
  // let filteredRawMenu = [];
  // rawMenu.forEach((menu) => {
  //   if (menu.scopes.includes(user.user_type)) {
  //     let filteredSubMenu = [];
  //     // console.log(menu.subMenu);
  //     if (menu.subMenu && menu.subMenu.length > 0) {
  //       menu.subMenu.forEach((submenu) => {
  //         if (submenu.scopes.includes(user.user_type)) {
  //           filteredSubMenu.push(submenu);
  //         }
  //       });
  //     }

  //     if (filteredSubMenu.length > 0) {
  //       menu.subMenu = filteredSubMenu;
  //     }
  //     filteredRawMenu.push(menu);
  //   }
  // });
  // // console.log(filteredRawMenu);
  // formattedMenu.value = filteredRawMenu;
});
</script>
