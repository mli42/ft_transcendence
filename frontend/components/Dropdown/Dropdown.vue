<template>
    <div class="container">
      <h2>{{ toselect }}</h2>
      <div class="selectBox">
        <div class="selected">
          <!-- <span>{{ result }} ...</span> -->
          <img src="~/assets/img/arrow.svg" @click="toggleModal(); fillTab(result)">
        </div>
        <hr>
        <form class="options">
          <ul  v-if="show">
              <li v-for="(item, index) in items" :key="index">
                <div class="option">
                  <input type="checkbox" :value="item" id="item" name="category" v-model="result"/>
                  <label for="item">{{ item.username }}</label>
                </div>
              </li>
          </ul>
        </form>
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
      show: false as boolean,
      result: [],
    }
  },
  methods: {
    toggleModal(): void{
        this.show = !this.show;
    }
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
    },
    fillTab:{
      type: Function,
      required: false,
    }
  },
});
</script>

<style scoped lang="scss" src="./Dropdown.scss">
</style>