<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">{{ formTitle }}</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="intro-y col-span-12 lg:col-span-12">
        <!-- BEGIN: Form Layout -->
        <div class="intro-y box p-5">
          <div class="mt-3">
            <h2 class="text-3xl">Details</h2>
            <div v-if="requisition.created_at">
              <strong>Requisition Date: </strong> {{ requisition.created_at_prety }}
            </div>
            <div v-if="requisition.user && requisition.user.name">
              <strong>Reqquisition For: </strong> {{ requisition.user.name }}
            </div>
            <div v-if="requisition.status">
              <strong>Status: </strong> {{ requisition.status }}
            </div>
            <h3 class="text-2xl">Particular</h3>
            <table class="table table-report -mt-2">
              <thead>
                <tr>
                  <th>Serial</th>
                  <th>Item Name</th>
                  <th class="text-right">Requisition Quantity</th>
                  <th class="text-right">Issued Quantity</th>
                  <th class="text-right">Rate</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(issue, d) in requisition.issue" :key="d" style="border-bottom: 1px solid #ccc;">
                  <tr>
                    <td>{{ d + 1  }}</td>
                    <td>{{ issue.stock.item.name }} </td>
                    <td class="text-right">{{ getRequisitionQuantity(issue.requisition_detail_id) }}</td>
                    <td class="text-right">
                      {{ issue.quantity }}
                      <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5"><b>Stock Number: </b>{{ issue.stock.id }}</div>
                    </td>
                    <td class="text-right">{{ issue.stock.price }}</td>
                    <td class="text-right">{{ issue.stock.price * issue.quantity }}</td>
                  </tr>
                </template>
            </tbody>
            <tfoot>
              <tr>
                <th colspan="2" class="text-right">Total</th>
                <th colspan="2" class="text-right">{{ requisition.item_quantity }}</th>
                <th colspan="2" class="text-right">{{ total }}</th>
              </tr>
            </tfoot>
          </table>
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
let requisitionQuantity = ref([]);
let details = ref({});
let issue = ref({});
let user = ref({});
let total = ref(0);

let id = ref(null);

onMounted(() => {
  const route = useRoute();
  id.value = parseInt(route.path.split("/")[2]);

  
    try {
      let res = http
        .get(`requisitions/${id.value}/issued-details`)
        .then((response) => {
          if (response.status === 200) {
            requisition.value = response.data.data;
            response.data.data.details.map(detail => {
              requisitionQuantity.value[detail.id] = detail.quantity
            })

            response.data.data.issue.map(issue => {
              total.value += (parseFloat(issue.stock.price) * parseFloat(issue.quantity));
            })

            details.value = response.data.data.details;
            issue.value = response.data.data.issue;
            user.value = response.data.data.user;
          }
        })
        .catch((error) => {
          if (error.response && error.response.status && error.response.status === 404) {
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

const getRequisitionQuantity = (detail_id) => {
  return requisitionQuantity.value[detail_id];
};

defineExpose({
  requisition,
  details,
  issue
});
</script>
