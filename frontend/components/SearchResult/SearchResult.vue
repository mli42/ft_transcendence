<template>
    <div class="content">
        <div class="search flexHVcenter">
        <input  type="text" name="mysearch" id="mysearch" v-model="searchName">
        <div class="loop flexHVcenter" @click="showResult = true, fetchData() "><img src="~/assets/img/loop.png"></div>
        </div>
        <ul v-if="showResult" class="result" v-click-outside="showResult = false">
            <li v-for="(item, index) in result" :key="index">
                {{item}}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'search',
  data() {
    return {
        showResult: false as boolean,
        searchName: '' as string,
        todisplay: [] as string[],
        result: [] as string[],
    };
  },
  props: ['channels'],
  methods: {
    fetchData(): void{
        const result = this.channels.filter(el => console.log(el));
        this.result = result.map((el: string) => el.channelName);
    },
  }
  // el.channelName.startsWith(this.searchName) == true
});
</script>

<style scoped lang="scss" src="./SearchResult.scss">
</style>


