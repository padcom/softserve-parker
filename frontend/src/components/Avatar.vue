<template>
  <div class="avatar">
    <img class="avatar__photo" :src="avatar" :alt="user.email" />
  </div>
</template>

<script>
import md5 from 'md5'
import { Vue, Component } from 'vue-property-decorator'
import { AuthState } from '@/store/auth'

@Component()
export default class Avatar extends Vue {
  @AuthState user

  get avatar () {
    const hash = md5(this.user.email.trim().toLowerCase())
    return `https://secure.gravatar.com/avatar/${hash}?d=https://app.zeplin.io/img/emotars/emotarRobotFace.png`
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
