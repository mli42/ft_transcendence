<template>
  <div class="adminCardMain flexAlignRow">
    <div class="flexAlignRow flexHVcenter">
      <div class="pp">
        <Avatar :user="user"></Avatar>
      </div>
      <NuxtLink :to="userProfile">
        <p class="username">{{shortUsername}}</p>
      </NuxtLink>
    </div>
    <div>
      <v-btn class="downgradeBtn">Ban</v-btn>
      <v-btn class="downgradeBtn">Promote</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'userCard',
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    userProfile(): string {
      return `/profile/${this.user.username}`;
    },
    shortUsername(): string {
      return (this.$user.shortName(this.user.username, 15));
    },
  },
  props: ['user'],
});
</script>

<style scoped lang="scss" src="./userCard.scss">
</style>
