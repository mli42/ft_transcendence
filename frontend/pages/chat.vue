<template>
  <div>
    <h1>WELCOME TO THE CHAT</h1>
    <form>
      <input type="text" name="myinput" id="myinput" v-model="txt">
      <button>Send</button>
    </form>
    <p>
      <ul>
        <li v-for="(msg, index) in message" :key="index">{{ msg }}</li>
      </ul>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import io from 'socket.io-client';

export default Vue.extend({
  name: 'chat',
  layout: 'default',
  data(): any {
    return {
      txt: '' as string,
      message: [] as string[],
      socket: {} as any,
    }
  },
  methods: {
    sendMsg(): void {
      this.socket.emit('msgToServer', this.txt);
      this.txt = '';
    },
    recvMsg(msg: string): void {
      console.log(msg);
      this.message.push(this.msg);
    }
  },
  created(): void {
    this.socket = io('wss://echo.websocket.org');
    this.socket.on('msgToClient', (msg: string)=>{
      this.recvMsg(msg);
    })
  }
});
</script>

<style scoped lang="scss" src="./chat.scss">
</style>