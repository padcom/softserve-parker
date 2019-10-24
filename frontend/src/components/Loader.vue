<template>
  <div v-if="loading" class="loader">
    <img src="/img/loading.gif">
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
