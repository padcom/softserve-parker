<template>
  <div class="popup-rank">
    <h2 class="popup-rank__header">Your rank</h2>
    <div class="popup-rank__score-box">
      {{ userRank }}
      <p class="popup-rank__total">
        /{{ totalRank === -1 ? '?' : totalRank }}
      </p>
    </div>
  </div>
</template>

<script>
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component()
export default class Ranking extends Vue {
  @Prop({ type: Number, required: true }) userRank
  @Prop({ type: Number, required: true }) totalRank
}
</script>

<style lang="scss">
@import '../styles/variables';

.popup-rank {
  border-bottom: 1px solid #d8d8d8;
  margin-bottom: 10px;

  &__header {
    text-transform: uppercase;
    margin: 0;
    font-size: 12px;
    line-height: 12px;
    font-weight: $font-weight-semi-bold;
  }

  &__score-box {
    display: inline-block;
    position: relative;
    margin: 8px auto 12px;
    font-size: 36px;
    line-height: 36px;
    font-family: $font-family-open-sans;
  }

  &__total {
    position: absolute;
    top: 0;
    left: calc(100% + 2px);
    color: #bababa;
    margin: 0;
    font-size: 12px;
    line-height: 12px;
    font-family: $font-family-open-sans;
  }
}
</style>
