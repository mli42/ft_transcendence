<template>
  <div id="profileMain">
    <div id="profileLeft">
      <!-- Left side content (pp, buttons, friend list) -->
      <div class="pp">
        <img src="" :alt="`${user.username}'s profile picture`" />
      </div>

      <div class="friendContainer">
        <p>Friends</p> <hr />
        <p class="NoFriend" v-if="user.friends.length == 0">
          Search some profiles to add new friends!
        </p>
      </div>
    </div>

    <div>
      <p class="bigUsername">{{user.username}}</p>

      <div class="primaryContent primaryContentUp flexAlignRow">
        <div class="flexHVcenter flexAlignRow">
          <Iconify iconName="ant-design:trophy-outlined"
          param="color=white" class="BigIcon" ></Iconify>
          <p>{{user.elo}} elo</p>
        </div>
        <div class="flexHVcenter flexAlignRow" title="SignUp Date">
          <Iconify iconName="ant-design:clock-circle-outlined"
          param="color=white" class="BigIcon" ></Iconify>
          <p>{{user.sign_up_date}}</p>
        </div>
      </div>

      <div class="primaryContent primaryContentUp flexAlignRow">
        <div> <div class="bullet win"></div> <p>{{user.game_won}} wins</p> </div>
        <div> <div class="bullet lose"></div> <p>{{user.lost_game}} looses</p> </div>
        <div> <div class="bullet ratio"></div> <p>{{ratio}} ratio</p> </div>
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
  computed: {
    ratio(): number | string {
      return (this.user.ratio == -1) ? 'N/A' : this.user.ratio;
    },
  },
  props: ['user'],
});
</script>

<style scoped lang="scss" src="./Profile.scss">
</style>
