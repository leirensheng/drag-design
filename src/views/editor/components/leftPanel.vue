<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="基础组件">
      <div class="left-panel">
        <div
          class="plugin-item"
          v-for="one in plugins"
          :key="one.title"
          @click="handleAdd(one)"
        >
          {{ one.title }}
        </div>
      </div>
    </a-tab-pane>
    <a-tab-pane key="2" tab="组件2">
      <div class="left-panel">
        <div
          class="plugin-item"
          v-for="one in remotePlugins"
          :key="one.title"
          @click="handleAdd(one)"
        >
          {{ one.title }}
        </div>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import plugins from '@/components/plugins'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      plugins,
      activeKey: '1'
    }
  },
  setup() {
    const remotePluginPart = () => {
      const remoteData = [
        {
          name: 'BAR_CHART',
          nickname: '阿百川',
          pluginProps: {
            uuid: 'BAR_CHART_6d079537-a8ec-f4a7-c2f7-284ef532edc1',
            dataAccess: [],
            height: 300,
            options: {
              color: ['#1BAA1B'],
              title: {
                text: '434343',
                left: 'center',
                top: '10',
                textStyle: {
                  fontSize: '14'
                }
              },
              yAxis: {
                name: '4343',
                axisLine: {
                  show: true
                },
                axisTick: {
                  show: true
                }
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
                    color: '#000',
                    position: 'top'
                  }
                }
              ]
            }
          },
          commonProps: {
            uuid: 'BAR_CHART_6d079537-a8ec-f4a7-c2f7-284ef532edc1',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0
          }
        }
      ]
      return {
        remotePlugins: remoteData.map((one) => {
          const { component } = plugins.find((_) => _.name === one.name)
          return {
            title: one.nickname,
            icon: 'photo',
            component,
            visible: true,
            name: component.name,
            commonProps: one.commonProps,
            pluginProps: one.pluginProps
          }
        })
      }
    }
    return {
      ...remotePluginPart()
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(['elementManager']),
    handleAdd(one) {
      this.elementManager({
        type: 'add',
        value: { ...one }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.left-panel {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
<style>
.plugin-item {
  user-select: none;
  position: relative;
  margin-bottom: 10px;
  background-color: rgb(245, 248, 251);
  width: 80px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
