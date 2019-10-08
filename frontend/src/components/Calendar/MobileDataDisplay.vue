<template>
  <div class="calendar-data">
    <div class="calendar-data__label">
      <span>Wylot od - Przylot do</span>
    </div>
    <div class="calendar-data__inputs">
      <span :class="{
          'calendar-data__input': true,
          'calendar-data__input--focus': selectionMode === 'start',
        }">
        {{ selected.start == 0 ? 'Przylot od' : selected.start.format('dd DD.MM') }}
      </span>
      <span :class="{
          'calendar-data__text': true,
          'calendar-data__text--focus': selectionMode === 'end',
        }">
        -
      </span>
      <span :class="{
          'calendar-data__input': true,
          'calendar-data__input--focus': selectionMode === 'end',
        }"
      >
        {{ selected.end == 0 ? 'Przylot do' : selected.end.format('dd DD.MM') }}
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    selectionMode: {
      type: String,
      required: true,
    },
    selected: {
      type: Object,
      required: true,
    },
  },
})
export default class MobileDataDisplay extends Vue {
}
</script>

<style lang="scss">
.calendar-data {
  display: flex;
  flex-direction: column;
  background-color: #0055AA;

  &__label {
    font-size: 11px;
    font-weight: 300;
  }

  &__inputs {
    display: flex;
    font-size: 18px;
    color: white;
    font-weight: 300;
  }

  &__input {
    border: none;
    border-left: 1px solid transparent;
    // width: 85px;
    background-color: inherit;
    padding-left: 1px;
    margin-left: -1px;
    padding: 0;

    &--focus {
    color: #A0D5FF;
    }

    &--focus {
      border-left: 1px solid transparent;
      animation: PulseAttention 1s cubic-bezier(0, 1, 0, 1) forwards infinite;
    }
  }

  &__text {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;
    &--focus {
      color: white;
    }
  }
}

@keyframes PulseAttention {
  50% {
    border-left-color: white;
  }
}
</style>
