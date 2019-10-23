<template>
  <div class="text-field">
    <input
      :name="name"
      :type="type"
      :class="[
      'text-field__input',
      {
        'text-field--full-width': fullWidth,
        'text-field__input--empty': isEmpty,
        'text-field__input--invalid': isInvalid
      }
    ]"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <img :src="iconSrc" v-if="iconSrc" v-on:click="iconClb" class="text-field__icon"/>
  </div>
</template>

<script>
import { Vue, Component, Prop, Model } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'

@Component()
export default class TextField extends Vue {
  @Prop({ type: String, default: 'text' }) type
  @Prop(String) placeholder
  @Prop({ type: String, default: 'black' }) color
  @Prop(String) name
  @Prop(String) label
  @Prop({ type: Boolean, default: false }) fullWidth
  @Prop({ type: Boolean, default: false }) isEmpty
  @Prop({ type: Boolean, default: false }) isInvalid
  @Prop({ type: String }) iconSrc
  @Prop({ type: Function, default: () => {} }) iconClb
  @Model('input', { type: String }) value
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.text-field {
  margin-bottom: 20px;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  &__input {
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 24px;
    color: $color-black;
    border: 2px solid $color-black;
    font-family: $font-family-open-sans;

    &:focus {
      outline: none;
    }

    &--empty {
      border-color: gray;
    }

    &--invalid {
      border-color: red;
    }
  }

  &__icon {
    position: absolute;
    right: 1.3rem;
  }
}
</style>
