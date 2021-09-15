<template>
  <div class="content flexHVcenter" @click.self="hideSearch()">
    <div class="connected">
      <SearchResult :friends="friends" :joinUserChannel="joinUserChannel"></SearchResult>
      <ul class="listChannel" @click="hideSearch()">
        <li v-for="(item, index) in channels" :key="index">
          <UserCard :channel="item" :index="index" :joinChannel="joinChannel" :channelName="currentChannelName" :currentUser="currentUser" :leaveChannel="leaveChannel"></UserCard>
        </li>
      </ul>
      <div class="creatChatRoom flexHVcenter" @click="hideSearch()">
        <v-btn id="createChatRoomBtn" @click="modalBool.showCreate = true">
          <p class="BtnTxt">Create a channel</p>
        </v-btn>
      </div>
    </div>
    <div class="chatChamp boxHVcenter" v-if="userBanned === false" @click="hideSearch()">
      <div class="chatRoomName" v-if="currentChannel != undefined">
        <div class="flexAlignRow">
          <Avatar v-if="currentChannel.directMessage" class="chanelImg" :user="whoIsIt(currentChannel)" ></Avatar>
          <img v-else class="chanelImg" src="~/assets/img/chatbubble.svg">
          <p v-if="currentChannel.directMessage"> {{ whoIsIt(currentChannel).username }}</p>
          <p v-else> {{ currentChannel.channelName }} </p>
        </div>
        <div class="settingBtn flexHVcenter" v-if="this.currentChannel.directMessage === false && this.currentChannel.owner === this.currentUser.userId">
          <Iconify class="imgIcone" iconName="ci:settings" @click.native="modalBool.showSettings = true"></Iconify>
        </div>
      </div>
      <div class="chatMain">
        <div class="received">
          <ul>
            <li class="newMsg" v-for="(msg, index) in messages" :key="index">
              <div class="msgAvatar" @click="currentMemberMod = msg.user, modalBool.showPersonnalSettings = true ">
                <Avatar :user="msg.user" ></Avatar>
              </div>
              <div class="msgDiv">
                <p>{{ msg.user.username }}</p>
                <div class="msgContent"> {{ msg.text }} </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="chatfield" v-if="currentChannel != undefined && userMuted === false">
          <input  type="text" name="myinput" id="myinput" placeholder="message" v-model="txt" @keyup.enter="sendMsg" autocomplete="off">
            <div class="sendBtn flexHVcenter" @click.prevent="sendMsg">
              <Iconify class="imgIcone" iconName="carbon-send-alt"></Iconify>
            </div>
        </div>
      </div>
      <div class="control" v-if="currentChannel != undefined && currentChannel.directMessage === false">
        <ChatMember :channelUsers="currentChannel.users" :public="currentChannel.publicChannel" :getModStatus="getModStatus"></ChatMember>
      </div>
    </div>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showCreate">
      <h1>Create Channel</h1>
      <ModalInput name="Name of the channel :" v-model.lazy="newChannel.name"  placeHolder="" :ispublic="true" @keyup.enter.native="createChannel"></ModalInput>
      <div class="visibility">
        <input type="radio" name="private" @click="newChannel.public = false">
        <label for="private">Private</label>
        <input type="radio" name="private" @click="newChannel.public = true" :checked="newChannel.public">
        <label for="private">Public</label>
      </div>
      <div class="checkBoxePassword" v-if="!newChannel.public">
        <input type="checkbox" name="addpassword" v-model="protectByPassword">
        <label class="addPassword" for="addpassword">Protect by password</label>
      </div>
      <ModalInput name="Password :" v-model.lazy="newChannel.password"  placeHolder="" :isPassword="true" :ispublic="!newChannel.public" v-if="!newChannel.public && protectByPassword"></ModalInput>
      <Dropdown v-if="!newChannel.public" toselect="Choose friends :" :items="friends" ></Dropdown>
      <v-btn class="DoneBtn" @click="modalBool.showCreate = false, createChannel()" >
        <p class="v-btn-content">Create</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showSettings">
      <h1 id="settingModal">Channel Settings</h1>
      <div class="checkBoxePassword flexHVcenter" v-if="!channelSettings.deletePassword && !currentChannel.publicChannel">
        <input type="checkbox" name="addpassword" v-model="channelSettings.applyPassword">
        <label class="addPassword" for="addpassword">Protect by new password</label>
      </div>
      <div class="checkBoxePassword flexHVcenter" v-if="!channelSettings.applyPassword && !currentChannel.publicChannel">
        <input type="checkbox" name="addpassword" v-model="channelSettings.deletePassword">
        <label class="addPassword" for="addpassword">Disable current password</label>
      </div>
      <ModalInput  name="New passeword :"  placeHolder="" :isPassword="true" :ispublic="true" v-model.lazy="channelSettings.password" v-if="channelSettings.applyPassword"></ModalInput>
      <Dropdown toselect="Add members :" :items="friends" v-if="!currentChannel.publicChannel"></Dropdown>
      <v-btn class="DoneBtn" @click="modalBool.showSettings = false, changeSettings()" v-if="!currentChannel.publicChannel">
        <p class="v-btn-content">Apply</p>
      </v-btn>
      <v-btn class="BlockBtn" @click="modalBool.showSettings = false, changeSettings(), deleteChannel(currentChannel)">
        <p class="v-btn-content">Delete Channel</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showPrivacy">
      <h1 id="settingModal">Join {{ channels[selectedChannel].channelName }}</h1>
      <ModalInput  name="Channel password :" v-model.lazy="password"  placeHolder="" :isPassword="true" :ispublic="true"  @keyup.enter.native="modalBool.showPrivacy = false, sendPassword()"></ModalInput>
      <v-btn class="DoneBtn" @click="modalBool.showPrivacy = false, sendPassword()">
        <p class="v-btn-content" >Join</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showMembersMod && (isAdmin() === true || (this.currentChannel.owner === this.currentUser.userId && this.currentChannel.publicChannel === false))">
      <h1>{{ currentMemberMod.username }}</h1>
      <div class="avatar">
        <NuxtLink :to="`/profile/${currentMemberMod.username}`"><Avatar :user="currentMemberMod"></Avatar></NuxtLink>
      </div>
      <div class="checkBoxeModerator flexHVcenter" v-if="this.currentChannel.owner === this.currentUser.userId && this.currentChannel.publicChannel === false">
        <input type="checkbox" name="addmoderator" v-model="moderation.newMod">
        <label class="addPassword" for="addmoderator">Moderator</label>
      </div>
      <DropdownChatMod toselect="Ban for (days):" :items="moderation.timer" action="ban"></DropdownChatMod>
      <DropdownChatMod  toselect="Mute for (days):" :items="moderation.timer" action="mute"></DropdownChatMod>
      <v-btn class="DoneBtn" @click="modalBool.showMembersMod = false, sendModeration()">
        <p class="v-btn-content">Apply</p>
      </v-btn>
    </SettingModal>
    <SettingModal :hideModal="hideModal" v-if="modalBool.showPersonnalSettings && currentUser.userId != currentMemberMod.userId">
      <h1>{{ currentMemberMod.username }}</h1>
      <div class="avatar">
        <NuxtLink :to="`/profile/${currentMemberMod.username}`"><Avatar :user="currentMemberMod"></Avatar></NuxtLink>
      </div>
      <v-btn class="DoneBtn" @click="modalBool.showPersonnalSettings = false">
        <p class="v-btn-content">Challenge to a Game</p>
      </v-btn>
      <v-btn class="BlockBtn" v-if="isBlocked(currentMemberMod) === false" @click="blockedUser = true, modalBool.showPersonnalSettings= false, blockUser(currentMemberMod)">
        <p class="v-btn-content">Block this user</p>
      </v-btn>
      <v-btn class="BlockBtn" v-if="isBlocked(currentMemberMod) === true" @click="blockedUser = false, modalBool.showPersonnalSettings= false, blockUser(currentMemberMod)">
        <p class="v-btn-content">Unblock this user</p>
      </v-btn>
    </SettingModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {UserStatus, User, Message, Channel, newChannel} from '~/types/chatTypes';

