<template>
  <div class="reservation">
    <span class="reservation__background">
      <img
        class="reservation__cancel-icon"
        v-bind:class="{'reservation__cancel-icon--active': cancelIconActive}"
        src="/img/close.png"
      />
    </span>
    <p
      v-on:touchstart="handleTouchStart"
      v-on:touchmove="handleSwipe"
      v-on:touchend="handleTouchEnd"
      v-bind:style="{left: leftPosition + positionUnit}"
      class="reservation__date"
      v-bind:class="{'reservation__date--animeted-movement': animetedMovementActive}"
    >
      {{ formattedDate }}
    </p>
    <button
      class="reservation__cancel-desktop-btn"
      v-on:click="removeItemByClick">
      <img src="/img/close-black.png" alt="">
    </button>
  </div>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import moment from 'moment'

let initialX = 0
const CANCELABLE_POSITION = -125

@Component()
export default class ParkingDatesListItem extends Vue {
  @Prop({ type: Object, required: true }) request
  leftPosition = 0
  positionUnit = 'px'
  animetedMovementActive = false
  cancelIconActive = false

  get formattedDate () {
    return moment(this.request.date)
      .format('DD.MM.YYYY, ddd')
      .toString()
  }

  handleTouchStart (event) {
    const { clientX } = event.touches[0]
    initialX = clientX
  }

  handleSwipe (event) {
    const { clientX } = event.touches[0]
    this.leftPosition = (initialX - clientX) * -1 > 0 ? 0 : (initialX - clientX) * -1
    this.cancelIconActive = this.leftPosition < CANCELABLE_POSITION
  }

  handleTouchEnd (event) {
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

  removeItem () {
    this.positionUnit = '%'
    this.leftPosition = -100
    setTimeout(() => {
      this.$emit('action', this)
    }, 100)
  }

  removeItemByClick () {
    this.$emit('action', this)
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
      @media (min-width: $lg-viewport) {
        display: block;
      }
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
    cursor: pointer;
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
