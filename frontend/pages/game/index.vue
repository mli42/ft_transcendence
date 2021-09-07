<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend ({
  name: 'indexGamePage',
  mounted() {
    this.$axios.get('/api/game/uuid')
    .then((res: any) => {
      const uuid: string = res.data;
      this.$router.push(`/game/${uuid}`);
    })
    .catch(this.$mytoast.defaultCatch);
  },
});
</script>

<style scoped lang="scss">
</style>
