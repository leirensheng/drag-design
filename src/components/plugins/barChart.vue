<template>
  <div ref="chart" :style="style"></div>
</template>

<script>
import echarts from '@/utils/useEcharts'
import PropTypes from '@/utils/propTypes'

export default {
  name: 'BAR_CHART',
  extra: {
    defaultStyle: {
      height: 400
    }
  },

  data() {
    return {}
  },
  created() {},
  computed: {
    style() {
      return {
        width: `${this.width}%`,
        height: `${this.height}px`
      }
    }
  },
  props: {
    dataAccess: PropTypes.api(),

    height: PropTypes.number({
      label: '高度',
      props: {
        formatter: (value) => `${parseInt(value)}px`
      },
      defaultValue: 300
    }),
    options: PropTypes.chartOption({
      defaultValue: {
        color: ['#8671DA'],
        yAxis: {
          name: '',
          axisLine: {
            show: true
          },
          axisTick: { show: true }
        },
        xAxis: {
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

          axisLabel: {
            interval: 'auto',
            rotate: 0
          }
        },
        tooltip: {
          show: true
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            barWidth: '50%',
            label: {
              show: true,
              color:'#000',
              position: 'top'
            }
          }
        ]
      }
    })

    // width: PropTypes.number({
    //   label: '宽度',
    //   defaultValue: 100,
    //   props: {
    //     formatter: (value) => `${value}%`,
    //     step: 1,
    //     min: 0,
    //     max: 100
    //   }
    // })
  },
  watch: {
    style() {
      this.handleResize()
    },
    options: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (!this.chart) {
            this.chart = echarts.init(this.$refs.chart)
          }
          this.chart.setOption(val)
        })
      }
    }
  },

  methods: {
    handleResize() {
      this.chart.resize()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
