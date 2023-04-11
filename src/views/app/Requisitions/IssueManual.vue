<template>
  <div>
    <div class="intro-y flex items-center mt-8">
      <h2 class="text-lg font-medium mr-auto">Requisition Issue in Manual</h2>
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
                  <th class="text-right">Available Quantity</th>
                  <th class="text-right">Requisition Quantity</th>
                  <th class="text-right">Issued Quantity</th>
                  <th class="text-right">Price*Qty</th>
                  <th class="text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(detail, d) in requisition.details" :key="d" style="border-bottom: 1px solid #ccc;">
                  <tr>
                    <td>{{ d + 1  }}</td>
                    <td>{{ detail.item_name }} </td>
                    <td class="text-right">{{ stockAvailable[detail.item_id]?stockAvailable[detail.item_id]:0 }}</td>
                    <td class="text-right">{{ detail.quantity }}</td>
                    <td class="text-right">
                      <input type="number" v-model="issuedQuantity[d]" @keyup="calculatePriceNValue(d)">
                    </td>
                    <td class="text-right">{{ price[d] }}</td>
                    <td class="text-right">{{ value[d] }}</td>
                  </tr>
                </template>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>Total</td>
                  <td>{{ total }}</td>
                </tr>
            </tbody>
          </table>
          <button
            class="btn btn-primary shadow-md mr-2"
            @click="actionIssue()"
          >
            Issue
          </button>
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
let stockDetails = ref([]);
let stockAvailable = ref([]);
let stocks = ref([]);
let requisitionsItems = ref([]);
let details = ref({});
let issue = ref({});
let user = ref({});
let total = ref(0);
let price = ref([]);
let value = ref([]);
let issuedQuantity = ref([]);

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
            requisitionsItems.value = response.data.data.details.map(detail => {
              return detail.id
            });

            getStockDetailsByItemId(requisitionsItems.value);
    
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

const actionIssue = async () => {
  let issueConsent = confirm("Are you sure you want to issue the Requisition?");
  if (issueConsent) {
    try {
      await http.patch(`requisitions/${id.value}/issue`).then((response) => {
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

          router.push({ name: "requisitions" });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
};

const getRequisitionQuantity = (detail_id) => {
  return requisitionQuantity.value[detail_id];
};

const getStockDetailsByItemId = async (requisitionsItems) => {
  console.log(requisitionsItems)
  await http.get(`stocks/available`, { params: { ids: requisitionsItems } })
    .then(response => {
      if (response.status === 200) {
        stockDetails.value = response.data.data;
        stockAvailable.value = response.data.data.available;
        stocks.value = response.data.data.stocks;
      }
    })
    .catch(error => {
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
    })
}

const calculatePriceNValue = (index) => {
  //console.log(index);
  //console.log(issuedQuantity.value[index]); // value of the input
  // if inputed quantity is greater than requisition quantity, set to requisition quantity
  if (issuedQuantity.value[index] > requisition.value.details[index].quantity) {
    issuedQuantity.value[index] = requisition.value.details[index].quantity;
  }
  let itemId = requisition.value.details[index].item_id;
  let itemName = requisition.value.details[index].item_name;
  //console.log(`ItemId: ${itemId}`); // item id

  let issuableQuantity = issuedQuantity.value[index]
  //console.log(`Issuable quantity: ${issuableQuantity}`);

  if (issuableQuantity > stockAvailable.value[itemId]) {
    Toastify({
        text: 'Insufficient stock for ${itemName}',
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

  // start issueing and pricing process
  let itemStocks = stocks.value[itemId];
  let priceInTxt = '';
  let priceInValue = 0;
  let remaining = 0;
  remaining = parseInt(issuableQuantity);
  itemStocks.forEach(stock => {
    let qty = 0;
    if (remaining <= 0) return; // break the loop
    let available = stock.avaialble;
    available = parseInt(available);
    console.log(`stock avaialble ${available}`);
    if (stock.avaialble > 0) {
    console.log(`remaining ${remaining}`);
      remaining = remaining - available

      if (remaining > 0) {
        console.log('remaining is greater than 0')
        qty = available;
      }

      if (remaining < 0) {
        console.log('remaining is less than 0')
        qty = available + remaining;
      }

      console.log(`qty ${qty}`)
      priceInTxt = priceInTxt + `\n ${qty} x ${stock.price}`;
      priceInValue = priceInValue + qty*parseFloat(stock.price);
    }
  });
  console.log(`priceInText ${priceInTxt}`);
  price.value[index] = priceInTxt;
  console.log(`priceInValue ${priceInValue}`);
  value.value[index] = priceInValue;
  //total.value = total.value + priceInValue;
  total.value = value.value.reduce((a, b) => a + b, 0)
  total.value = parseFloat(total.value).toFixed(2);
  //itemStocks.map(stock => {
  //  if (stock.available)
  //})
}

defineExpose({
  requisition,
  stockAvailable,
  stocks,
  details,
  issue,
  price,
  value,
  total,
  issuedQuantity
});
</script>
