<template>
  <div>
    <h1>WELCOME TO THE CHAT</h1>
    <form>
      <input type="text" name="myinput" id="myinput" v-model="txt">
      <button @click.prevent="sendMsg">Send</button>
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
      this.message.push(msg);
    }
  },
  mounted() {
    this.socket = io('ws://localhost:3000/');
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