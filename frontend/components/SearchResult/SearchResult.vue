<template>
    <div class="content">
        <div class="search flexHVcenter">
          <input  type="text" name="mysearch" id="mysearch" v-model="searchName" @focus="showResult = false">
          <div class="loop flexHVcenter" @click="showResult = true, fetchData()"><img src="~/assets/img/loop.png"></div>
        </div>
        <ul v-if="showResult" class="result">
            <li v-for="(user, index) in result" :key="index" @click="joinUserChannel(user); showResult = false">
              <div class="pp">
                <Avatar :user="user"></Avatar>
              </div>
                <p>{{user.username}}</p>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {User} from '~/types/chatTypes';

export default Vue.extend({
  name: 'search',
  data() {
    return {
        showResult: false as boolean,
        searchName: '' as string,
        todisplay: [] as string[],
        result: [] as User[],
    };
  },
  props: ['friends', 'joinUserChannel'],
  methods: {
    fetchData(): void{
        this.result = []
        this.friends.filter((el: User) => {
        if (el.username.startsWith(this.searchName) == true)
          this.result.push(el)});
        console.log(this.result);
    },
  },
});
</script>

<style scoped lang="scss" src="./SearchResult.scss">
</style>


