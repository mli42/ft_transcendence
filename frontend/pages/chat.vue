<template>
  <div class="content flexHVcenter">
    <div class="connected">
      <div class="search flexHVcenter">
        <input  type="text" name="mysearch" id="mysearch">
      </div>
      <ul>
        <li v-for="(item, index) in channels" :key="index">
          <UserCard :name="item.channelName" @click="activeConvo = item"></UserCard>
        </li>
      </ul>
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
        <ModalInput name="Name of the channel :" v-model.lazy="newChannel.name"  placeHolder="" :ispublic="true" ></ModalInput>
        <div class="visibility">
          <input type="radio" name="private" @click="newChannel.private = true">
          <label for="private">Private</label>
          <input type="radio" name="private" @click="newChannel.private = false" checked>
          <label for="public">Public</label>
        </div>
        <ModalInput name="Password :" v-model.lazy="newChannel.password"  placeHolder="" :isPassword="true" :isdisabled="newChannel.public"></ModalInput>
        <Dropdown toselect="Choose members :" :items="friends" :value="newChannel.members" :fillTab="fillMembers"></Dropdown>
        <Dropdown toselect="Choose administrators :" :items="newChannel.members" :value="newChannel.admin" :fillTab="fillAdmin"></Dropdown>
        <v-btn class="DoneBtn" @click="modalBool.showCreate = false, createChannel()">
          <p class="v-btn-content">Create</p>
        </v-btn>
      </SettingModal>
      <SettingModal :hideModal="hideModal" v-if="modalBool.showSettings">
        <h1 id="settingModal">Channel Settings</h1>
        <ModalInput name="Change passeword :" v-model.lazy="channelChanges.newPassword"  placeHolder="" :isPassword="true" :ispublic="channelChanges.public"></ModalInput>
        <input class="addPassword" type="checkbox" name="addpassword" @click="addpassword = true">
        <label class="addPassword" for="addpassword">Protected by password</label>
        <div class="visibility">
          <input type="radio" name="private" @click="channelChanges.private = true">
          <label for="private">Private</label>
          <input type="radio" name="private" @click="channelChanges.private = false" checked>
          <label for="public">Public</label>
        </div>
        <Dropdown toselect="Add members :" :items="friends" :value="channelChanges.members" :fillTab="fillMembers"></Dropdown>
        <v-btn class="DoneBtn" @click="modalBool.showSettings = false">
          <p class="v-btn-content">Apply changes</p>
        </v-btn>
      </SettingModal>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import io from 'socket.io-client';
import {UserStatus, User} from '~/types/userTypes';
export default Vue.extend({
  name: 'chat',
  layout: 'default',
  data(): any {
    return {
      txt: '' as string,
      message: [] as string[],
      socket: {} as any,
      isChannel: false as Boolean,
      channels: [],
      activeConvo: {},
      modalBool : {
        showCreate: false as boolean,
        showSettings: false as boolean,
      },
      newChannel:{
        name: '' as string,
        public: false as boolean,
        password: '' as string,
        members: [] as User[],
        admin: [] as User[],
      },
      channelChanges:{
        newPassword: '' as string,
        public: true as boolean,
        members: [] as User[],
        addpassword: false as boolean,
      },
      friends: [],
    }
  },
  methods: {
    sendMsg(): void {
      this.socket.emit('msgToServer', this.txt);
      this.txt = '';
    },
    fillMembers(data: string[]): void{
      this.newChannel.members = data;
    },    
    fillAddMembers(data: string[]): void{
      this.channelChanges.members = data;
    },
    fillAdmin(data: string[]): void{
      this.newChannel.admin = data;
    },
    recvMsg(msg: string): void {
      this.message.push(msg);
    },
    createChannel(): void{
      this.socket.emit('createChannel', {channelName: this.newChannel.name,
      users: this.newChannel.members});
      console.log(this.newChannel.members);
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
    this.socket.on("channel", (data: any) => {
      console.log('channels : ');
      this.channels = data;
      console.log(this.channels);
    });
    this.$store.state.user.friends.forEach((element: any) => {
      this.$axios
      .get(`/api/user/partialInfo?userId=${element}`)
      .then((resp: any) => {this.friends.push(resp.data);
      console.log('ici', resp.data)})
      .catch(() => console.log('Oh no'));
    });
  },
});
</script>

<style scoped lang="scss" src="./chat.scss">
</style>
