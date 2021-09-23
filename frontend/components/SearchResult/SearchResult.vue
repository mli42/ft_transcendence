<template>
    <div class="content">
        <div class="search flexHVcenter">
          <input placeholder="Search user to DM" type="text" name="mysearch" id="mysearch" v-model="searchName" @focus="showResult = false" autocomplete="off">
          <div class="loop flexHVcenter" @click="showResult = true, getUsers(), fetchData()"><img src="~/assets/img/loop.png"></div>
        </div>
        <ul v-if="showResult" class="result" @click.self="showResult = false">
            <li v-for="(user, index) in result" :key="index" @click="joinUserChannel(user); showResult = false">
              <div class="pp">
                <Avatar :user="user"></Avatar>
              </div>
                <p>{{user.username}}</p>
            </li>
            <p v-if="result.length === 0">No result found</p>
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
        allUser: [] as User[]
    };
  },
  props: ['currentUser', 'joinUserChannel'],
  methods: {
    fetchData(): void{
        this.result = []
        this.allUser.filter((el: User) => {
        if (el.username.startsWith(this.searchName) == true)
        {
          if (el.userId != this.currentUser.userId)
            this.result.push(el);
        }
        });
    },
    getUsers(): void{
      this.$axios
      .get(`/api/admin/allUsers`)
      .then((resp: any) => {this.allUser = resp.data;})
      .catch(this.$mytoast.defaultCatch);
    }
  },
  mounted(){
     this.$nuxt.$on('hide-search', (data: any) => {
       this.showResult = false;
     });
      this.$axios
      .get(`/api/admin/allUsers`)
      .then((resp: any) => {this.allUser = resp.data;})
      .catch(this.$mytoast.defaultCatch);
  }
});
</script>

<style scoped lang="scss" src="./SearchResult.scss">
</style>


