<template>
  <header class="header container">
    <figure class="header__menu-wrapper">
      <router-link :to="menuUrl">
        <img :src="menuIcon" v-if="isLoggedIn"/>
      </router-link>
    </figure>

    <figure class="header__logo-wrapper">
      <img class="header__logo" src="/img/logo.jpg" alt="SoftServe Logo" />
    </figure>

    <div class="header__right">
      <button class="header__user-menu" v-if="isLoggedIn" @click="userMenu = true">
        <Avatar />
        <PopupMenu v-if="userMenu" @close="userMenu = false" :links="userMenuLinks" />
      </button>
    </div>
  </header>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import { AuthGetter } from '@/store/auth'

import Defocuser from 'defocuser'

import Avatar from '@/components/Avatar.vue'
import PopupMenu from '@/components/PopupMenu.vue'

@Component({
  components: {
    Avatar,
    PopupMenu
  }
})
export default class AppHeader extends Vue {
  @AuthGetter isLoggedIn

  userMenu = false
  userMenuLinks = [
    { url: '/logout', title: 'Logout' }
  ]

  icons = {
    'home': { icon: '/img/menu.png', route: 'faq' },
    'faq': { icon: '/img/faq.png', route: '/' }
  }

  get menuIcon () {
    return this.icons[this.$route.name] ? this.icons[this.$route.name].icon : '/img/menu.png'
  }

  get menuUrl () {
    return this.icons[this.$route.name] ? this.icons[this.$route.name].route : '/'
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/variables';

.header {
  border-bottom: 1px solid $color-gray;
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
    text-align: right;
  }

  &__user-menu {
    background-color: white;
    border: none;
    margin: 0;
    padding: 0;
    position: relative;
    outline: none;
  }
}
</style>
