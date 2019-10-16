<template>
  <button
    :disabled="disabled"
    :name="name"
    :type="type"
    @click="$emit('click')"
    v-bind:class="[
      'btn',
      `btn--${color}`,
      {
        'btn--full-width': fullWidth,
        'btn--outlined': outlined,
        'btn--disabled': disabled
      }
    ]"
  >
    <img class="btn__icon" v-if="icon" :src="icon" />
    {{ text }}
  </button>
</template>

<script>
import { Vue, Component, Prop } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'

@Component()
export default class Btn extends Vue {
  @Prop({ type: String, default: '' }) text
  @Prop(String) name
  @Prop({ type: String, default: 'button' }) type
  @Prop({ type: String, default: 'black' }) color
  @Prop({ type: Boolean, default: false }) outlined
  @Prop({ type: Boolean, default: false }) fullWidth
  @Prop({ type: Boolean, default: false }) disabled
  @Prop({ type: [String, Boolean], default: false }) icon
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.btn {
  padding: 14px;
  font-family: $proxima-nova;
  font-weight: $proxima-nova-extra-bold;
  font-size: 16px;
  line-height: 20px;
  text-transform: uppercase;
  border: none;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:focus {
    outline: none;
  }

  &--black {
    color: $white-text;
    background-color: $black;
  }

  &--outlined {
    background-color: transparent;
    border: 2px solid $black;
    color: $black;
  }

  &--full-width {
    display: block;
    width: 100%;
  }

  &--disabled {
    color: $gray;
    border-color: $gray;
  }

  &__icon {
    height: 20px;
    vertical-align: middle;
    margin-right: 5px;
  }
}
</style>
