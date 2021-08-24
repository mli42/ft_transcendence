<template>
  <div id="HomePage" class="flexAlignCol">
    <div class="homeTop flexAlignRow">
      <img src="~/assets/img/logo500.png" alt="Deluxe Pong Logo">
      <hr class="topHR" />
      <div class="topContent">
        <h1>Your Home</h1>
      </div>
    </div>

    <div class="homeBot flexAlignRow">
      <div class="homeLeft">
        <ProfileFriendList :user="user"></ProfileFriendList>
      </div>

      <hr class="topHR" style="visibility: hidden;" />

      <div class="homeRight primaryContent GameHistoryContainer">
        <p>Current games</p>
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
  name: 'root-index',
  head(): object {
    return {
      title: "Home Page" as String,
    };
  },
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    user(): any {
      return this.$store.state.user;
    },
  },
});
</script>

<style scoped lang="scss" src="./index.scss">
</style>
