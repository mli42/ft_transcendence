<template>
  <div>
  <div id="adminMain" class="flexAlignCol useWholePage">
    <h1>Admin View</h1>

    <!-- Stats -->
    <h2>Some stats</h2>
    <div class="stats flexAlignRow flexHVcenter">
      <div class="oneStat flexHVcenter"> <p># of Admins: {{adminList.length}}</p> </div>
      <div class="oneStat flexHVcenter"> <p># of Users: {{allUsers.length}}</p> </div>
    </div>

    <template v-if="$fetchState.pending == false">
    <!-- List of admins -->
    <overflowContainer
    width="664px" heightMin="250px" heightMax="458px" label="List of administrators">
      <adminCard v-for="(user, index) in adminList" :key="index"
      :user="user" @downgradeAdmin="downgradeAdmin(user, index)"></adminCard>
    </overflowContainer>

    <hr style="margin: 16px; visibility: hidden;" />

    <!-- List of users -->
    <overflowContainer
    width="664px" heightMin="250px" heightMax="458px" label="List of users">
      <adminCardUserCard v-for="(user, index) in allUsers" :key="index"
      :user="user" @toggleBanUser="toggleBanUser(user, index)"
      @promoteUser="reqAdminState(user, index, promoteUser)" @downgradeUser="reqAdminState(user, index, downgradeUser)"
      ></adminCardUserCard>
    </overflowContainer>
    <hr style="margin: 16px; visibility: hidden;" />
    </template>

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
  data() {
    return {
      adminList: [] as any,
      allUsers: [] as any,
    };
  },
  methods: {
    findIndexUserID(array: any, userId: string): number {
      const index: number = array.findIndex((findUser: any) => findUser.userId === userId);
      return index;
    },
    downgradeAdmin(user: any, index: number): void {
      this.$axios.patch(`/api/user/updateIsAdmin?userId=${user.userId}`, {
        toggle: false,
      })
      .then(() => {
        this.$mytoast.succ(`User ${user.username} downgraded`);
        this.adminList.splice(index, 1);
        const allUsersIndex: number = this.findIndexUserID(this.allUsers, user.userId);
        if (allUsersIndex != -1) {
          this.allUsers[allUsersIndex].isAdmin = false;
        }
      })
      .catch(this.$mytoast.defaultCatch);
    },
    toggleBanUser(user: any, index: number): void {
      this.$axios.patch(`/api/user/updateIsBan?userId=${user.userId}`, {
        toggle: !user.isBan,
      })
      .then(() => {
        this.allUsers[index].isBan = !user.isBan;
        const status: string = user.isBan ? 'banned' : 'un-banned';
        this.$mytoast.succ(`User ${user.username} ${status}`);
      })
      .catch(this.$mytoast.defaultCatch);
    },
    reqAdminState(user: any, index: number, callback: Function): void {
      this.$axios.patch(`/api/user/updateIsAdmin?userId=${user.userId}`, {
        toggle: !user.isAdmin,
      })
      .then(() => {
        this.allUsers[index].isAdmin = !user.isAdmin;
        callback(user, index);
        const status: string = user.isAdmin ? 'promoted' : 'downgraded';
        this.$mytoast.succ(`User ${user.username} ${status}`);
      })
      .catch(this.$mytoast.defaultCatch);
    },
    promoteUser(user: any, index: number): void {
    },
    downgradeUser(user: any, index: number): void {
    },
    sortUsers(userA: any, userB: any): number {
      return userA.username.localeCompare(userB.username);
    },
  },
  async fetch() {
    this.adminList = await this.$axios
    .get('/api/admin/allAdmin')
    .then((resp: any) => resp.data.sort(this.sortUsers))
    .catch(this.$mytoast.defaultCatch);

    this.allUsers = await this.$axios
    .get('/api/admin/allUsers')
    .then((resp: any) => resp.data.sort(this.sortUsers))
    .catch(this.$mytoast.defaultCatch);
  },
});
</script>

<style scoped lang="scss" src="./admin.scss">
</style>
