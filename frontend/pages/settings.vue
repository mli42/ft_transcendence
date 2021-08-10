<template>
  <div class="settings flexHVcenter">
    <div class="content">
      <h1 class="contentTitle">Settings</h1>
      <form>
        <SettingInput name="Change your nickname :" v-model.lazy="nickName"  placeHolder="Your nickname"></SettingInput>
        <SettingInput name="Change your password :" v-model.lazy="passWord" :isPassword="true" placeHolder="Your super secret password"></SettingInput>
        <SettingInput name="Change your mail :" v-model.lazy="email" placeHolder="Enter your new email"></SettingInput>
        <v-btn class="SaveBtn" @click.prevent="changeSettings">
          <p class="v-btn-content">Save changes</p>
        </v-btn>
        <v-btn class="ChangeBtn" @click="modalBool.showPicture = true">
          <p class="v-btn-content">Change your profile picture</p>
        </v-btn>
        <v-btn class="ChangeBtn" @click="modalBool.showQRC = true; getQRC()">
          <p class="v-btn-content" >Show your current QR code</p>
        </v-btn>
        <v-btn color="error" class="DeleteBtn" @click="modalBool.showDelete = true">
          <p class="v-btn-content" >Delete my account</p>
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
      <img class="profilePicture" :src="imgURL" alt="Profile image">
      <input type="file" name="file" id="file" ref="file" class="inputFile" @change="fileSelected"/>
      <label class="labelFile" for="file">Upload a picture</label>
      <v-btn id="doneBtn" @click="modalBool.showPicture = false, uploadFile()">
        <p class="v-btn-content">Done</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showQRC">
        <div class="QRCode" v-html="QRChtml"></div>
        <v-btn id="QRCBtn" @click="modalBool.showQRC = false; activate2fa = true">
          <p class="v-btn-content">Done</p>
        </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showDelete">
        <!-- <div class="deleteGif"></div> -->
        <img class="deleteGif" src="~/assets/img/explosion.png"/>
        <v-btn id="deleteModalBtn" @click="modalBool.showDelete = false; deleteAccount()">
          <p class="v-btn-content">Delete my account</p>
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
      pictureFile: null,
      imgURL: '' as string,
      QRChtml: '' as string,
      toSend: {},
      currentUser: {},
      msgErr: [],
      validated: false as boolean,
      activate2fa: false as boolean,
      modalBool : 
      {
        showPicture: false as boolean,
        showDelete: false as boolean,
        showQRC: false as boolean,
      }
    };
  },
  methods: {
    addPorp(): void{
      if (this.nickName)
        this.toSend.username = this.nickName;
      if (this.email)
        this.toSend.email = this.email;
      if (this.passWord)
        this.toSend.password = this.passWord;
    },
    changeSettings(): void {
        this.addPorp()
        // console.log(this.toSend);
        if (this.toSend)
        {
          this.$axios
          .patch('/api/user/settings', this.toSend ,  { withCredentials: true })
          .then((response: any): void => {
            this.validated = true;
          })
          .catch((error: any): void => {
            let errorTab = error.response.data.message;
            console.log(errorTab);
            setTimeout(() => {
              this.msgErr = (typeof errorTab == "string") ? [errorTab] : errorTab;}, 600) 
          })
        }
    },
    hideModal(): void {
      this.modalBool.showPicture = false;
      this.modalBool.showDelete = false;
      this.modalBool.showQRC = false;
    },
    fileSelected(): void{
        this.pictureFile = this.$refs.file.files[0];
        this.imgURL = URL.createObjectURL(this.$refs.file.files[0]);
        console.log(this.$refs.file.files[0])
    },
    uploadFile(): void{
      const formData = new FormData();
      formData.append('mypp', this.pictureFile);
      this.$axios
      .post('/api/user/upload', formData)
      .then((response: any): void =>{
        console.log('SUCCESS!!');
      })
      .catch((error: any): void => {
        let errorTab = error.response.data.message;
        console.log(errorTab);
        setTimeout(() => {
        this.msgErr = (typeof errorTab == "string") ? [errorTab] : errorTab;}, 600)
      });
    },
    getQRC(): void{
      this.$axios
      .get(`/api/auth/2fa/${this.currentUser.userId}`)
      .then((response: any): void =>{
        this.QRChtml = response.data;
      })
      .catch((error: any): void =>{
        console.log("QRC FAILURE");
      });
    },
    deleteAccount(): void{
      this.$axios
      .delete('/api/user/delete')
      .then((response: any): void =>{
        console.log("DELETE SUCCESS");
        this.$router.push({ name: 'login' })
      })
      .catch((error: any): void =>{
        console.log("DELETE FAILURE");
      });
    },
  },
  mounted(): void{
    this.$axios
    .get('/api/user/currentUser')
    .then((response: any): void =>{
      this.currentUser = response.data;
      console.log(this.currentUser);
    })
    .catch((error: any): void =>{
      console.log("GET CURENT USER FAILURE");
    });
  },
});
</script>

<style scoped lang="scss" src="./settings.scss">
</style>