<template>
  <div class="reservation">
    <span class="reservation__background">
      <img
        class="reservation__cancel-icon"
        :class="{ 'reservation__cancel-icon--active': cancelIconActive }"
        src="/img/close.png"
      />
    </span>
    <p
      @touchstart="handleTouchStart"
      @touchmove="handleSwipe"
      @touchend="handleTouchEnd"
      :style="{ left: leftPosition + positionUnit }"
      class="reservation__date"
      :class="{ 'reservation__date--animeted-movement': animetedMovementActive }"
    >
      {{ this.request.date | date }} - {{ this.request.status }}
    </p>
    <button
      class="reservation__cancel-desktop-btn"
      v-if="!touchedDevice"
      @click="removeItemByClick">
      <img src="/img/close-black.png" alt="">
    </button>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import isTouchDevice from 'is-touch-device'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ReservationRequest } from '../../domain/ReservationRequest'

let initialX = 0
const CANCELABLE_POSITION = -125

@Component({
  filters: {
    date (value: Date) {
      return moment(value)
        .format('DD.MM.YYYY, ddd')
        .toString()
    },
  },
})
export default class ParkingDatesListItem extends Vue {
  @Prop({ type: Object, required: true }) request?: ReservationRequest
  leftPosition = 0
  positionUnit = 'px'
  animetedMovementActive = false
  cancelIconActive = false

  get touchedDevice () {
    return isTouchDevice()
  }

  handleTouchStart (event: TouchEvent) {
    if (this.request && this.request.status === '') {
      const { clientX } = event.touches[0]
      initialX = clientX
    }
  }

  handleSwipe (event: TouchEvent) {
    if (this.request && this.request.status === '') {
      const { clientX } = event.touches[0]
      this.leftPosition = (initialX - clientX) * -1 > 0 ? 0 : (initialX - clientX) * -1
      this.cancelIconActive = this.leftPosition < CANCELABLE_POSITION
    }
  }

  handleTouchEnd (event: TouchEvent) {
    if (this.request && this.request.status === '') {
      this.animetedMovementActive = true
      if (this.leftPosition > CANCELABLE_POSITION) {
        this.leftPosition = 0
        setTimeout(() => {
          this.animetedMovementActive = false
        }, 1000)
      } else {
        this.removeItem()
      }
    }
  }

  removeItem () {
    this.positionUnit = '%'
    this.leftPosition = -100
    setTimeout(() => { this.$emit('action', this) }, 100)
  }

  removeItemByClick () {
    this.$emit('action', this)
  }

  cancel () {
    this.cancelIconActive = false
    this.animetedMovementActive = false
    this.leftPosition = 0
    this.positionUnit = 'px'
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables';

.reservation {
  background-color: $color-danger;
  position: relative;

  &:hover {
    .reservation__cancel-desktop-btn {
      display: block;
    }
  }

  &__background {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    text-align: end;
    height: 47px;
  }

  &__cancel-icon {
    margin-right: 12px;
    width: 4%;
    transition: width 100ms;

    &--active {
      width: 6%;
    }
  }

  &__cancel-desktop-btn {
    display: none;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    background: transparent;
    border: 0;
    margin: 0;
    padding: 0;
    outline: none;
  }

  &__date {
    box-sizing: border-box;
    border-bottom: 1px solid rgb(216, 216, 216);
    margin: 0;
    padding: 12px 0 12px 20px;
    width: 100%;
    height: 47px;
    background-color: white;
    position: absolute;
    top: 0;

    &--animeted-movement {
      transition: left 400ms ease;
    }
  }
}
</style>
