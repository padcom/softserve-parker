<template>
  <div class="calendar__header calendar-header">
    <span class="custom-icon--calendar calendar-header__icon" />
    <span>Kiedy?</span>
    <span class="custom-icon--cross calendar-header__icon" @click="$emit('close')" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class MobileHeader extends Vue {
}
</script>

<style lang="scss">
.calendar-header {
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 16px;

  & span {
    line-height: 20px;
    flex: 0 0 auto;
  }

  & span:nth-child(2) {
    flex: 1 1 auto;
    margin-left: 0.5em;
  }

  & span.custom-icon--cross {
    font-size: 30px;
    margin-top: -.5em;
  }

  &__icon {
    font-size: 20px;
  }
}
</style>
