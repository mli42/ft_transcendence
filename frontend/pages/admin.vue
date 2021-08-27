<template>
  <div>
  <div id="adminMain" class="flexAlignCol useWholePage">
    <h1>Admin View</h1>
    <div class="primaryContent GameHistoryContainer">
      <p>List of administrators</p>
      <hr />
      <div v-if="$fetchState.pending == false" class="GameHistory flexAlignCol">
        <adminCard v-for="(user, index) in adminList" :key="index"
        :user="user" @downgradeUser="downgradeUser(user, index)"></adminCard>
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
  data() {
    return {
      adminList: [] as any,
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
      .catch((err: any) => { console.error(err); });
    },
  },
  async fetch() {
    this.adminList = await this.$axios
    .get('/api/admin/allAdmin')
    .then((resp: any) => resp.data)
    .catch((err: any) => console.error('getAllAdmin', err));
  },
});
</script>

<style scoped lang="scss" src="./admin.scss">
</style>
