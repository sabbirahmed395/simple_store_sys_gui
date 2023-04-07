<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">{{ formTitle }}</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-3">
        <!-- BEGIN: Form Layout -->
        <div class="intro-y box p-5">
          <div>
            <label for="name" class="form-label">Name <small>*</small></label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control w-full"
              placeholder="Name"
            />
            <div class="text-danger mt-2" v-if="errors && errors.name">
              {{ errors.name[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="email" class="form-label">Email <small>*</small></label>
            <input
              id="email"
              v-model="email"
              type="text"
              class="form-control w-full"
              placeholder="user@example.com"
            />
            <div class="text-danger mt-2" v-if="errors && errors.email">
              {{ errors.email[0] }}
            </div>
          </div>
          <div class="mt-3">
            <label for="password" class="form-label">Password <small>*</small></label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control w-full"
              placeholder="password"
            />
            <div class="text-danger mt-2" v-if="errors && errors.password">
              {{ errors.password[0] }}
            </div>
          </div>
         
          <div class="mt-3">
            <label for="role" class="form-label">Role <small>*</small></label>
            <select id="role" v-model="role" data-placeholder="Select a role" data-search="true" class="tail-select w-full" multiple>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="store executive">Store Executive</option>
            </select>
            <!-- <select
              id="role"
              v-model="role"
              class="w-full"
              style="border-radius: 4px"
              miltiple
            >
              <option selected disabled>-- Select a Role --</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
              <option value="store executive">Store Executive</option>
            </select> -->
            <div class="text-danger mt-2" v-if="errors && errors.role">
              {{ errors.role[0] }}
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
let email = ref("");
let password = ref("");
let role = ref({});
let errors = ref({});

let user = ref({});

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
    formTitle.value = "Create New User";
    mode.value = "create";
  } else {
    formTitle.value = "Edit User";
    mode.value = "edit";
    try {
      let res = http
        .get(`users/${id.value}`)
        .then((response) => {
          if (response.status === 200) {
            user.value = response.data.data;
            name.value = response.data.data.name;
            email.value = response.data.data.email;
            role.value = response.data.data.roles;
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
  formData.email = email.value;
  formData.password = password.value;
  formData.role = role.value;

  try {
    if (mode.value === "create") {
      let res = await http
        .post("users", formData)
        .then((response) => {
          if (response.status === 201) {
            router.push({ name: "users" });
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
        .put(`users/${id.value}`, formData)
        .then((response) => {
          if (response.status === 200) {
            router.push({ name: "users" });
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
  email,
  password,
  role,
  errors,
  user,
  formTitle,
  save,
});
</script>
