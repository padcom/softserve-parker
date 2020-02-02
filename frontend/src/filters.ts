import Vue from 'vue'

Vue.filter('json', (value: object) => JSON.stringify(value, null, 2))

const STASTUS_TO_STRING: { [key: string]: string } = {
  'won': 'Granted',
  'lost': 'Rejected',
  'cancelled': 'Cancelled',
  'abandoned': 'Abandoned',
}

Vue.filter('status', (value: string) => STASTUS_TO_STRING[value] || value)
