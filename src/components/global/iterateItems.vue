<template>
  <div class="iterate-items">
    <div v-for="(item, index) in value" :key="index" class="item">
      <div class="row">
        <span>内容：</span>
        <a-input v-model:value="item.elementConfig.template"></a-input>
      </div>

      <div class="row">
        <span>显示符号：</span>
        <a-switch
          v-model:checked="item.elementConfig.showSymbol"
          @change="(val) => simbolChange(item, val)"
        ></a-switch>
      </div>
      <div class="row" v-show="!item.elementConfig.showSymbol">
        <span>是否缩进：</span>
        <a-switch
          v-model:checked="item.elementConfig.indentFirstLine"
        ></a-switch>
      </div>
      <div class="row" v-show="!item.elementConfig.showSymbol">
        <span>对齐方式：</span>
        <a-select
          v-model:value="item.elementConfig.alignment"
          :options="alignOptions"
        ></a-select>
      </div>

      <CloseCircleOutlined class="close-icon" @click="remove(index)" />
    </div>
    <PlusCircleOutlined class="add-icon" @click="addOne" />
  </div>
</template>

<script>
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'

export default {
  name: 'iterate-items',
  components: {
    PlusCircleOutlined,
    CloseCircleOutlined
  },
  data() {
    return {
      alignOptions: [
        { label: '左', value: 'LEFT' },
        { label: '中', value: 'CENTER' },
        { label: '右', value: 'RIGHT' }
      ],
      data: []
    }
  },
  props: {
    value: {
      type: Object,
      default: () => []
    }
  },
  created() {},
  mounted() {},
  methods: {
    simbolChange(item, val) {
      if (val) {
        item.elementConfig.alignment = 'LEFT'
        item.elementConfig.indentFirstLine = false

      }
    },
    remove(index) {
      this.value.splice(index, 1)
    },
    addOne() {
      this.value.push({
        elementConfig: {
          '@class': 'com.ccr.report.configs.TextConfig',
          template: '',
          alignment: 'LEFT',
          showSymbol: false,
          indentFirstLine: false
        },
        type: 'TEXT'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.iterate-items {
  .item {
    padding: 10px;
    margin: 10px 0;
    position: relative;
    border: 1px solid rgba(240, 234, 234, 0.8);

    .row {
      display: flex;
      align-items: center;
      span {
        flex-shrink: 0;
      }
    }
    .close-icon {
      cursor: pointer;
      position: absolute;
      left: 100%;
      transform: translateX(-50%) translateY(-50%);
      top: 0;
    }

  }
}
</style>
