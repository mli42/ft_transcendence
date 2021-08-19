<template>
  <div id="profileMain">
    <div id="profileLeft">
      <!-- Left side content (pp, buttons, friend list) -->
      <div class="pp">
        <Avatar :isBig=true :user="user"></Avatar>
      </div>

      <div v-if="!isMyself" class="modBtnContainer flexAlignRow">
        <ProfileModBtn class="modAddFriend" @toggled="modFriend" :icon="modFriendIcon"></ProfileModBtn>
        <ProfileModBtn v-if="myself.isAdmin" class="modBan" @toggled="modBan" :title="banTitle" icon="jam:hammer"></ProfileModBtn>
        <ProfileModBtn v-if="myself.isAdmin" class="modPromote" @toggled="modPromote" :title="adminTitle" icon="bx:bx-key"></ProfileModBtn>
      </div>

      <div class="friendContainer">
        <p>Friends</p> <hr />
        <p class="NoFriend" v-if="user.friends.length == 0">
          Search some profiles to add new friends!
        </p>
        <div v-else class="friendList">
          <div v-for="(userId, index) in user.friends" :key="index">
            <ProfileFriendCard :userId="userId"></ProfileFriendCard>
          </div>
        </div>
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
      myself: this.$store.state.user as any,
      isMyself: (this.user.username == this.$store.state.user.username) as boolean,
      isMyFriend: this.$store.state.user.friends.includes(this.user.userId) as boolean,
    };
  },
  methods: {
    modFriend(): void {
      let url: string;
      let method: any;
      const handleThen: any = () => { this.isMyFriend = !this.isMyFriend; };
      const handleCatch: any = (err: any) => { console.log(err.response.data.error) };
      const data: any = { userId: this.user.userId };

      if (!this.isMyFriend) {
        url = '/api/user/addFriend';
        method = 'patch';
      }
      else {
        url = '/api/user/deleteFriend';
        method = 'delete';
      }
      this.$axios.request({url, data, method})
      .then(handleThen)
      .catch(handleCatch);
    },
    modBan(): void {
      this.$axios.patch(`/api/user/updateIsBan?userId=${this.user.userId}`, {
        toggle: !this.user.isBan,
      })
      .then(() => { this.user.isBan = !this.user.isBan; })
      .catch(() => {});
    },
    modPromote(): void {
      this.$axios.patch(`/api/user/updateIsAdmin?userId=${this.user.userId}`, {
        toggle: !this.user.isAdmin,
      })
      .then(() => { this.user.isAdmin = !this.user.isAdmin; })
      .catch(() => {});
    },
  },
  computed: {
    modFriendIcon(): string {
      return (!this.isMyFriend) ? 'bx:bx-user-plus' : 'bx:bx-user-minus';
    },
    ratio(): number | string {
      return (this.user.ratio == -1) ? 'N/A' : this.user.ratio;
    },
    banTitle(): string {
      return this.user.isBan ? 'Un-ban user' : 'Ostracize user';
    },
    adminTitle(): string {
      return this.user.isAdmin ? 'Downgrade user' : 'Promote user as admin';
    },
  },
  props: ['user'],
});
</script>

<style scoped lang="scss" src="./Profile.scss">
</style>
