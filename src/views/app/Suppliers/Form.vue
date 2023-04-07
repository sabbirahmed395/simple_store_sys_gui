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
            <label for="name" class="form-label">Supplier Name <small>*</small></label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control w-full"
              placeholder="Supplier name"
            />
            <div class="text-danger mt-2" v-if="errors && errors.name">
              {{ errors.name[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="phone" class="form-label">Phone <small>*</small></label>
            <input
              id="phone"
              v-model="phone"
              type="text"
              class="form-control w-full"
              placeholder="(+880) XXXXXXXXXX"
            />
            <div class="text-danger mt-2" v-if="errors && errors.phone">
              {{ errors.phone[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="email" class="form-label">Email <small>*</small></label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control w-full"
              placeholder="user@example.com"
            />
            <div class="text-danger mt-2" v-if="errors && errors.email">
              {{ errors.email[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="address" class="form-label">Address</label>
            <textarea v-model="address" name="address" id="address" cols="30" rows="10"></textarea>
            <div class="text-danger mt-2" v-if="errors && errors.address">
              {{ errors.address[0] }}
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
let phone = ref("");
let email = ref("");
let address = ref("");
let status = ref("");
let errors = ref({});

let supplier = ref({});

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
    formTitle.value = "Create New Supplier";
    mode.value = "create";
  } else {
    formTitle.value = "Edit Supplier";
    mode.value = "edit";
    try {
      let res = http
        .get(`suppliers/${id.value}`)
        .then((response) => {
          if (response.status === 200) {
            supplier.value = response.data.data;
            name.value = response.data.data.name;
            phone.value = response.data.data.phone;
            email.value = response.data.data.email;
            address.value = response.data.data.address;
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
  formData.phone = phone.value;
  formData.email = email.value;
  formData.address = address.value;
  formData.status = status.value;

  try {
    if (mode.value === "create") {
      let res = await http
        .post("suppliers", formData)
        .then((response) => {
          if (response.status === 201) {
            router.push({ name: "suppliers" });
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
        .put(`suppliers/${id.value}`, formData)
        .then((response) => {
          if (response.status === 200) {
            router.push({ name: "suppliers" });
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
  phone,
  email,
  address,
  status,
  errors,
  supplier,
  formTitle,
  save,
});
</script>
