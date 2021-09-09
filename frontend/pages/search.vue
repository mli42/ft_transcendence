<template>
  <div>
    <backgroundAnim></backgroundAnim>
    <div class="searchPage useWholePage">
      <div class="flexAlignCol">
        <!-- Title -->
        <p class="title">Search</p>
        <!-- Search bar + search icon -->
        <div class="search flexHVcenter">
          <input @keyup.enter="fetchData" class="search"
          type="text" name="whoInput" id="whoInput" v-model.lazy="who">
          <Iconify @click.native="fetchData" class="searchIcon"
          iconName="ant-design:search-outlined"></Iconify>
        </div>
        <!-- User cards -->
        <p class="tip" v-if="users === undefined">Here you can search for player profiles</p>
        <p class="tip" v-else-if="users.length == 0">No match for '{{whoNotFound}}', sorry!</p>
        <div v-else v-for="(user, index) in users" :key="index">
          <search-card :user="user"></search-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'search',
  head(): object {
    return {
      title: "Search" as String,
    };
  },
  data() {
    return {
      who: '' as string,
      whoNotFound: '' as string,
      users: undefined as any,
    };
  },
  mounted() {
    const who: any = this.$route.query.who;
    if (typeof who == 'string') {
      this.who = who;
      this.fetchData();
    }
  },
  methods: {
    async fetchData() {
      this.users = await this.$axios
        .get(`/api/user/search?username=${this.who}`)
        .then((res: any) => res.data.sort(this.$user.sortCmp))
        .catch(() => [])
        .finally(() => { this.whoNotFound = this.who; });
      this.$router.push(`/search?who=${this.who}`);
    },
  },
});
</script>

<style scoped lang="scss" src="./search.scss">
</style>
