<template>
  <div class="relative">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 xl:col-span-9 2xl:col-span-9 z-10">
        <div class="mt-6 -mb-6 intro-y">
          <Alert
            class="box bg-primary text-white flex items-center mb-6"
            v-slot="{ dismiss }"
          >
            <span> Welcome to dashboard! </span>
            <button
              type="button"
              class="btn-close text-white"
              @click="dismiss"
              aria-label="Close"
            >
              <XIcon class="w-4 h-4" />
            </button>
          </Alert>
        </div>
        <div class="mt-14 mb-3 grid grid-cols-12 sm:gap-10 intro-y">
          <div
            class="col-span-12 sm:col-span-6 md:col-span-4 py-6 sm:pl-5 md:pl-0 lg:pl-5 relative text-center sm:text-left"
          >
            <div class="text-sm 2xl:text-base font-medium -mb-1">
              Hi Sir,
              <span class="text-slate-600 dark:text-slate-300 font-normal"
                >welcome back!</span
              >
            </div>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-6 mt-5">
          <div
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
            v-if="summaries && summaries.teachers"
            @click="router.push({ name: 'teachers' })"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <ShoppingCartIcon class="report-box__icon text-primary" />
                  <div class="ml-auto"></div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ summaries.teachers }}
                </div>
                <div class="text-base text-slate-500 mt-1">Total Teachers</div>
              </div>
            </div>
          </div>
          <div
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
            v-if="summaries && summaries.students"
            @click="router.push({ name: 'students' })"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <CreditCardIcon class="report-box__icon text-pending" />
                  <div class="ml-auto"></div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ summaries.students }}
                </div>
                <div class="text-base text-slate-500 mt-1">Total Students</div>
              </div>
            </div>
          </div>
          <div
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
            v-if="summaries && summaries.users"
            @click="router.push({ name: 'users' })"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <MonitorIcon class="report-box__icon text-warning" />
                  <div class="ml-auto"></div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ summaries.users }}
                </div>
                <div class="text-base text-slate-500 mt-1">Total Users</div>
              </div>
            </div>
          </div>
          <div
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
            v-if="summaries && summaries.programs"
            @click="router.push({ name: 'programs' })"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <UserIcon class="report-box__icon text-success" />
                  <div class="ml-auto"></div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ summaries.programs }}
                </div>
                <div class="text-base text-slate-500 mt-1">Total Programs</div>
              </div>
            </div>
          </div>
          <div
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
            v-if="summaries && summaries.courses"
            @click="router.push({ name: 'courses' })"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <UserIcon class="report-box__icon text-success" />
                  <div class="ml-auto"></div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ summaries.courses }}
                </div>
                <div class="text-base text-slate-500 mt-1">Total Courses</div>
              </div>
            </div>
          </div>
          <div
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
            v-if="summaries && summaries.classrooms"
            @click="router.push({ name: 'classrooms' })"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <UserIcon class="report-box__icon text-success" />
                  <div class="ml-auto"></div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ summaries.classrooms }}
                </div>
                <div class="text-base text-slate-500 mt-1">Total Classrooms</div>
              </div>
            </div>
          </div>
          <div
            class="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
            v-if="summaries && summaries.attendances"
            @click="router.push({ name: 'attendance-records' })"
          >
            <div class="report-box zoom-in">
              <div class="box p-5">
                <div class="flex">
                  <UserIcon class="report-box__icon text-success" />
                  <div class="ml-auto"></div>
                </div>
                <div class="text-3xl font-medium leading-8 mt-6">
                  {{ summaries.attendances }}
                </div>
                <div class="text-base text-slate-500 mt-1">Total Attendances</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ReportDonutChart2 from "@/components/report-donut-chart-2/Main.vue";
import ReportBarChart1 from "@/components/report-bar-chart-1/Main.vue";
import ReportMap from "@/components/report-map/Main.vue";
import SimpleLineChart3 from "@/components/simple-line-chart-3/Main.vue";
import SimpleLineChart4 from "@/components/simple-line-chart-4/Main.vue";

import { ref, provide, onMounted } from "vue";
import { http } from "@/httpCommons";
import Toastify from "toastify-js";
import router from "@/router";

const summaries = ref({});

onMounted(() => {
  http.get("dashboard/summaries").then((response) => {
    summaries.value = response.data;
  });
});
</script>
