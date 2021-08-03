<template>
  <div>
    Homepage
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'root-index',
  head(): object {
    return {
      title: "Home Page" as String,
    };
  },
  data() {
    return {
    };
  },
  methods: {
  },
});
</script>
