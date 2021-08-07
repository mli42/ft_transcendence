<template>
  <div class="settings flexHVcenter">
    <div class="content">
      <h1 class="contentTitle">Settings</h1>
      <form>
        <SettingInput name="Change your nickname :" v-model="nickName"  placeHolder="Your nickname"></SettingInput>
        <SettingInput name="Change your password :" v-model="passWord" :isPassword="true" placeHolder="Your super secret password"></SettingInput>
        <SettingInput name="Change your mail :" v-model="email" placeHolder="Enter your new email"></SettingInput>
        <v-btn class="SaveBtn" @click.prevent="changeSettings">
          <p class="v-btn-content">Save changes</p>
        </v-btn>
        <v-btn class="ChangeBtn" @click="modalBool.showPicture = true">
          <p class="v-btn-content">Change your profile picture</p>
        </v-btn>
        <v-btn class="ChangeBtn">
          <p class="v-btn-content">Reset your QR code</p>
        </v-btn>
        <v-btn class="ChangeBtn">
          <p class="v-btn-content" @click="modalBool.showQRC = true">Show your current QR code</p>
        </v-btn>
        <v-btn color="error" class="DeleteBtn">
          <p class="v-btn-content" @click="modalBool.showDelete = true">Delete my account</p>
        </v-btn>
      </form>
    </div>
    <div class="errMessages">
      <v-expand-transition v-for="(msg, index) in msgErr" :key="index">
        <v-alert dense dismissible elevation="8" type="warning">
          <p style="text-transform: uppercase;">{{msg}}</p>
        </v-alert>
      </v-expand-transition>
    </div>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showPicture">
        <img class="profilePicture" src="~/assets/img/avatar.jpeg" alt="Profile image">
        <v-btn class="modalBtn">
          <p class="v-btn-content">Upload a picture</p>
        </v-btn>
        <v-btn id="doneBtn" @click="modalBool.showPicture = false">
          <p class="v-btn-content">Done</p>
        </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showQRC">
        <div class="QRCode"></div>
        <v-btn id="QRCBtn" @click="modalBool.showQRC = false">
          <p class="v-btn-content">Done</p>
        </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showDelete">
        <div class="deleteGif"></div>
        <v-btn id="deleteModalBtn" @click="modalBool.showDelete = false">
          <p class="v-btn-content">Done</p>
        </v-btn>
    </SettingModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SettingModal from '../components/SettingModal/SettingModal.vue';

export default Vue.extend({
  name: 'settings',
  layout: 'default',
  data(): any {
    return {
      nickName: '' as String,
      passWord: '' as String,
      email: '' as string,
      msgErr: [],
      validated: false as boolean,
      modalBool : 
      {
        showPicture: false as boolean,
        showDelete: false as boolean,
        showQRC: false as boolean,
      }
    };
  },
  methods: {
    changeSettings(): void {
        // this.axios
        // .patch('/api/user/settings', {
        //   username: this.nickName,
        //   email: this.email,
        //   password: this.passWord,})
        // .then((response: any): void => {
        //   this.validated = true;
        // })
        // .catch((error: any): void => {
        //   let errorTab = error.response.data.message;
        //   setTimeout(() => {
        //     this.msgErr = (typeof errorTab == "string") ? [errorTab] : errorTab;}, 6000) 
        // })
    },
    hideModal(): void {
      this.modalBool.showPicture = false;
      this.modalBool.showDelete = false;
      this.modalBool.showQRC = false;
    },
  },
});
</script>

<style scoped lang="scss" src="./settings.scss">
</style>