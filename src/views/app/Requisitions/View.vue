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
            <h2 class="text-3xl">Details</h2>
            <div>
              <strong>Requisition Date: </strong> {{ requisition.created_at }}
            </div>
            <div v-if="requisition.user && requisition.user.name">
              <strong>Reqquisition For: </strong> {{ requisition.user.name }}
            </div>
            <div>
              <strong>Status: </strong> {{ requisition.status }}
            </div>
            <h3 class="text-2xl">Particular</h3>
            <template v-for="(detail, d) in requisition.details" :key="d" style="border-bottom: 1px solid #ccc;">
              <div>
                <strong>Item Name: </strong>{{ detail.item_name }}  
              </div>
              <div>
                <strong>Quantity: </strong>{{ detail.quantity }}
              </div>
            </template>
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

let id = ref(null);

onMounted(() => {
  const route = useRoute();
  id.value = parseInt(route.path.split("/")[2]);

  
    try {
      let res = http
        .get(`requisitions/${id.value}`)
        .then((response) => {
          if (response.status === 200) {
            requisition.value = response.data.data;
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

});

defineExpose({
  requisition
});
</script>
