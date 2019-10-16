<template>
  <header class="header container">
    <figure class="header__menu-wrapper">
      <img src="/img/menu.png" v-if="isLoggedIn"/>
    </figure>

    <figure class="header__logo-wrapper">
      <img class="header__logo" src="/img/logo.jpg" alt="SoftServe Logo" />
    </figure>

    <div class="header__right">
      <button class="header__user-menu" title="user.email">
        <Avatar />
      </button>
    </div>
  </header>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { AuthGetter } from '@/store/auth'

import Avatar from '@/components/Avatar.vue'

@Component({
  components: {
    Avatar
  }
})
export default class AppHeader extends Vue {
  @AuthGetter isLoggedIn
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.header {
  border-bottom: 1px solid $gray;
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  justify-items: flex-start;

  &__menu-wrapper,
  &__logo-wrapper {
    margin: 0;
  }

  &__menu-wrapper {
    width: 20%;
    text-align: left;
  }

  &__logo-wrapper {
    flex: 1;
  }

  &__logo {
    width: 82px;
  }

  &__right {
    width: 20%;
  }

  &__user-menu {
    background-color: white;
    border: none;
  }
}
</style>
