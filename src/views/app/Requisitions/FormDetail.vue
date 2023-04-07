<template>
    <div style="border-bottom: 1px solid #ccc; padding: 10px;">
        <div class="mt-3">
            <label for="item" class="form-label">Item <small>*</small></label>
            <select
              id="item"
              v-model="detail.item_id"
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
            <label for="quantity" class="form-label">Quantity <small>*</small></label>
            <input
              id="quantity"
              v-model="detail.quantity"
              type="text"
              class="form-control w-full"
              placeholder="Quantity"
            />
            <div class="text-danger mt-2" v-if="errors && errors.quantity">
              {{ errors.quantity[0] }}
            </div>
        </div>
    </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    props: {
      items: Object,
      edit: Object
    },
    setup(props) {
      const count = ref(0)

      // expose to template and other options API hooks
      return {
        count
      }
    },

    mounted() {
      console.log(this.count) // 0
    }

    // return {

    // }
  }
</script>