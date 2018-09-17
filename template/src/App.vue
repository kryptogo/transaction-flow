<template>
<VueFlowy :chart='chart'></VueFlowy>
</template>

<style>
</style>
<script>
import {VueFlowy} from 'vue-flowy'
  
export default {
  name: 'app',
 
  components: {
    VueFlowy
  },

data: () => ({
    chart: new FlowChart()
  }),
  mounted() {
    const idea = this.chart.addElement('idea')
    const A = this.chart.addElement('A', {label: 'vscode'})
    const B = this.chart.addElement('B', {label: 'github'})
    const C = this.chart.addElement('C', {label: 'npm'})
    idea.leadsTo(A).leadsTo(B)
    A.leadsTo(C)
  }
}
</script>
