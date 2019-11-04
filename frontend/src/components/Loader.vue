<template>
  <div v-if="loading" class="loader">
    <img src="/img/loader.png" class="loader__img">
  </div>
</template>

<script>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component()
export default class Loader extends Vue {
  @Prop({ type: Boolean, default: false }) loading
}
</script>

<style lang="scss">
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background: rgba(0, 0, 0, .2);

  &__img {
    animation: spin .9s infinite linear;
  }
}
</style>
