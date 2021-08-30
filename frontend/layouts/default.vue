<template>
  <div>
    <NavBar></NavBar>
    <Nuxt class="NavBarShift DefaultLayout" />
  </div>
</template>

<style scoped lang="scss">
@import '~/assets/Palette.scss';

.NavBarShift {
  position: fixed;
  top: 64px;
  height: 100%;
  width: 100%;
}

.DefaultLayout {
  background: $pg-blue;
}
</style>
