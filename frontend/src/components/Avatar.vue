<template>
  <div class="avatar">
    <img class="avatar__photo" :src="avatar" :alt="user.email" />
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { AuthState } from '@/store/auth'

@Component()
export default class Avatar extends Vue {
  @AuthState user

  get avatar () {
    return 'https://secure.gravatar.com/avatar/b02561c95ce6ce7c56547ca98f8f4c66?d=https://app.zeplin.io/img/emotars/emotarRobotFace.png'
  }
}
</script>

<style lang="scss">
@import '../styles/variables';

.avatar {
  background-color: white;
  border: none;

  &__photo {
    vertical-align: middle;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>
