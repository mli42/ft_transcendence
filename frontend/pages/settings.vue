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
    <SettingModal :hideModal="hideModal" v-if="modalBool.showPicture">
      <img class="profilePicture" :src="imgURL" alt="Profile image">
      <input type="file" name="file" id="file" ref="file" class="inputFile" @change="fileSelected"/>
      <label class="labelFile" for="file">Upload a picture</label>
      <v-btn id="doneBtn" @click="modalBool.showPicture = false; uploadFile()">
        <p class="v-btn-content">Yes, change my avatar</p>
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
      this.$mytoast.err(err.response.data.message);
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
  },
});
</script>

<style scoped lang="scss" src="./settings.scss">
</style>
