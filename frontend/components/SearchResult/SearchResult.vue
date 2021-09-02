<template>
    <div class="content">
        <div class="search flexHVcenter">
        <input  type="text" name="mysearch" id="mysearch" v-model="searchName">
        <div class="loop flexHVcenter" @click="showResult = true"><img src="~/assets/img/loop.png"></div>
        </div>
        <div v-if="showResult" class="result">

        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'search',
  data() {
    return {
        showResult: false as boolean,
    };
  },
  props: ['channels', 'searchName' ]
});
</script>

<style scoped lang="scss" src="./SearchResult.scss">
</style>
