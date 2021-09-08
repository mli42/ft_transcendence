<template>
  <div>
    <LoadingModale v-if="$fetchState.pending == true" label="Game Loading" />
    <gameCanvas v-else-if="isValid" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "gameIdPage" as string,
  head(): object {
    return {
      title: 'Play' as string,
    };
  },
  data() {
    return {
      uuid: '' as string,
      isValid: false as boolean,
    };
  },
  fetch() {
    this.uuid = this.$route.params.id;

    this.$axios.get(`/api/game/isUuid/${this.uuid}`)
    .then((res: any) => {
      const isUUID: boolean = res.data;

      if (isUUID === true) {
        this.isValid = isUUID;
      } else {
        this.$router.push('/');
        this.$mytoast.err('Invalid route');
      }
    })
    .catch(this.$mytoast.defaultCatch);
  },
});
</script>

<style scoped lang="scss">
</style>
