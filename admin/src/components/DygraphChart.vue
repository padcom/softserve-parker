<template>
  <div style="margin: 0 0 20px 0;">
    <div ref="legend" style="margin: 10px 0 10px 55px;"></div>
    <div ref="root" style="width: 100%;"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import format from 'date-fns/format'
import Dygraph from 'dygraphs'

@Component({})
export default class DygraphChart extends Vue {
  @Prop({ type: Array, required: true }) data?: number[]

  instance: Dygraph = undefined

  @Watch('data')
  onDataChanged (newValue: any[]) {
    this.createGraph(newValue)
  }

  mounted () {
    this.createGraph(this.data)
  }

  createGraph (data: any[]) {
    console.log('Creating graph from', data)
    if (this.instance) {
      this.instance.destroy()
    }
    // @ts-ignore
    this.instance = new Dygraph(this.$refs.root, data, {
      labels: [ 'Date', 'Utilization (%)' ],
      labelsDiv: this.$refs.legend,
      legend: 'always',
      ylabel: 'Utilization',
      labelsKMB: true,
      legendFormatter (data: dygraphs.LegendData) {
        if (data.x) return format(data.x, 'YYYY-MM-DD HH:mm:ss') + ': Utilization ' + data.series[0].y + '%'
        else return '&nbsp;'
      },
      yRangePad: 10,
      xRangePad: 10,
      showRangeSelector: true,

    })
  }
}
</script>
