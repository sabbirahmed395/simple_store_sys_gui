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
            <label for="name" class="form-label">Item Name <small>*</small></label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control w-full"
              placeholder="Item name"
            />
            <div class="text-danger mt-2" v-if="errors && errors.name">
              {{ errors.name[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="description" class="form-label">Description</label>
            <textarea v-model="description" name="description" id="description" cols="30" rows="10"></textarea>
            <div class="text-danger mt-2" v-if="errors && errors.description">
              {{ errors.description[0] }}
            </div>
          </div>
          <div class="mt-">
            <label for="status" class="form-label">Status <small>*</small></label>
            <select
              id="ststus"
              v-model="status"
              class="w-full"
              style="border-radius: 5px"
            >
              <option>-- Select a status --</option>
              <option v-for="(status, p) in ['active', 'inactive']" :key="p" :value="status">
                {{ status }}
              </option>
            </select>
            <div class="text-danger mt-2" v-if="errors && errors.status">
              {{ errors.status[0] }}
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

let name = ref("");
let description = ref("");
let status = ref("");
let errors = ref({});

let item = ref({});

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
    formTitle.value = "Create New Item";
    mode.value = "create";
  } else {
    formTitle.value = "Edit Item";
    mode.value = "edit";
    try {
      let res = http
        .get(`items/${id.value}`)
        .then((response) => {
          if (response.status === 200) {
            item.value = response.data.data;
            name.value = response.data.data.name;
            description.value = response.data.data.description;
            status.value = response.data.data.status;
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
});

const save = async () => {
  let formData = {};
  formData.name = name.value;
  formData.description = description.value;
  formData.status = status.value;

  try {
    if (mode.value === "create") {
      let res = await http
        .post("items", formData)
        .then((response) => {
          if (response.status === 201) {
            router.push({ name: "items" });
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
        .put(`items/${id.value}`, formData)
        .then((response) => {
          if (response.status === 200) {
            router.push({ name: "items" });
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
  name,
  errors,
  item,
  formTitle,
  save,
});
</script>
