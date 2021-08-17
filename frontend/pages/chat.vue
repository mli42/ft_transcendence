<template>
  <div class="content flexHVcenter">
    <div class="connected">
      <div class="search flexHVcenter">
        <input  type="text" name="mysearch" id="mysearch">
      </div>
      <UserCard name="Name" imgsrc="~/assets/img/avatar.jpeg" @click="activeConvo = 'name'"></UserCard>
      <div class="creatChatRoom flexHVcenter">
        <v-btn id="createChatRoomBtn" @click="modalBool.showCreate = true">
          <p class="v-btn-content" >Create a channel</p>
        </v-btn>
      </div>
    </div>
    <div class="chatChamp boxHVcenter">
      <div class="chatRoomName">
        <img class="chanelImg" src="~/assets/img/avatar.jpeg">
        <p>User name</p>
        <div class="settingBtn flexHVcenter" v-if="isChannel">
          <Iconify class="imgIcone" iconName="ci:settings"></Iconify>
        </div>
      </div>
      <div class="received">
        <ul>
          <li class="newMsg" v-for="(msg, index) in message" :key="index">
            <img src="~/assets/img/avatar.jpeg">
            <div class="msgDiv">
              <p>Name</p>
              <div class="msgContent"> {{ msg }} </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="chatfield">
        <input  type="text" name="myinput" id="myinput" placeholder="message" v-model="txt">
          <div class="sendBtn flexHVcenter" @click.prevent="sendMsg">
            <Iconify class="imgIcone" iconName="carbon-send-alt"></Iconify>
          </div>
      </div>
      <SettingModal :hideModal="hideModal" v-if="modalBool.showCreate">
        <h1>Create Channel</h1>
        <ModalInput name="Name of the channel :" v-model.lazy="newChannel.name"  placeHolder="" :isdisabled="false"></ModalInput>
        <div class="visibility">
          <input type="radio" name="private" @click="newChannel.private = true">
          <label for="private">Private</label>
          <input type="radio" name="private" @click="newChannel.private = false" checked>
          <label for="public">Public</label>
        </div>
        <ModalInput name="Password :" v-model.lazy="newChannel.password"  placeHolder="" :isPassword="true" :isdisabled="newChannel.private"></ModalInput>
        <Dropdown toselect="Choose administrators" :items="friends" :value="newChannel.admin"></Dropdown>
        <v-btn class="DoneBtn" @click="modalBool.showCreate = false, createChannel()">
          <p class="v-btn-content">Create</p>
        </v-btn>
      </SettingModal>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import io from 'socket.io-client';
import Dropdown from '../components/Dropdown/Dropdown.vue';
export default Vue.extend({
  components: { Dropdown },
  name: 'chat',
  layout: 'default',
  data(): any {
    return {
      txt: '' as string,
      message: [] as string[],
      socket: {} as any,
      isChannel: false as Boolean,
      channelName: 'mychannel' as string,
      channels: [] as string[],
      currentUser: '' as string,
      activeConvo: 'convparDef' as string,
      modalBool : {
        showCreate: false as boolean,
      },
      newChannel:{
        name: '' as string,
        private: false as boolean,
        password: '' as string,
        members: [] as string[],
        admin: [] as string[],
      },
      friends: ['sarah', 'tom', 'Alice'] as string[],
    }
  },
  methods: {
    sendMsg(): void {
      this.socket.emit('msgToServer', this.txt);
      this.txt = '';
      // this.currentUser = this.$store.state.user.username;
    },
    recvMsg(msg: string): void {
      this.message.push(msg);
    },
    createChannel(): void{
      this.socket.emit('createChannel', {channelName: this.channelName});
      this.channelName = '';
      console.log('SUCCESSE');
    },
    hideModal(): void {
      this.modalBool.showCreate = false;
    },
  },
  mounted() {
    this.socket = io('ws://localhost:3000/', {withCredentials: true});
    console.log(this.socket);
    this.socket.on("msgToClient", (data: any) => {
      console.log('msgToClient : ');
      console.log(data);
      this.recvMsg(data);
    });
  },
});
</script>

<style scoped lang="scss" src="./chat.scss">
</style>
