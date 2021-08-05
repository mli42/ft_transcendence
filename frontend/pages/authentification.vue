<template>
  <div class="auth flexHVcenter">
    <img alt="square logo" src="~/assets/img/logo500.png" />
    <hr class="middleHR"/>
    <div class="content">
      <h1>Two-factor Authentification</h1>
      <label for="code">Code :</label>
      <input type="text" name="code" @input="updateValue($event.target.value)" />
      <v-btn class="verify">
        <p class="v-btn-content">Verify</p>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'auth',
  layout: 'empty',
  data(): any {
    return {
      secretCode: "" as string,
    };
  },
  methods: {
    updateValue: function (value: string) {
      // this.$emit('input', value);
    },
  },
});
</script>

<style scoped lang="scss" src="./authentification.scss">
</style>