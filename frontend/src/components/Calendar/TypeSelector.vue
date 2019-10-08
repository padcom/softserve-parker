<template>
  <div class="type-selector">
    <div class="type-selector__item-wrapper">
      <a @click="setRangeMode"
        :class="{
          'type-selector__item': true,
          'type-selector__item--active': value === 'start' || value === 'end'
        }">
        Daty wylot - przylot
      </a>
    </div>
    <div class="type-selector__item-wrapper">
      <a @click="setDayAndRangeMode"
        :class="{
          'type-selector__item': true,
          'type-selector__item--active': value === 'date'
        }">
        Wylot od + liczba dni
      </a>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    value: {
      type: String,
      required: false,
      default: () => 'date',
    },
  },
})
export default class TypeSelector extends Vue {
  setRangeMode () {
    this.$emit('change', 'range')
  }

  setDayAndRangeMode () {
    this.$emit('change', 'date')
  }
}
</script>

<style lang="scss">
.type-selector {
  display: flex;
  justify-content: space-around;

  background-color: #EEEEEE;
  text-transform: uppercase;

  &__item-wrapper {
    flex: 0 1 auto;
    margin: 0 -5px 0 0;
  }

  &__item {
    display: block;
    text-align: center;
    font-size: 12px;
    line-height: 0;
    font-weight: bold;
    padding: 21px 0px 17.5px 0px;
    color: #535353;
    cursor: pointer;
    margin: 0;

    &:hover {
      color: #535353;
      text-decoration: none;
    }

    &--active {
      border-bottom: 4px solid #009FEA;
      color: #009FEA;

      &:hover {
        color: #009FEA;
      }
    }
  }
}
</style>
