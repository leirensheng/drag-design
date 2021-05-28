<template>
  <div ref="chart"></div>
</template>

<script>
import echarts from '@/utils/useEcharts'
// import echarts from 'echarts'

export default {
  name: 'lib-pie',
  extra: {
    defaultStyle: {
      height: 400
    }
  },

  data() {
    return {}
  },
  props: {},
  created() {},
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.chart.setOption({
      title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: '10%'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  },
  methods: {
    handleResize() {
      this.chart.resize()
    }
  }
}
</script>

<style scoped lang="scss">
.pie-chart {
  height: 100%;
}
</style>
