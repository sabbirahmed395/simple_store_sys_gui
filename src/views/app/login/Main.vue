<template>
  <div>
    <DarkModeSwitcher />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <a href="" class="-intro-x flex items-center pt-5">
            <img alt="MBM Group" class="w-6" src="@/assets/images/MBM-Logo.png" />
            <span class="text-white text-lg ml-3"> MBM Group</span>
          </a>
          <div class="my-auto">
            <img
              alt="MBM Group"
              class="-intro-x w-1/2 -mt-16"
              src="@/assets/images/MBM-Logo.png"
            />
            <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
              Store Management System
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
              Sign In
            </h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
              Use your official credentials in order to access in the system
            </div>
            <div class="intro-x mt-8">
              <input
                type="text"
                v-model="email"
                @keyup.enter="login"
                class="intro-x login__input form-control py-3 px-4 block"
                placeholder="Email"
              />
              <input
                type="password"
                v-model="password"
                @keyup.enter="login"
                class="intro-x login__input form-control py-3 px-4 block mt-4"
                placeholder="Password"
              />
            </div>
            <div
              class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4"
            >
              <div class="flex items-center mr-auto">
                <input
                  id="remember-me"
                  type="checkbox"
                  class="form-check-input border mr-2"
                />
                <label class="cursor-pointer select-none" for="remember-me"
                  >Remember me</label
                >
              </div>
              <a href="">Forgot Password?</a>
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button
                @click="login"
                class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top"
              >
                Login
              </button>
            </div>
            <div
              class="intro-x mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center xl:text-left"
            >
              Version <code>1.0.0</code>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
// import { http } from "@/httpCommons";
import Axios from "axios";
// import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";
import Toastify from "toastify-js";
import router from "@/router";

onMounted(() => {
  redirectToDashboard();
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});

const email = ref("");
const password = ref("");

function redirectToDashboard() {
  if (localStorage.getItem("access_token")) {
    location.href = "/";
  }
}

async function login() {
  await Axios.post(`/api/auth/login`, {
    email: email.value,
    password: password.value,
  })
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access_token);
        // console.log("R: " + response.data.user);
        // console.log("S: " + JSON.stringify(response.data.user));

        let redirectTo = "/";
        // if (response.data.user.user_type === "teacher") {
        //   let teacher_id = response.data.teacher.id;

        //   redirectTo = `teachers/${teacher_id}/details`;

        //   nextTick(function () {
        //     location.href = redirectTo;
        //   });
        // }
        localStorage.setItem("auth", JSON.stringify(response.data.user));
        localStorage.setItem("roles", JSON.stringify(response.data.roles));

        nextTick(function () {
          setTimeout(() => {
            const _next = localStorage.getItem("_next");
            if (_next) {
              localStorage.removeItem("_next");
              location.href = _next;
            } else {
              location.href = "/";
            }
          }, 100);
        });
      }
    })
    .catch((error) => {
      if (error.response && error.response.status > 400) {
        Toastify({
          text: error.response.data.message,
          duration: 3000,
          newWindow: true,
          // close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#D32929",
          style: {
            padding: "8px 15px",
          },
          stopOnFocus: true,
        }).showToast();

        localStorage.removeItem("auth");
        localStorage.removeItem("access_token");
        localStorage.removeItem("roles");

        router.push({ path: "/login" });
      }
    });
}

defineExpose({
  email,
  password,
  login,
});
</script>
