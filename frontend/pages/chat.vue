<template>
  <div class="content flexHVcenter">
    <div class="connected">
      <SearchResult  :channels="channels"></SearchResult>
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
        <div class="flexAlignRow">
          <img class="chanelImg" src="~/assets/img/chatbubble.svg">
          <p> {{ currentChannel.channelName }} </p>
        </div>
        <div class="settingBtn flexHVcenter">
          <Iconify class="imgIcone" iconName="ci:settings" @click.native="modalBool.showSettings = true"></Iconify>
        </div>
      </div>
      <div class="chatMain">
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
      </div>
      <div class="control">
        <ChatMember :channelUsers="currentChannel.users" :public="currentChannel.publicChannel"></ChatMember>
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
      <Dropdown v-if="!newChannel.public" toselect="Choose members :" :items="friends" ></Dropdown>
      <v-btn class="DoneBtn" @click="modalBool.showCreate = false, createChannel()">
        <p class="v-btn-content">Create</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showSettings">
      <h1 id="settingModal">Channel Settings</h1>
      <div class="visibility">
        <input type="radio" name="privateChange" >
        <label for="privateChange">Private</label>
        <input type="radio" name="privateChange" checked>
        <label for="privateChange">Public</label>
      </div>
      <ModalInput  name="Change passeword :"  placeHolder="" :isPassword="true" :ispublic="false"></ModalInput>
      <div class="checkBoxePassword flexHVcenter">
        <input type="checkbox" name="addpassword"  :disabled="false">
        <label class="addPassword" for="addpassword">Protected by new password</label>
      </div>
      <Dropdown toselect="Add members :" :items="friends"></Dropdown>
      <v-btn class="DoneBtn" @click="modalBool.showSettings = false">
        <p class="v-btn-content">Apply changes</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showPrivacy">
      <h1 id="settingModal">Join Channel</h1>
      <ModalInput  name="Channel password :" v-model.lazy="password"  placeHolder="" :isPassword="true" :ispublic="true"></ModalInput>
      <v-btn class="DoneBtn" @click="modalBool.showPrivacy = false, sendPassword()">
        <p class="v-btn-content" >Join</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showMembersMod">
      <h1>{{ currentMemberMod.username }}</h1>
      <div class="avatar"><Avatar :user="currentMemberMod"></Avatar></div>
      <div class="checkBoxePassword flexHVcenter" v-if="this.currentChannel.owner === this.currentUser.userId">
        <input type="checkbox" name="addmoderator" v-model="moderation.newMod">
        <label class="addPassword" for="addmoderator">Add this member to moderators</label>
      </div>
      <DropdownChatMod toselect="Ban for (days):" :items="moderation.timer" action="ban" v-if="isAdmin() === true"></DropdownChatMod>
      <DropdownChatMod  toselect="Mute for (days):" :items="moderation.timer" action="mute"  v-if="isAdmin() === true"></DropdownChatMod>
      <v-btn class="BlockBtn" @click="moderation.blockedUser = true">
        <p class="v-btn-content">Block this user</p>
      </v-btn>
      <v-btn class="DoneBtn" @click="modalBool.showMembersMod = false, sendModeration()">
        <p class="v-btn-content">Apply</p>
      </v-btn>
    </SettingModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import io from 'socket.io-client';
import {UserStatus, User, Message, Channel} from '~/types/chatTypes';
import Dropdown from '../components/Dropdown/Dropdown.vue';
import adminCardVue from '../components/adminCard/adminCard.vue';
export default Vue.extend({
  components: { Dropdown },
  name: 'chat',
  layout: 'default',
  data(): any {
    return {
      txt: '' as string,
      messages: [] as Message[],
      channels: [] as Channel[],
      currentUser: this.$store.state.user as User,
      currentChannel: new Channel as Channel,
      modalBool : {
        showCreate: false as boolean,
        showSettings: false as boolean,
        showPrivacy: false as boolean,
        showSearch: false as boolean,
        showMembersMod: false as boolean,
      },
      newChannel:{
        name: '' as string,
        public: true as boolean,
        password: '' as string,
        members: [] as User[],
        admin: [] as User[],
      },
      moderation:{
        newMod: false as boolean,
        banTime: 0 as number,
        muteTime: 0 as number,
        timer: [1, 3, 7, 30, 365] as number[],
        blockedUser: false as boolean,
      },
      selectedChannel: 0 as number,
      friends: [],
      password: '' as string,
      currentMemberMod: {} as User,
    }
  },
  methods: {
    joinChannel(index: number): void{
      this.$user.socket.emit('leaveChannel');
      if (!this.channels[index].publicChannel && !this.channels[index].authPrivateChannelUsers.find((el: String) => el === this.$store.state.user.userId))
      {
        this.modalBool.showPrivacy = true;
        this.selectedChannel = index;
      }
      else
      {
        this.$user.socket.emit('joinChannel', this.channels[index]); 
        this.currentChannel = this.channels[index];
      }
    },
    sendPassword() {
      const arg = {channel: this.channels[this.selectedChannel],
      password: this.password};
      this.$user.socket.emit('passwordChannel', arg, (data: any) => {
        if (data === false)
          this.modalBool.showPrivacy = false;
        else
        {
          this.$user.socket.emit('joinChannel', this.channels[this.selectedChannel]);
          this.currentChannel = this.channels[this.selectedChannel];
        }
      });
      this.password = '';
    },
    sendModeration() {
      const arg = {channel: this.currentChannel,
      user: this.currentMemberMod,
      admin: this.moderation.newMod,
      ban: this.moderation.banTime,
      mute: this.moderation.muteTime,
      block: this.moderation.blockedUser}
      this.$user.socket.emit('leaveChannel', arg);
    }, 
    sendMsg(): void {
      this.$user.socket.emit('newMessage',
      	{text: this.txt,
        channel: this.currentChannel,
        }
      );
      this.txt = '';
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
        publicChannel: this.newChannel.public,
        password: this.newChannel.password});
      }
    },
    hideModal(): void {
      this.modalBool.showCreate = false;
      this.modalBool.showSettings = false;
      this.modalBool.showPrivacy = false;
      this.modalBool.showMembersMod= false;
      this.newChannel.public = true;
    },
    isAdmin(): Boolean{
      if (this.currentChannel.adminUsers.indexOf(this.currentUser.userId) != -1 || this.currentChannel.owner === this.currentUser.userId)
        return true;
      else
        return false;
    },
  },
  mounted() {
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
  created() {
    this.$nuxt.$on('my-chat-event', (user: User) => {
      this.modalBool.showMembersMod = true;
      this.currentMemberMod = user;
   });
    this.$nuxt.$on('send-userlist', (userList: User[]) => {
      this.newChannel.members = userList;
   });
    this.$nuxt.$on('send-banTime', (time: number) => {
      this.moderation.banTime = time;
   });
    this.$nuxt.$on('send-muteTime', (time: number) => {
      this.moderation.muteTime = time;
   })
  },
  destroyed(){
    this.$user.socket.off("messageAdded");
    this.$user.socket.off("channel");
    this.$user.socket.off("messages");
    this.$user.socket.emit('leaveChannel');
    this.$nuxt.$off('my-chat-event');
    this.$nuxt.$off('send-userlist');
    this.$nuxt.$off('send-banTime');
    this.$nuxt.$off('send-muteTime');
  }
});
</script>

<style scoped lang="scss" src="./chat.scss">
</style>