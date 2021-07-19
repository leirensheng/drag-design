<template>
  <div class="chart-config">
    <div class="chart-item" v-if="!isMap">
      <span>颜色：</span>
      <el-color-picker
        size="mini"
        v-for="(color, index) in value.color"
        :key="index"
        :model-value="color"
        @update:model-value="(val) => updateColor(index, val)"
      ></el-color-picker>
      <PlusCircleOutlined class="add-icon" @click="addOneColor" />

      <!-- <a-select v-model:value="value.colors"></a-select> -->
    </div>
    <div class="chart-item" v-else>
      <span>visualMap颜色：</span>
      <el-color-picker
        size="mini"
        v-for="(color, index) in value.visualMap.inRange.color"
        :key="index"
        :model-value="color"
        @update:model-value="(val) => updateVisualMapColor(index, val)"
      ></el-color-picker>

      <!-- <a-select v-model:value="value.colors"></a-select> -->
    </div>
    <div class="chart-item" v-if="isBar">
      <span>x轴标签间隔：</span>
      <a-input v-model:value="value.xAxis.axisLabel.interval"></a-input>
    </div>
    <div class="chart-item" v-if="isBar">
      <span>x轴标签旋转：</span>
      <a-input-number
        v-model:value="value.xAxis.axisLabel.rotate"
      ></a-input-number>
    </div>
    <div class="chart-item" v-if="isBar">
      <span>y轴名称：</span>
      <a-input v-model:value="value.yAxis.name"></a-input>
    </div>
    <div class="chart-item">
      <span>显示提示框：</span>
      <a-switch v-model:checked="value.tooltip.show"></a-switch>
    </div>
    <div class="chart-item">
      <span>提示格式：</span>
      <a-input v-model:value="value.tooltip.formatter"></a-input>
    </div>

    <div class="series" v-for="(series, index) in value.series" :key="index">
      <div class="chart-item">
        <span>显示标签：</span>
        <a-switch v-model:checked="series.label.show"></a-switch>
      </div>
      <div class="chart-item">
        <span>标签颜色：</span>
        <el-color-picker
          size="mini"
          v-model="series.label.color"
        ></el-color-picker>
      </div>
      <div class="chart-item" v-if="isBar">
        <span>标签位置：</span>
        <a-select
          :options="labelPositions"
          v-model:value="series.label.position"
        ></a-select>
      </div>
      <div class="chart-item" v-if="isBar">
        <span>柱子宽度：</span>
        <a-input v-model:value="series.barWidth"></a-input>
      </div>
    </div>
    <!-- <div class="chart-item">
      <span>文本标签：</span>
      <a-switch v-model:value="value.series.name"></a-switch>
    </div> -->
  </div>
</template>

<script>
import { PlusCircleOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    PlusCircleOutlined
  },
  name: 'ChartConfig',
  props: {
    value: {
      type: Object,
      default: () => ({
        xAxis: {}
      })
    }
  },
  computed: {
    isMap() {
      return this.value.series[0].type === 'map'
    },
    isBar() {
      return this.value.series[0].type === 'bar'
    }
  },
  data() {
    return {
      labelPositions:
        'top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight'
          .split('/')
          .map((one) => ({ label: one.trim(), value: one.trim() })),
      configs: [
        {
          name: '坐标轴间隔'
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    updateColor(index, color) {
      this.value.color[index] = color
    },
    updateVisualMapColor(index, color) {
      this.value.visualMap.inRange.color[index] = color
    },
    addOneColor() {
      if (!this.value.color) {
        this.value.color = []
      }
      this.value.color.push('rgb(0,0,0)')
    },
  }
}
</script>

<style scoped lang="scss">
.chart-config {
  border: 1px solid rgb(221, 217, 217);
  padding: 0 10px;
  .add-icon {
    cursor: pointer;
    margin-left: 5px;
  }
  .chart-item {
    margin: 15px;
    display: flex;
    height: 30px;
    align-items: center;
    align-items: center;
    span {
      flex-shrink: 0;
    }
    :last-child {
      // flex: 1;
    }
  }
  .series {
    border: 1px solid rgb(238, 234, 234);
    margin-bottom: 10px;
  }
}
</style>
