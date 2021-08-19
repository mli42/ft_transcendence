<template>
  <div class="content flexHVcenter">
    <div class="connected">
      <div class="search flexHVcenter">
        <input  type="text" name="mysearch" id="mysearch">
      </div>
      <ul>
        <li v-for="(item, index) in channels" :key="index">
          <UserCard :name="item.channelName" @click="activeConvo = item, joinChannel(index), currentChannel = channels[index]"></UserCard>
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
        <div class="settingBtn flexHVcenter">
          <Iconify class="imgIcone" iconName="ci:settings"></Iconify>
        </div>
      </div>
      <div class="received">
        <ul>
          <li class="newMsg" v-for="(msg, index) in messages" :key="index">
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
          <input type="radio" name="private" @click="newChannel.public = false">
          <label for="private">Private</label>
          <input type="radio" name="private" @click="newChannel.public = true" checked>
          <label for="public">Public</label>
        </div>
        <ModalInput name="Password :" v-model.lazy="newChannel.password"  placeHolder="" :isPassword="true" :ispublic="!newChannel.public"></ModalInput>
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
import {UserStatus, User, Message, Channel} from '~/types/chatTypes';
export default Vue.extend({
  name: 'chat',
  layout: 'default',
  data(): any {
    return {
      txt: '' as string,
      messages: [] as Message[],
      socket: {} as any,
      channels: [] as Channel[],
      currentChannel: new Channel as Channel,
      modalBool : {
        showCreate: false as boolean,
        showSettings: false as boolean,
      },
      newChannel:{
        name: '' as string,
        public: true as boolean,
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
    joinChannel(index: number){
      this.socket.emit('joinChannel', this.channels[index]);
      // this.socket.on('message', (message: Message) => {
      //   console.log(message);
      //   this.messages = message;
      // });
    },
    sendMsg(): void {
      this.socket.emit('newMessage', 
      	{msgId: '',
        text: this.txt,
        user : new User,
        channel: this.currentChannel,
        date: new Date,
        update_at: new Date,}
      );
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
      this.messages.push(msg);
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
    this.socket.on("message", (data: any) => {
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
