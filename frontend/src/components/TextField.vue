<template>
  <div class="text-field">
    <input type="text"
      :name="name"
      :class="[
        'text-field__input',
        {
          'text-field--full-width': fullWidth,
          'text-field__input--empty': isEmpty,
          'text-field__input--invalid': !valid
        }
      ]"
      :placeholder="placeholder"
      :value="value"
      @input="modified = true; $emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component()
export default class TextField extends Vue {
  @Prop({ type: String, required: true }) value
  @Prop(String) placeholder
  @Prop({ type: String, default: '' }) name
  @Prop({ type: Boolean, default: false }) fullWidth
  @Prop({ type: Boolean, default: true }) isValid

  modified = false
  input = ''

  @Watch('value')
  onValueChanged (newValue) {
    this.input = newValue
  }

  get isEmpty () {
    return this.input.length === 0
  }

  get valid () {
    return !this.modified || this.isValid
  }
}
</script>

<style lang="scss">
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
