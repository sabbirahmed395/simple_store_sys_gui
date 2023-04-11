<template>
  <div>
    <h2 class="intro-y text-lg font-medium mt-10" v-if="isAdmin">Requisition For Approval</h2>
    <h2 class="intro-y text-lg font-medium mt-10" v-if="isStoreExecutive">Requisition For Issue</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <div class="hidden md:block mx-auto text-slate-500" v-text="listComment"></div>
      </div>
      <!-- BEGIN: Data List -->
      <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
          <thead>
            <tr>
              <!-- <th class="whitespace-nowrap">SERIAL</th> -->
              <th class="whitespace-nowrap">DATE</th>
              <th class="whitespace-nowrap">ITEM COUNT</th>
              <th class="whitespace-nowrap">ITEM QUANTITY</th>
              <th class="whitespace-nowrap">STATUS</th>
              <th class="text-center whitespace-nowrap" v-if="isEmployee">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(requisition, r) in requisitions" :key="r" class="intro-x">
              <td class="font-medium whitespace-nowrap">{{ requisition.date }}</td>
              <td class="font-medium whitespace-nowrap">{{ requisition.requisition_for }}</td>
              <td class="font-medium whitespace-nowrap">{{ requisition.item_count }}</td>
              <td class="font-medium whitespace-nowrap">{{ requisition.item_quantity }}</td>
              <td class="font-medium whitespace-nowrap">{{ requisition.status }}</td>
              <td class="table-report__action w-56" v-if="isStoreExecutive || isAdmin">
                <div class="flex justify-center items-center">
                  <a
                    class="flex items-center mr-3"
                    href="javascript:;"
                    @click="
                      router.push({ name: 'view-requisition', params: { id: requisition.id } })
                    "
                  >
                    <EyeIcon class="w-4 h-4 mr-1" /> View
                  </a>
                  <a
                    class="flex items-center mr-3"
                    href="javascript:;"
                    v-if="isStoreExecutive && requisition.status == 'issued'"
                    @click="
                      router.push({ name: 'view-requisition-issue-details', params: { id: requisition.id } })
                    "
                  >
                    <EyeIcon class="w-4 h-4 mr-1" /> View Issue Details
                  </a>
                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    v-if="isAdmin && requisition.status == 'pending'"
                    @click="actionApprove(requisition.id)"
                  >
                    <!-- <Trash2Icon class="w-4 h-4 mr-1" /> -->
                     Approve
                  </a>
                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    v-if="isStoreExecutive && requisition.status == 'approved'"
                    @click="actionIssue(requisition.id)"
                  >
                    <!-- <Trash2Icon class="w-4 h-4 mr-1" /> -->
                     Issue (System FIFO)
                  </a>
                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    v-if="isStoreExecutive && requisition.status == 'approved'"
                    @click="
                      router.push({ name: 'view-requisition-issue-manual', params: { id: requisition.id } })
                    "
                  >
                    <!-- <Trash2Icon class="w-4 h-4 mr-1" /> -->
                     Issue (Manual)
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- END: Data List -->
      <!-- BEGIN: Pagination -->
      <div
        class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center"
      >
        <v-pagination
          v-model="page"
          :pages="pageCount"
          :range-size="1"
          active-color="#014f3d60"
          @update:modelValue="getRequisitions"
        />
      </div>

      <!-- END: Pagination -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { http } from "@/httpCommons";
import router from "@/router";
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import Toastify from "toastify-js";

let page = ref(1);
let pageCount = ref(null);
let requisitions = ref(null);
let meta = ref({ from: 0, to: 0, total: 0 });
let listComment = ref("");
const isStoreExecutive = ref(false);
const isAdmin = ref(false);
const isEmployee = ref(false);

onMounted(() => {
  getRequisitions();

  let user = JSON.parse(localStorage.getItem("auth"));
  let roles = JSON.parse(localStorage.getItem("roles"));

  if (user && roles) {
    if (roles.includes("store executive")) {
      isStoreExecutive.value = true;
      isAdmin.value = false;
    } else if (roles.includes("admin")) {
      isStoreExecutive.value = false;
      isAdmin.value = true;
    } else {
      isStoreExecutive.value = false;
      isAdmin.value = false;
      isEmployee.value = true;
    }
  }
});

const getRequisitions = async () => {
  try {
    let res = await http.get("requisitions", { params: { page: page.value } });
    requisitions.value = res.data.data;
    meta.value = res.data.meta;
    pageCount.value = meta.value.last_page;
    listComment.value = `Showing ${meta.value.from} to ${meta.value.to} of ${meta.value.total} Requisitions`;
  } catch (err) {
    console.log(err);
  }
};

const actionApprove = async (requisition_id) => {
  let approveConsent = confirm("Are you sure you want to apprpve the Requisition?");
  if (approveConsent) {
    try {
      await http.patch(`requisitions/${requisition_id}/approve`).then((response) => {
        if (response.status == 200) {
          Toastify({
            text: response.data.message,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#25b536",
            stopOnFocus: true,
          }).showToast();

          getRequisitions();
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const actionIssue = async (requisition_id) => {
  let issueConsent = confirm("Are you sure you want to issue the Requisition?");
  if (issueConsent) {
    try {
      await http.patch(`requisitions/${requisition_id}/issue`).then((response) => {
        if (response.status == 200) {
          Toastify({
            text: response.data.message,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#25b536",
            stopOnFocus: true,
          }).showToast();

          getRequisitions();
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};

defineExpose({
  requisitions,
  meta,
  listComment,
  page,
  pageCount,
  actionApprove,
  actionIssue,
});
</script>