export default Vue.extend({
  name: 'chat',
  head(): object {
    return {
      title: 'Chat' as string,
    };
  },
  data(): any {
    return {
      bool: true as boolean,
      txt: '' as string,
      messages: [] as Message[],
      channels: [] as Channel[],
      currentUser: this.$store.state.user as User,
      currentChannel: new Channel as Channel,
      userBanned: false as boolean,
      userMuted: false as boolean,
      modalBool : {
        showCreate: false as boolean,
        showSettings: false as boolean,
        showPrivacy: false as boolean,
        showSearch: false as boolean,
        showMembersMod: false as boolean,
        showPersonnalSettings: false as boolean,
      },
      newChannel: new newChannel() as newChannel,
      protectByPassword: false as Boolean,
      moderation:{
        newMod: false as boolean,
        banTime: 0 as number,
        muteTime: 0 as number,
        timer: [1, 3, 7, 30, 365] as number[],
      },
      channelSettings: {
        password: '' as string,
        applyPassword: false as boolean,
        deletePassword: false as boolean,
        members: [] as User[],
      },
      selectedChannel: 0 as number,
      friends: [] as User[],
      password: '' as string,
      currentMemberMod: {} as User,
      blockedUser: false as boolean,
    }
  },
  computed: {
    currentChannelName(): string | undefined {
      return this.currentChannel?.channelName;
    },
  },
  methods: {
    async joinChannel(index: number): Promise<void>{
      if (index < 0 || index >= this.channels.length) {
        console.error('joinChannel: index out of range');
        return ;
      }
      this.selectedChannel = index;
      this.$user.socket.emit('leaveChannel');
      this.$user.socket.emit("checkRoleChannelBan", this.channels[index], (resp: boolean) => {
        if (resp === true)
        {
          this.$mytoast.err(`no access to "${this.channels[index].channelName}" YOU'VE BEEN BANNED!!!`);
          return;
        }
        if (!this.channels[index].publicChannel && !this.channels[index].authPrivateChannelUsers.find((el: String) => el === this.$store.state.user.userId))
          this.modalBool.showPrivacy = true;
        else
        {
          this.$user.socket.emit('joinChannel', this.channels[index]);
          this.currentChannel = this.channels[index];
          this.checkIfMute(this.currentChannel);
        }
      });

    },
    sendPassword() {
      const arg = {channel: this.channels[this.selectedChannel],
      password: this.password};
      console.log("channels at first", this.channels);
      this.$user.socket.emit("checkRoleChannelBan", this.channels[this.selectedChannel], (resp: boolean) => {
        if (resp === true)
        {
          this.$mytoast.err(`no access to "${this.channels[this.selectedChannel].channelName}" YOU'VE BEEN BANNED!!!`);
          return;
        }
        this.$user.socket.emit('passwordChannel', arg, (data: any) => {
          if (data === false)
          {
            this.modalBool.showPrivacy = false;
            this.$mytoast.err(`Wrong password!`);
          }
          else
          {
            console.log("channels then", this.channels);
            this.$user.socket.emit('joinChannel', this.channels[this.selectedChannel]);
            this.currentChannel = this.channels[this.selectedChannel];
            this.selectedChannel = 0;
            this.checkIfMute(this.currentChannel);
          }
        });
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
      this.$user.socket.emit('autorisationChannel', arg);
      this.moderation.newMod = false;
      this.moderation.banTime = 0;
      this.moderation.muteTime = 0;
      this.moderationblockedUser = false;
    },
    sendMsg(): void {
      if (this.txt === '')
        return;
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
      if (this.newChannel.name === "")
      {
        this.$mytoast.err(`name your channel please`);
        return;
      }
      if (this.newChannel.public === true)
      {
        this.$user.socket.emit('createChannel', {channelName: this.newChannel.name,
        publicChannel: this.newChannel.public},  (data: boolean) => {
          if (data === false)
            this.$mytoast.err(`This channel name already exist`);});
      }
      else if (this.newChannel.public === false)
      {
        this.$user.socket.emit('createChannel', {channelName: this.newChannel.name,
        users: this.newChannel.members,
        publicChannel: this.newChannel.public,
        password: this.newChannel.password}, (data: boolean) => {
          if (data === false)
            this.$mytoast.err(`This channel name already exist`);});
      }
      this.newChannel = new newChannel(); // Run on succes only!
      this.protectByPassword = false;
      this.hideModal();
    },
    hideModal(): void {
      this.modalBool.showCreate = false;
      this.modalBool.showSettings = false;
      this.modalBool.showPrivacy = false;
      this.modalBool.showMembersMod= false;
      this.newChannel.public = true;
      this.protectByPassword = false
      this.modalBool.showPersonnalSettings = false;
    },
    isAdmin(): Boolean{
      if(this.currentChannel.publicChannel === true || this.currentChannel.channelName === "")
        return false;
      if (this.currentChannel.adminUsers.indexOf(this.currentUser.userId) != -1 || this.currentChannel.owner === this.currentUser.userId)
        return true;
      else
        return false;
    },
    isModerator(): Boolean{
      if(this.currentChannel.publicChannel === true)
        return false;
      if (this.currentChannel.adminUsers.indexOf(this.currentMemberMod.userId) != -1 || this.currentChannel.owner === this.currentMemberMod.userId)
        return true;
      else
        return false;
    },
    joinUserChannel(user: User): void{
      let name1: string = this.currentUser.userId + user.userId;
      let name2: string = user.userId + this.currentUser.userId;
      let users: User[] = [];
      users.push(user);
      let channel: Channel = this.channels.find((el: Channel) => el.channelName === name1 || el.channelName === name1);
      if(channel)
      {
        this.$user.socket.emit('joinChannel', channel);
        this.currentChannel = channel;
      }
      else
      {
        this.$user.socket.emit('createChannel', {channelName: name1,
        users: users,
        publicChannel: false,
        directMessage: true});
      }
    },
    getModStatus(): void{
      this.moderation.newMod = this.isModerator();
    },
    checkIfBan(channel: Channel): void{
      this.$user.socket.emit("checkRoleChannelBan", channel, (resp: boolean) => {
        this.userBanned = resp;
      });
    },
    checkIfMute(channel: Channel): void{
      this.$user.socket.emit("checkRoleChannelMute", channel, (resp: boolean) => {
        this.userMuted = resp;
        if (resp === true)
          this.$mytoast.err(`You've been muted from "${channel.channelName}"`);
      });
    },
    changeSettings(): void{
      const arg = {
        channel: this.currentChannel,
        data: this.channelSettings,
      };
      this.$user.socket.emit("updateChannel", arg);
    },
    updateChannels(newChannels: Channel[] | any = [], onMount: boolean = false): void {
      if ((newChannels instanceof Array) == false) {
        console.error('Assigning non array type to channels');
        return ;
      }
      this.channels = newChannels;
      const newChannelIndex = this.channels.length - 1;
      if (onMount === true || this.channels?.[newChannelIndex]?.owner === this.currentUser.userId) {
        this.joinChannel(newChannelIndex);
      }
    },
    blockUser(user: User): void {
      console.log("deblocage", this.blockedUser);
      let arg = {
        user: user,
        block: this.blockedUser,
      }
      this.$user.socket.emit("blockUser", arg, (data: any) => {
        this.currentUser = data;
      });
      this.blockedUser = false;
    },
    isBlocked(user: User): boolean{
      let find: string = this.currentUser.blockedUsers.find((el: string) => el === user.userId)
      if (find)
        return true;
      else
        return false;
    },
    hideSearch(): void{
      this.$nuxt.$emit('hide-search');
    },
    whoIsIt(channel: Channel): User{
      let find: User|any = channel.users.find((el: User) => el.userId != this.currentUser.userId)
      if (find)
        return find;
      else
        return this.currentUser;
    },
    deleteChannel(channel: Channel): void{
      this.$user.socket.emit("deleteChannel", channel);
    },
    leaveChannel(channel: Channel, user: User): void{
      let arg: any = {
        channel: channel,
        user: user,
      }
      this.$user.socket.emit("userLeaveChannel", arg);
      this.$mytoast.info(`You left "${channel.channelName}"`);
    },
  },
  mounted() {
    this.$user.socket.on("messageAdded", (data: any) => {
      this.recvMsg(data);
    });
    this.$user.socket.emit("displayChannel", (data: any) => {
      this.updateChannels(data, true);
    });
    this.$user.socket.on("channel", (data: any) => {
      this.updateChannels(data);
    });
    this.$user.socket.on('banUserChannel', (data: any) => {
       this.$mytoast.err(`You've been banned from "${data.channelName}"`);
    });
    this.$user.socket.on('muteUserChannel', (data: any) => {
       this.$mytoast.err(`You've been muted from "${data.channelName}"`);
    });
    this.$user.socket.on('messages', (data: any) => {
        this.messages = data;
    });
    this.$store.state.user.friends.forEach((element: any) => {
      this.$axios
      .get(`/api/user/partialInfo?userId=${element}`)
      .then((resp: any) => {this.friends.push(resp.data);})
      .catch(this.$mytoast.defaultCatch);
    });
  },
  created() {
    this.$nuxt.$on('my-chat-event', (user: User) => {
      this.modalBool.showMembersMod = true;
      this.currentMemberMod = user;
   });
    this.$nuxt.$on('send-userlist', (userList: User[]) => {
      this.newChannel.members = userList;
      this.channelSettings.members = userList;
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
