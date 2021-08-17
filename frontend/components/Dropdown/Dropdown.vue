<template>
    <div class="container">
      <h2>{{ toselect }}</h2>
      <div class="selectBox">
        <div class="selected">
          <span>({{ value[0] }} + {{ value.length - 1 }} others)</span>
        </div>
        <hr>
        <div class="options">
          <ul>
              <li v-for="(item, index) in items" :key="index">
                <div class="option">
                  <input type="checkbox" class="radio" id="item" name="category" />
                  <label for="item">{{ item }}</label>
                </div>
              </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'dropdown',
  layout: 'default',
  data(): any {
    return {
    }
  },
  methods: {
  },
  props: {
    toselect: {
      type: String,
      required: true,
    },
    items: {
      type: [],
      required: true,
    },
    value:{
      type: [],
      required: true,
    }
  },
});
</script>

<style scoped lang="scss" src="./Dropdown.scss">
</style>