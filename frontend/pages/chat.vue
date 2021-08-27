<template>
  <div class="content flexHVcenter">
    <div class="connected">
      <div class="search flexHVcenter">
        <input  type="text" name="mysearch" id="mysearch">
      </div>
      <ul class="listChannel">
        <li v-for="(item, index) in channels" :key="index">
          <UserCard :name="item.channelName" :index="index" :joinChannel="joinChannel" :channelName="currentChannel.channelName"></UserCard>
        </li>
      </ul>
      <div class="creatChatRoom flexHVcenter">
        <v-btn id="createChatRoomBtn" @click="modalBool.showCreate = true">
          <p class="BtnTxt">Create a channel</p>
        </v-btn>
      </div>
    </div>
    <div class="chatChamp boxHVcenter">
      <div class="chatRoomName">
        <img class="chanelImg" src="~/assets/img/chatbubble.svg">
        <p> {{ currentChannel.channelName }} </p>
        <div class="settingBtn flexHVcenter">
          <Iconify class="imgIcone" iconName="ci:settings" @click.native="modalBool.showSettings = true"></Iconify>
        </div>
      </div>
      <div class="received">
        <ul>
          <li class="newMsg" v-for="(msg, index) in messages" :key="index">
            <img src="~/assets/img/avatar.jpeg">
            <div class="msgDiv">
              <p>{{ msg.user.username }}</p>
              <div class="msgContent"> {{ msg.text }} </div>
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
      <div class="control">
        <ChatMember :channelUsers="currentChannel.users"></ChatMember>
      </div>
    </div>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showCreate">
      <h1>Create Channel</h1>
      <ModalInput name="Name of the channel :" v-model.lazy="newChannel.name"  placeHolder="" :ispublic="true" ></ModalInput>
      <div class="visibility">
        <input type="radio" name="private" @click="newChannel.public = false">
        <label for="private">Private</label>
        <input type="radio" name="private" @click="newChannel.public = true" checked>
        <label for="private">Public</label>
      </div>
      <ModalInput name="Password :" v-model.lazy="newChannel.password"  placeHolder="" :isPassword="true" :ispublic="!newChannel.public" v-if="!newChannel.public"></ModalInput>
      <Dropdown v-if="!newChannel.public" toselect="Choose members :" :items="friends" :value="newChannel.members" :fillTab="fillMembers"></Dropdown>
      <Dropdown v-if="!newChannel.public" toselect="Choose administrators :" :items="newChannel.members" :value="newChannel.admin" :fillTab="fillAdmin"></Dropdown>
      <v-btn class="DoneBtn" @click="modalBool.showCreate = false, createChannel()">
        <p class="v-btn-content">Create</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showSettings">
      <h1 id="settingModal">Channel Settings</h1>
      <div class="visibility">
        <input type="radio" name="privateChange" @click="channelChanges.public = false">
        <label for="privateChange">Private</label>
        <input type="radio" name="privateChange" @click="channelChanges.public = true" checked>
        <label for="privateChange">Public</label>
      </div>
      <ModalInput v-if="!channelChanges.public" name="Change passeword :" v-model.lazy="channelChanges.newPassword"  placeHolder="" :isPassword="true" :ispublic="!channelChanges.public"></ModalInput>
      <div class="checkBoxePassword flexHVcenter" v-if="!channelChanges.public">
        <input type="checkbox" name="addpassword" @click="addpassword = true" :disabled="channelChanges.public? true : false">
        <label class="addPassword" for="addpassword">Protected by new password</label>
      </div>
      <Dropdown v-if="!channelChanges.public" toselect="Add members :" :items="friends" :value="channelChanges.members" :fillTab="fillMembers"></Dropdown>
      <v-btn class="DoneBtn" @click="modalBool.showSettings = false">
        <p class="v-btn-content">Apply changes</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showPrivacy">
      <h1 id="settingModal">Join Channel</h1>
      <ModalInput  name="Channel password :" v-model.lazy="passeword"  placeHolder="" :isPassword="true" :ispublic="true"></ModalInput>
      <v-btn class="DoneBtn" @click="modalBool.showPrivacy = false">
        <p class="v-btn-content">Join</p>
      </v-btn>
    </SettingModal>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import io from 'socket.io-client';
import {UserStatus, User, Message, Channel} from '~/types/chatTypes';
import ChatMember from '../components/ChatMember/ChatMember.vue';
export default Vue.extend({
  components: { ChatMember },
  name: 'chat',
  layout: 'default',
  data(): any {
    return {
      txt: '' as string,
      messages: [] as Message[],
      channels: [] as Channel[],
      currentChannel: new Channel as Channel,
      modalBool : {
        showCreate: false as boolean,
        showSettings: false as boolean,
        showPrivacy: false as boolean,
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
      selectedChannel: false as boolean,
      friends: [],
      password: '' as string,
    }
  },
  methods: {
    joinChannel(index: number): void{
      this.modalBool.showPrivacy = true;
      this.$user.socket.emit('leaveChannel');
      this.currentChannel = this.channels[index];
      console.log("current channel :", this.currentChannel);
      this.$user.socket.emit('joinChannel', this.channels[index]);
    },
    sendMsg(): void {
      this.$user.socket.emit('newMessage',
      	{text: this.txt,
        channel: this.currentChannel,
        }
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
      if (this.newChannel.public === true)
      {
        this.$user.socket.emit('createChannel', {channelName: this.newChannel.name,
        publicChannel: this.newChannel.public});
      }
      else if (this.newChannel.public === false)
      {
        this.$user.socket.emit('createChannel', {channelName: this.newChannel.name,
        users: this.newChannel.members,
        publicChannel: this.newChannel.public});
      }
    },
    hideModal(): void {
      this.modalBool.showCreate = false;
      this.modalBool.showSettings = false;
      this.modalBool.showPrivacy = false;
    },
  },
  mounted() {
    console.log(this.$user.socket);
    this.$user.socket.on("messageAdded", (data: any) => {
      this.recvMsg(data);
    });
    this.$user.socket.emit("displayChannel", (data: any) => {
      this.channels = data;
    });
    this.$user.socket.on("channel", (data: any) => {
      this.channels = data;
    });
    this.$user.socket.on('messages', (data: any) => {
        this.messages = data;
    });
    this.$store.state.user.friends.forEach((element: any) => {
      this.$axios
      .get(`/api/user/partialInfo?userId=${element}`)
      .then((resp: any) => {this.friends.push(resp.data);})
      .catch(() => console.log('Oh no'));
    });
  },
  destroyed(){
    this.$user.socket.off("messageAdded");
    this.$user.socket.off("channel");
    this.$user.socket.off("messages");
  }
});
</script>

<style scoped lang="scss" src="./chat.scss">
</style>
