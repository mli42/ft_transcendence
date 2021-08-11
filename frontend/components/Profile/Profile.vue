<template>
  <div id="profileMain">
    <div id="profileLeft">
      <!-- Left side content (pp, buttons, friend list) -->
      <div class="pp">
        <img src="" :alt="`${user.username}'s profile picture`" />
      </div>

      <div v-if="!isMyself" class="modBtnContainer flexAlignRow">
        <ProfileModBtn v-if="!isMyFriend" class="modAddFriend" @toggled="modFriend('add')" icon="bx:bx-user-plus"></ProfileModBtn>
        <ProfileModBtn v-else class="modAddFriend" @toggled="modFriend('delete')" icon="bx:bx-user-minus"></ProfileModBtn>
        <ProfileModBtn class="modBan" @toggled="modBan" icon="jam:hammer"></ProfileModBtn>
        <ProfileModBtn class="modPromote" @toggled="modPromote" icon="bx:bx-key"></ProfileModBtn>
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
        <div> <div class="bullet lose"></div> <p>{{user.lost_game}} losses</p> </div>
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
      isMyself: (this.user.username == this.$store.state.user.username) as boolean,
      isMyFriend: this.$store.state.user.friends.includes(this.user.userId) as boolean,
    };
  },
  methods: {
    modFriend(toggle: string): void {
      const handleCatch: Function = (err: any) => { console.log(err.response.data.error) };

      if (toggle == 'add') {
        this.$axios.patch('/api/user/addFriend', {friend: this.user.userId})
        .catch(handleCatch);
      }
      else {
        this.$axios.delete('/api/user/deleteFriend', {friend: this.user.userId})
        .catch(handleCatch);
      }
      this.$nuxt.refresh();
    },
    modBan(): void {
      console.log("Banning user");
    },
    modPromote(): void {
      console.log("Promoting user");
    },
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
