import Vue from 'vue'

Vue.filter('json', (value: any) => JSON.stringify(value, null, 2))
