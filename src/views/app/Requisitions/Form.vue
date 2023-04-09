<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">{{ formTitle }}</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-3">
        <!-- BEGIN: Form Layout -->
        <div class="intro-y box p-5">
          <template v-for="(detail, d ) in details" :key="d" style="border-bottom: 1px solid #ccc; padding: 10px;">
            <div class="mt-3">
              <label for="item">Item <small>*</small></label>
              <select id="item" class="w-full" style="border-radius: 5px" v-model="details[d].item_id">
                <option>-- Select an Item --</option>
                <option v-for="(item, i) in items" :key="i" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
            <div class="mt-3">
              <label for="quantity">Quantity <small>*</small></label>
              <input type="text" id="quantity" class="form-control w-full" placeholder="Quantity" v-model="details[d].quantity">
            </div>
          </template>
          <div class="text-left mt-5">
            <button type="button" class="btn btn-outline-secondary w-24 mr-1" @click="moreItem">
              <PlusIcon class="w-4 h-4 mr-1" /> More
            </button>
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

let requisition = ref({});

let details = ref({});

let items = ref({});

let formTitle = ref("");
let errors = ref([]);

let mode = ref("");
let id = ref(null);

const editorConfig = {
  toolbar: {
    items: ["bold", "italic", "link"],
  },
};
const editorData = ref("<p>Content of the editor.</p>");

onMounted(() => {
  details.value = [
    {
      item_id: null,
      quantity: 1,
    }
  ];

  const route = useRoute();
  id.value = parseInt(route.path.split("/")[2]);

  if (isNaN(id.value)) {
    formTitle.value = "Create New Requisition";
    mode.value = "create";
  } else {
    formTitle.value = "Edit Requisition";
    mode.value = "edit";
    try {
      let res = http
        .get(`requisitions/${id.value}`)
        .then((response) => {
          if (response.status === 200) {
            requisition.value = response.data.data;
            details.value = response.data.data.details.map((detail) => {
              return {
                item_id: detail.item_id,
                quantity: detail.quantity
              }
            });
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

  getItems();

});


const moreItem = () => {
  details.value.push({
      item_id: null,
      quantity: 1,
    });
}

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
  formData.details = details.value;

  try {
    if (mode.value === "create") {
      let res = await http
        .post("requisitions", formData)
        .then((response) => {
          if (response.status === 201) {
            router.push({ name: "my_requisitions" });
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
        .put(`requisitions/${id.value}`, formData)
        .then((response) => {
          if (response.status === 200) {
            router.push({ name: "my_requisitions" });
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
  requisition,
  items,
  details,
  errors,
  formTitle,
  save,
});
</script>
