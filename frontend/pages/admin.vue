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
    width="664px" heightMax="458px" label="List of administrators">
      <adminCard v-for="(user, index) in adminList" :key="index"
      :user="user" @downgradeUser="downgradeUser(user, index)"></adminCard>
    </overflowContainer>

    <!-- List of users -->
    <overflowContainer
    width="664px" heightMax="458px" label="List of users">
      <adminCardUserCard v-for="(user, index) in allUsers" :key="index"
      :user="user"></adminCardUserCard>
    </overflowContainer>
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
    downgradeUser(user: any, index: number): void {
      this.$axios.patch(`/api/user/updateIsAdmin?userId=${user.userId}`, {
        toggle: false,
      })
      .then(() => {
        this.$mytoast.succ(`User ${user.username} downgraded`);
        this.adminList.splice(index, 1);
      })
      .catch(this.$mytoast.defaultCatch);
    },
  },
  async fetch() {
    this.adminList = await this.$axios
    .get('/api/admin/allAdmin')
    .then((resp: any) => resp.data)
    .catch(this.$mytoast.defaultCatch);

    this.allUsers = await this.$axios
    .get('/api/admin/allUsers')
    .then((resp: any) => resp.data)
    .catch(this.$mytoast.defaultCatch);
  },
});
</script>

<style scoped lang="scss" src="./admin.scss">
</style>
