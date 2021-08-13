<template>
  <div>
    <backgroundAnim></backgroundAnim>
    <div class="searchPage useWholePage">
      <div class="flexAlignCol">
        <p class="title">Search</p>
        <input class="search" type="text" name="whoInput" id="whoInput" v-model="who">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'search',
  data() {
    return {
      who: '' as string,
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
        .then((res: any) => res.data)
        .catch(() => []);
      this.$router.push(`/search?who=${this.who}`);
      // console.log('Itsa me Mario:', this.users, this.who);
    },
  },
});
</script>

<style scoped lang="scss" src="./search.scss">
</style>
