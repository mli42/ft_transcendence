<template>
  <div class="modalContent flexHVcenter" @click.self="hideModal">
      <div class="innerContent flexAlignCol flexHVcenter" >
          <!-- pour pouvoir inserer du contenue ds la popup -->
          <slot/>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SettingModal',
  data(): any {
    return {

    };
  },
  methods: {

  },
  props: {
    hideModal: {
      type: Function,
      required: true,
    },
  },
});
</script>

<style scoped lang="scss" src="./SettingModal.scss">
</style>
