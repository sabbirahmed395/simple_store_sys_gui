<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">{{ formTitle }}</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-3">
        <!-- BEGIN: Form Layout -->
        <div class="intro-y box p-5">
          <div class="mt-3">
            <label for="supplier" class="form-label">Supplier <small>*</small></label>
            <select
              id="supplier"
              v-model="supplier_id"
              class="w-full"
              style="border-radius: 5px"
            >
              <option>-- Select a Supplier --</option>
              <option v-for="(supplier, s) in suppliers" :key="s" :value="supplier.id">
                {{ supplier.name }}
              </option>
            </select>
            <div class="text-danger mt-2" v-if="errors && errors.supplier_id">
              {{ errors.supplier_id[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="item" class="form-label">Item <small>*</small></label>
            <select
              id="item"
              v-model="item_id"
              class="w-full"
              style="border-radius: 5px"
            >
              <option>-- Select an Item --</option>
              <option v-for="(item, i) in items" :key="i" :value="item.id">
                {{ item.name }}
              </option>
            </select>
            <div class="text-danger mt-2" v-if="errors && errors.item_id">
              {{ errors.item_id[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="price" class="form-label">Rate <small>*</small></label>
            <input
              id="price"
              v-model="price"
              type="text"
              class="form-control w-full"
              placeholder="Rate"
            />
            <div class="text-danger mt-2" v-if="errors && errors.price">
              {{ errors.price[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="quantity" class="form-label">Quantity <small>*</small></label>
            <input
              id="quantity"
              v-model="quantity"
              type="text"
              class="form-control w-full"
              placeholder="Quantity"
            />
            <div class="text-danger mt-2" v-if="errors && errors.quantity">
              {{ errors.quantity[0] }}
            </div>
          </div>
          <div class="text-right mt-5">
            <button type="button" class="btn btn-outline-secondary w-24 mr-1">
              Cancel
            </button>
            <button type="button" class="btn btn-primary w-24" @click="save">Save</button>
          </div>
        </div>
        <!-- END: Form Layout -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { http } from "@/httpCommons";
import router from "@/router";
import { useRoute } from "vue-router";
import Toastify from "toastify-js";

let supplier_id = ref("");
let item_id = ref("");
let price = ref("");
let quantity = ref("");
let errors = ref({});

let stock = ref({});

let suppliers = ref({});
let items = ref({});

let formTitle = ref("");

let mode = ref("");
let id = ref(null);

const editorConfig = {
  toolbar: {
    items: ["bold", "italic", "link"],
  },
};
const editorData = ref("<p>Content of the editor.</p>");

onMounted(() => {
  const route = useRoute();
  id.value = parseInt(route.path.split("/")[2]);

  if (isNaN(id.value)) {
    formTitle.value = "Create New Stock";
    mode.value = "create";
  } else {
    formTitle.value = "Edit Stock";
    mode.value = "edit";
    try {
      let res = http
        .get(`stocks/${id.value}`)
        .then((response) => {
          if (response.status === 200) {
            stock.value = response.data.data;
            supplier_id.value = response.data.data.supplier_id;
            item_id.value = response.data.data.item_id;
            price.value = response.data.data.price;
            quantity.value = response.data.data.quantity;
          }
        })
        .catch((error) => {
          if (error.response.status === 404) {
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
          }
        });
    } catch (err) {
      // console.log(err)
    }
  }

  getSuppliers();

  getItems();

});

const getSuppliers = async () => {
  try {
    let res = await http.get("suppliers", { params: { per_page: -1 } });
    suppliers.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
};

const getItems = async () => {
  try {
    let res = await http.get("items", { params: { per_page: -1 } });
    items.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
};

const save = async () => {
  let formData = {};
  formData.supplier_id = supplier_id.value;
  formData.item_id = item_id.value;
  formData.price = price.value;
  formData.quantity = quantity.value;

  try {
    if (mode.value === "create") {
      let res = await http
        .post("stocks", formData)
        .then((response) => {
          if (response.status === 201) {
            router.push({ name: "stocks" });
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            errors.value = error.response.data.errors;
            console.log(errors.value);
          }
        });
    }

    if (mode.value === "edit") {
      let res = await http
        .put(`stocks/${id.value}`, formData)
        .then((response) => {
          if (response.status === 200) {
            router.push({ name: "stocks" });
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            errors.value = error.response.data.errors;
            console.log(errors.value);
          }
        });
    }
  } catch (err) {
    // console.log(err)
  }
};

defineExpose({
  supplier_id,
  item_id,
  price,
  quantity,
  errors,
  stock,
  formTitle,
  save,
});
</script>
