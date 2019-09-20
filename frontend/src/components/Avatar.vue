<template>
  <div class="avatar">
    <div class="avatar__photo">&nbsp;</div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";

@Component()
export default class Avatar extends Vue {}
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.avatar {
  width: 100%;
  display: flex;
  justify-content: center;

  &__photo {
    background-color: $gray;
    width: 150px;
    height: 150px;
    border-radius: 100%;
  }
}
</style>
