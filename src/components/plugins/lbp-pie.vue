<template>
  <div ref="chart" :style="style"></div>
</template>

<script>
import echarts from '@/utils/useEcharts'
import PropTypes from '@/utils/propTypes'

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
  computed: {
    style() {
      return {
        width: `${this.width}%`,
        height: `${this.height}px`
      }
    }
  },
  props: {
    height: PropTypes.number({
      label: '高度',
      props: {
        formatter: (value) => `${parseInt(value)}px`
      },
      defaultValue: 300
    }),
    width: PropTypes.number({
      label: '宽度',
      defaultValue: 100,
      props: {
        formatter: (value) => `${value}%`,
        step: 1,
        min: 0,
        max: 100
      }
    })
  },
  watch: {
    style() {
      this.handleResize()
    }
  },
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
