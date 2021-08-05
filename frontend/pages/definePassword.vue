<template>
  <div class="auth flexHVcenter">
    <img alt="square logo" src="~/assets/img/logo500.png" />
    <hr class="middleHR"/>
    <div class="content">
      <h1>Define a new password</h1>
      <label for="newPassword">Your new password :</label>
      <input type="text" name="newPassword" @input="updateValue($event.target.value)" />
      <v-btn class="verify">
        <p class="v-btn-content">Verify</p>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'newPassword',
  layout: 'empty',
  data(): any {
    return {
      newPassword: "" as string,
    };
  },
  methods: {
    updateValue: function (value: string) {
      // this.$emit('input', value);
    },
  },
});
</script>

<style scoped lang="scss" src="./definePassword.scss">
</style>