<template>
  <div class="settings flexHVcenter">
    <div class="content">
      <h1 class="contentTitle">Settings</h1>
      <form>
        <SettingInput @keyup.enter.native="changeSettings" name="Change your username :" v-model.lazy="nickName" :placeHolder="this.currentUser.username"></SettingInput>
        <SettingInput @keyup.enter.native="changeSettings" name="Change your password :" v-model.lazy="passWord" :isPassword="true" placeHolder="Your super secret password"></SettingInput>
        <SettingInput @keyup.enter.native="changeSettings" name="Change your mail :" v-model.lazy="email" :placeHolder="this.currentUser.email"></SettingInput>
        <v-btn class="SaveBtn" @click.prevent="changeSettings">
          <p class="v-btn-content">Save changes</p>
        </v-btn>
        <v-btn class="ChangeBtn" @click="modalBool.showPicture = true">
          <p class="v-btn-content dbtxt">Change your profile picture</p>
        </v-btn>
        <v-btn class="ChangeBtn" @click="modalBool.showQRC = true; getQRC()">
          <p class="v-btn-content dbtxt" >2FA Settings</p>
        </v-btn>
        <v-btn color="error" class="DeleteBtn" @click="modalBool.showDelete = true">
          <p class="v-btn-content" >Delete my account</p>
        </v-btn>
      </form>
    </div>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showPicture">
      <p class="uploadPreview">Preview</p>
      <img class="profilePicture" :src="imgURL" alt="Profile image">
      <p class="uploadDetails">
        Files accepted: png/jpg/jpeg/gif.
        Up to 1Mb.
      </p>
      <input type="file" name="file" id="file" ref="file" class="inputFile" @change="fileSelected"/>
      <label class="labelFile" for="file">Upload a picture</label>
      <v-btn id="doneBtn" @click="modalBool.showPicture = false; uploadFile()">
        <p class="v-btn-content">Yes, change my avatar</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showQRC">
        <template v-if="currentUser.twoFactorAuth">
          <div class="QRCode" v-html="QRChtml"></div>
          <p class="txt2FA">Don't forget to scan your QR Code
            with Google Authenticator !
          </p>
        </template>
        <v-btn class="act2FA" @click="toggle2FA">
          <p class="v-btn-content dbtxt" >{{twofaAction}} 2FA</p>
        </v-btn>
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
  head(): object {
    return {
      title: "Settings" as String,
    };
  },
  data(): any {
    return {
      nickName: '' as String,
      passWord: '' as String,
      email: '' as string,
      pictureFile: null,
      imgURL: `${this.$store.state.avatarURL}` as string,
      QRChtml: '' as string,
      toSend: {} as Object,
      activate2fa: false as boolean,
      modalBool : {
        showPicture: false as boolean,
        showDelete: false as boolean,
        showQRC: false as boolean,
      }
    };
  },
  computed: {
    currentUser(): any {
      return this.$store.state.user;
    },
    twofaAction(): string {
      return (this.currentUser.twoFactorAuth ? 'Deactivate' : 'Activate');
    },
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
      this.$mytoast.defaultCatch(err);
    },
    changeSettings(): void {
      this.addPorp();
      if (Object.keys(this.toSend).length == 0) {
        this.$mytoast.info('Warning: No field filled');
        return ;
      }
      this.$axios
      .patch('/api/user/settings', this.toSend)
      .then((response: any): void => {
        this.$mytoast.succ(`${Object.keys(this.toSend)}: updated`);
        this.$store.commit('updateUserPartial', this.toSend);
        // Update Chat's WS
        this.$user.socketDelete();
        setTimeout(() => { this.$user.socketCreate(); }, 600);
      })
      .catch(this.catchErr);
    },
    hideModal(): void {
      this.modalBool.showPicture = false;
      this.modalBool.showDelete = false;
      this.modalBool.showQRC = false;
    },
    fileSelected(): void{
      try {
        this.pictureFile = this.$refs.file.files[0];
        this.imgURL = URL.createObjectURL(this.pictureFile);
      } catch (e: any) {
        this.pictureFile = '';
        this.imgURL = `${this.$store.state.avatarURL}`;
      }
    },
    uploadFile(): void{
      if (!this.pictureFile) {
        this.$mytoast.err('No avatar uploaded');
        return ;
      }

      let file: FormData = new FormData();
      const ext: string = this.pictureFile.name.split('.').pop();
      const newFilename: string = `${this.currentUser.username}-.${ext}`;

      file.append('file', this.pictureFile, newFilename);
      this.$axios
      .post('/api/user/upload/avatar', file)
      .then((res: any) => {
        this.pictureFile = null;
        this.$store.dispatch('updateAvatar', res.data);
        this.$mytoast.succ('Avatar successfully updated');
        // Update Chat's WS
        this.$user.socketDelete();
        setTimeout(() => { this.$user.socketCreate(); }, 600);
      })
      .catch(this.catchErr)
      .finally(() => {
        this.imgURL = `${this.$store.state.avatarURL}`;
      });
    },
    getQRC(): void{
      this.$axios
      .get(`/api/auth/2fa`)
      .then((response: any): void =>{
        this.QRChtml = response.data;
      })
      .catch((error: any): void =>{
        this.$mytoast.err("QRC FAILURE");
      });
    },
    deleteAccount(): void{
      this.$axios
      .delete('/api/user/delete')
      .then((response: any): void =>{
        this.$router.push({ name: 'login' })
        this.$mytoast.succ("Account successfully deleted");
      })
      .catch((error: any): void =>{
        this.$mytoast.err("DELETE FAILURE");
      });
    },
    toggle2FA(): void {
      this.$axios
      .patch('/api/user/updateTwoFactorAuth', {
        toggle: !this.currentUser.twoFactorAuth,
      })
      .then(() => {
        this.$mytoast.succ(`${this.twofaAction}d 2FA!`);
        this.$store.commit('update2FA', !this.currentUser.twoFactorAuth);
      })
      .catch(this.$mytoast.defaultCatch);
    },
  },
});
</script>

<style scoped lang="scss" src="./settings.scss">
</style>
