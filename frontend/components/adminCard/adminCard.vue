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
    <v-btn class="modBtn redBg" @click="downgradeUserEmit">Downgrade</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'adminCard',
  data() {
    return {
    };
  },
  methods: {
    downgradeUserEmit(): void {
      this.$emit('downgradeAdmin');
    },
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

<style scoped lang="scss" src="./adminCard.scss">
</style>
