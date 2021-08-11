<template>
  <div>
    <h1>Cannot display profile:</h1>
    <br/>
    <h1>User "{{this.username}}" does not exist.</h1>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NotExistProfile',
  props: ['username'],
});
</script>

<style scoped lang="scss" src="./NotExistProfile.scss">
</style>
