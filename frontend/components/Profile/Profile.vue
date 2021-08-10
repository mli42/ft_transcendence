<template>
  <div id="profileMain">
    <div id="profileLeft">
      <!-- Left side content (pp, buttons, friend list) -->
      <div class="pp">
        <img src="" :alt="`${this.username}'s profile picture`" />
      </div>

      <div class="friendContainer">
        <p>Friends</p> <hr />
      </div>
    </div>

    <div>
      <p class="bigUsername">{{this.username}}</p>

      <div class="primaryContent primaryContentUp flexAlignRow">
        <div class="flexHVcenter flexAlignRow">
          <Iconify iconName="ant-design:trophy-outlined"
          param="color=white" class="BigIcon" ></Iconify>
          <p>442 elo</p>
        </div>
        <div class="flexHVcenter flexAlignRow">
          <Iconify iconName="ant-design:clock-circle-outlined"
          param="color=white" class="BigIcon" ></Iconify>
          <p>X</p>
        </div>
      </div>

      <div class="primaryContent primaryContentUp flexAlignRow">
        <div> <div class="bullet win"></div> <p>245 wins</p> </div>
        <div> <div class="bullet lose"></div> <p>442 looses</p> </div>
        <div> <div class="bullet ratio"></div> <p>0.19 ratio</p> </div>
      </div>
      <div class="primaryContent GameHistoryContainer">
        <p>Game History</p>
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
