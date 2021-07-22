<template>
  <div ref="chart" :style="style"></div>
</template>

<script>
import echarts from '@/utils/useEcharts'
import PropTypes from '@/utils/propTypes'
import { MapChart } from 'echarts/charts'
import { VisualMapComponent } from 'echarts/components'
import geoJson from './geoData.json'
import mapData from './mapData.json'

echarts.use([VisualMapComponent])
echarts.use([MapChart])
const { seriesData, visualMapMin, visualMapMax } = mapData

export default {
  name: 'MAP_CHART',
  extra: {
    defaultStyle: {
      height: 400
    }
  },

  data() {
    return {}
  },
  created() {
    echarts.registerMap('GD', geoJson)
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
    '@class': PropTypes.string({
      label: '@class',
      visible: false,
      defaultValue: 'com.ccr.report.configs.ChartConfig'
    }),
    dataAccess: PropTypes.api(),

    height: PropTypes.number({
      label: '高度',
      props: {
        formatter: (value) => `${parseInt(value)}px`
      },
      defaultValue: 400
    }),
    options: PropTypes.chartOption({
      defaultValue: {
        title: {
          text: '',
          left: 'center',
          top: '10',
          textStyle: {
            fontSize: '14'
          }
        },
        tooltip: {
          show: true,
          formatter: ''
        },
        visualMap: {
          min: visualMapMin,
          max: visualMapMax,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#84c9f4', '#fdfe01', '#ff4500']
          }
        },

        series: [
          {
            name: 'MAP',
            type: 'map',
            mapType: 'GD',
            data: seriesData,
            // layoutCenter: ['50%', '50%'],
            // layoutSize: '100%',
            roam: false, // 是否开启平游或缩放
            // scaleLimit: { // 滚轮缩放的极限控制
            //   min: 0.7,
            //   max: 5
            // },
            label: {
              show: true,
              color: '#000'
              //   offset: [50, 50]
            }, // 地图中文字内容及样式控制
            emphasis: {
              show: true
            }
          }
        ]
      }
    })
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

<style scoped lang="scss"></style>
