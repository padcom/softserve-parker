<template>
  <table class="debugger">
    <tr>
      <td>mode</td>
      <td>{{ selectionMode }}</td>
    </tr>
    <tr>
      <td>valid</td>
      <td>{{ valid.start.format('YYYY-MM-DD') }} - {{ valid.end.format('YYYY-MM-DD') }}</td>
    </tr>
    <tr>
      <td>highlight</td>
      <td>{{ highlighted.start.format('YYYY-MM-DD') }} - {{ highlighted.end.format('YYYY-MM-DD') }}</td>
    </tr>
    <tr>
      <td>selected</td>
      <td>{{ selected.start.format('YYYY-MM-DD') }} - {{ selected.end.format('YYYY-MM-DD') }}</td>
    </tr>
    <tr>
      <td>display</td>
      <td>{{ display.start.format('YYYY-MM-DD') }} - {{ display.end.format('YYYY-MM-DD') }}</td>
    </tr>
  </table>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: ['selectionMode', 'valid', 'highlighted', 'selected', 'display']
})
export default class Debugger extends Vue {}
</script>

<style lang="scss">
.debugger {
  //  display: none;
  & td {
    padding: 2px 10px;
  }
}
</style>
