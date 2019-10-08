import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

import * as Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

moment.updateLocale('en', {
  week: {
    dow: 1,
    doy: 4
  }
})

// @ts-ignore
window.app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
