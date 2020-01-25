<template>
  <div class="email-field">
    <input type="text"
      :name="name"
      :class="[
        'email-field__input',
        {
          'email-field--full-width': fullWidth,
          'email-field__input--empty': isEmpty,
          'email-field__input--invalid': !valid
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
export default class EmailField extends Vue {
  @Prop({ type: String, required: true }) value
  @Prop({ type: String, default: '' }) name
  @Prop({ type: String, default: 'Email' }) placeholder
  @Prop({ type: Boolean, default: false }) fullWidth

  modified = false
  input = ''

  @Watch('value')
  onValueChanged (newValue) {
    this.input = newValue
  }

  get isValid () {
    const re = /@softserveinc.com\s*$/
    return re.test(this.input.toLowerCase())
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

.email-field {
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
