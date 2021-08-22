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
      <v-btn id="doneBtn" @click="modalBool.showPicture = false; uploadFile()">
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

export default Vue.extend({
  name: 'settings',
  data(): any {
    return {
      nickName: '' as String,
      passWord: '' as String,
      email: '' as string,
      pictureFile: null,
      imgURL: `${this.$store.state.avatarURL}` as string,
      QRChtml: '' as string,
      toSend: {} as Object,
      currentUser: this.$store.state.user as any,
      msgErr: [],
      validated: false as boolean,
      activate2fa: false as boolean,
      modalBool : {
        showPicture: false as boolean,
        showDelete: false as boolean,
        showQRC: false as boolean,
      }
    };
  },
  methods: {
    addPorp(): void{
      this.toSend = {};
      if (this.nickName)
        this.toSend.username = this.nickName;
      if (this.email)
        this.toSend.email = this.email;
      if (this.passWord)
        this.toSend.password = this.passWord;
    },
    catchErr(err: any): void {
      const errorTab = err.response.data.message;
      this.msgErr = (typeof errorTab == "string") ? [errorTab] : errorTab;
      setTimeout(() => { this.msgErr = [];}, 6000);
    },
    changeSettings(): void {
      this.addPorp();
      if (this.toSend.length == 0) {
        return ;
      }
      this.$axios
      .patch('/api/user/settings', this.toSend)
      .then((response: any): void => {
        this.validated = true;
      })
      .catch(this.catchErr);
    },
    hideModal(): void {
      this.modalBool.showPicture = false;
      this.modalBool.showDelete = false;
      this.modalBool.showQRC = false;
    },
    fileSelected(): void{
        this.pictureFile = this.$refs.file.files[0];
        this.imgURL = URL.createObjectURL(this.pictureFile);
    },
    uploadFile(): void{
      if (!this.pictureFile) {
        return ;
      }

      let file: FormData = new FormData();
      const ext: string = this.pictureFile.name.split('.').pop();
      const newFilename: string = `${this.currentUser.username}-.${ext}`;

      file.append('file', this.pictureFile, newFilename);
      this.$axios
      .post('/api/user/upload/avatar', file)
      .then((res: any) => {
        this.$store.dispatch('updateAvatar', res.data);
      })
      .catch(this.catchErr)
      .finally(() => {
        this.imgURL = `${this.$store.state.avatarURL}`;
      });
    },
    getQRC(): void{
      this.$axios
      .get(`/api/auth/2fa/${this.currentUser.username}/${this.currentUser.userId}`)
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
});
</script>

<style scoped lang="scss" src="./settings.scss">
</style>
