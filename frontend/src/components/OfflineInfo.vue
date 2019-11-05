<template>
  <div class="offline-info" v-if="offline">
    <p class="offline-info__text">You are offline</p>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

@Component()
export default class OfflineInfo extends Vue {
  offline = false

  mounted() {
    window.addEventListener('offline', (e) => {
      this.offline = true
    })

    window.addEventListener('online', (e) => {
      this.offline = false
    })
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.offline-info {
  margin-bottom: 30px;

  &__text {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    box-sizing: border-box;
    background: $color-black;
    color: $color-white;
    font-family: $font-family-proxima-nova;
    padding: 5px 15px;
    margin: 0;

    @media (min-width: $md-viewport) {
      max-width: $sm-viewport;
      margin: 0 auto;
    }
  }
}
</style>
