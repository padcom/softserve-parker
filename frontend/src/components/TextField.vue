<template>
  <div class="text-field">
    <input
      :name="name"
      :type="type"
      :class="[
      'text-field__input',
      {
        'text-field--full-width': fullWidth
      }
    ]"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
import { Vue, Component, Prop, Model } from 'vue-property-decorator'
import { AuthAction } from '@/store/auth'

@Component()
export default class TextField extends Vue {
  @Prop({ type: String, default: 'text' }) type;
  @Prop(String) placeholder;
  @Prop({ type: String, default: 'black' }) color;
  @Prop(String) name;
  @Prop(String) label;
  @Prop({ type: Boolean, default: false }) fullWidth;
  @Model('input', { type: String }) value;
}
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.text-field {
  margin-bottom: 20px;
  width: 100%;

  &__input {
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    font-size: 16px;
    line-height: 24px;
    color: $black;
    border: 2px solid $black;
    font-family: $open-sans;

    &:focus {
      outline: none;
    }
  }
}
</style>
