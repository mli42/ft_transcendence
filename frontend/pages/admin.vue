<template>
  <div>
  <div id="adminMain" class="flexAlignCol useWholePage">
    <h1>Admin View</h1>
    <div class="primaryContent GameHistoryContainer">
      <p>List of administrators</p>
      <hr />
      <div class="GameHistory">
        <!-- Replace with future v-for match card -->
        <div class="placeholder"></div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'admin',
  head(): object {
    return {
      title: "Admin View" as String,
    };
  },
});
</script>

<style scoped lang="scss" src="./admin.scss">
</style>
