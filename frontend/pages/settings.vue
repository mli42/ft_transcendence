<template>
  <div class="settings flexHVcenter">
    <div class="content">
      <h1 class="contentTitle">Settings</h1>
      <form>
        <label for="nickname">Change your nickname :</label>
        <input id="nickname" type="text" name="nickname" placeholder="Your nickname">
        <label for="password">Change your password :</label>
        <input id="password" type="password" name="password" placeholder="Your super secret password">
        <div class="centeredContent">
          <v-btn class="ChangeBtn">
            <p class="v-btn-content">Change your profile picture</p>
          </v-btn>
          <v-btn class="ChangeBtn">
            <p class="v-btn-content">Reset your QR code</p>
          </v-btn>
          <label for="QRCode">Your current 2FA QR code :</label>
          <div class="QRCode"></div>
          <v-btn color="error" class="DeleteProfile">
            <p class="v-btn-content">Delete my account</p>
          </v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'settings',
  layout: 'default',
  data() {
    return {
    };
  },
  methods: {
  },
});
</script>

<style scoped lang="scss" src="./settings.scss">
</style>