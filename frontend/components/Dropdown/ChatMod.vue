<template>
    <div class="container">
      <h2>{{ toselect }}</h2>
      <div class="selectBox">
        <div class="selected" @click="rotate = !rotate; toggleModal()">
          <img :class="{ rotate: rotate }" src="~/assets/img/arrow.svg" >
        </div>
        <hr>
        <form class="options">
          <ul v-if="show">
              <li v-for="(item, index) in items" :key="index">
                <div class="option">
                  <input type="radio" :value="item" class="item" name="category" v-model="result"/>
                  <label for="item">{{ item }}</label>
                </div>
              </li>
          </ul>
        </form>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {UserStatus, User} from '~/types/chatTypes';
export default Vue.extend({
  name: 'dropdown',
  layout: 'default',
  data(): any {
    return {
      show: false as boolean,
      result: 0 as number,
      rotate: false as boolean,
    }
  },
  methods: {
    toggleModal(): void{
        this.show = !this.show;
    },
  },
  watch:{
    result(){
      if (this.action === 'ban')
        this.$nuxt.$emit('send-banTime', this.result);
      if (this.action === 'mute')
        this.$nuxt.$emit('send-muteTime', this.result);
    },
  },
  props: ['toselect', 'items', 'action'],
});
</script>

<style scoped lang="scss" src="./Dropdown.scss">
</style>