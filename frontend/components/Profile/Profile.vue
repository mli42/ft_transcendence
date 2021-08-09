<template>
  <div id="profileMain">
    <div>
      <!-- Left side content (pp, buttons, friend list) -->
      <img src="" :alt="`${this.username}'s profile picture`" class="pp" />
    </div>

    <div>
      <p class="bigUsername">{{this.username}}</p>
      <div class="primaryContent">
        <div>
          <Iconify iconName="ant-design:trophy-outlined"
          param="color=white" class="BigIcon" ></Iconify>
        </div>
        <div>
          <Iconify iconName="ant-design:clock-circle-outlined"
          param="color=white" class="BigIcon" ></Iconify>
        </div>
      </div>
      <div class="primaryContent"></div>
      <div class="primaryContent"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Profile',
  data() {
    return {
    };
  },
  props: ['username'],
});
</script>

<style scoped lang="scss" src="./Profile.scss">
</style>
