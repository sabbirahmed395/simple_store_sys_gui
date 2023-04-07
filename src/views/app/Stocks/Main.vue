<template>
  <div>
    <h2 class="intro-y text-lg font-medium mt-10">Stock List</h2>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
        <button
          class="btn btn-primary shadow-md mr-2"
          v-if="isStoreExecutive"
          @click="router.push({ name: 'create-new-stock' })"
        >
          Add New Stock
        </button>

        <div class="hidden md:block mx-auto text-slate-500" v-text="listComment"></div>
        <!-- <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0">
        <div class="w-56 relative text-slate-500">
          <input
            type="text"
            class="form-control w-56 box pr-10"
            placeholder="Search..."
          />
          <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
        </div>
      </div> -->
      </div>
      <!-- BEGIN: Data List -->
      <div class="intro-y col-span-12 overflow-auto lg:overflow-visible">
        <table class="table table-report -mt-2">
          <thead>
            <tr>
              <!-- <th class="whitespace-nowrap">SERIAL</th> -->
              <th class="whitespace-nowrap">ITEM NAME</th>
              <th class="whitespace-nowrap">SUPPLIER NAME</th>
              <th class="whitespace-nowrap">PRICE</th>
              <th class="whitespace-nowrap">QUANTITY</th>
              <th class="text-center whitespace-nowrap" v-if="isStoreExecutive">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(stock, k) in stocks" :key="k" class="intro-x">
              <td class="font-medium whitespace-nowrap">{{ stock.item_name }}</td>
              <td class="font-medium whitespace-nowrap">{{ stock.supplier_name }}</td>
              <td class="font-medium whitespace-nowrap">{{ stock.price }}</td>
              <td class="font-medium whitespace-nowrap">{{ stock.quantity }}</td>
              <td class="table-report__action w-56" v-if="isStoreExecutive">
                <div class="flex justify-center items-center">
                  <a
                    class="flex items-center mr-3"
                    href="javascript:;"
                    @click="
                      router.push({ name: 'edit-stock', params: { id: stock.id } })
                    "
                  >
                    <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
                  </a>
                  <a
                    class="flex items-center text-danger"
                    href="javascript:;"
                    @click="actionDelete(stock.id)"
                  >
                    <Trash2Icon class="w-4 h-4 mr-1" /> Delete
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
          @update:modelValue="getStocks"
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
let stocks = ref(null);
let meta = ref({ from: 0, to: 0, total: 0 });
let listComment = ref("");
const isStoreExecutive = ref(false);
const isAdmin = ref(false);
const isEmployee = ref(false);

onMounted(() => {
  getStocks();

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

const getStocks = async () => {
  try {
    let res = await http.get("stocks", { params: { page: page.value } });
    stocks.value = res.data.data;
    meta.value = res.data.meta;
    pageCount.value = meta.value.last_page;
    listComment.value = `Showing ${meta.value.from} to ${meta.value.to} of ${meta.value.total} Stocks`;
  } catch (err) {
    console.log(err);
  }
};

const actionDelete = async (stock_id) => {
  let deleteConsent = confirm("Are you sure you want to delete the Stock?");
  if (deleteConsent) {
    try {
      await http.delete(`stocks/${stock_id}`).then((response) => {
        if (response.status == 200) {
          Toastify({
            text: response.data.message,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#D32929",
            stopOnFocus: true,
          }).showToast();

          getStocks();
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};

defineExpose({
  stocks,
  meta,
  listComment,
  page,
  pageCount,
  actionDelete,
});
</script>
