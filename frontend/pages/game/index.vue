<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend ({
  name: 'indexGamePage',
  mounted() {
    window.$nuxt.$router.push('/game/' + this.makeId(10)); // Redirect client
  },
  methods: {
    makeId(length: number): string {
      let result: string = '';
      let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let charactersLength: number = characters.length;
      for ( let i: number = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  },
});
</script>

<style scoped lang="scss">

</style>
