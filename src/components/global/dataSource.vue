<template>
  <div class="data-source">
    <transition-group name="list" tag="div">
      <div class="item" v-for="(one, index) in dataAccess" :key="one.uniqueId">
        <CloseCircleOutlined class="close-icon" @click="removeOne(index)" />

        <div class="row">
          <span>标识：</span>
          <a-input v-model:value="one.id" @change="handleChange"></a-input>
        </div>
        <div class="row">
          <span>类型：</span>
          <a-select
            v-model:value="one.accessType"
            :options="accessTypes"
            @change="(val) => handleTypeChange(one, val)"
          ></a-select>
        </div>
        <div class="row" v-if="one.accessType === 'API'">
          <span>接口：</span>
          <a-input
            v-model:value="one.dataApiUrl"
            @change="handleChange"
          ></a-input>
        </div>
        <div class="row" v-else>
          <span>语句：</span>
          <a-input v-model:value="one.sql" @change="handleChange"></a-input>
        </div>
        <div class="row params">
          <span> 参数：</span>
          <div>
            <div
              class="row one-params"
              v-for="(oneParams, idx) in one.params"
              :key="oneParams.uniqueId"
            >
              <a-input
                v-model:value="oneParams.key"
                placeholder="字段"
                @blur="handleChange"
              ></a-input>
              <a-input
                v-model:value="oneParams.value"
                placeholder="值"
                @blur="handleChange"
              ></a-input>
              <CloseCircleOutlined @click="removeOneParams(one, idx)" />
            </div>

            <PlusCircleOutlined class="add-icon" @click="addOneParams(one)" />
          </div>
        </div>
      </div>
    </transition-group>
    <PlusCircleOutlined class="add-icon" @click="addOne" />
  </div>
</template>

<script>
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    PlusCircleOutlined,
    CloseCircleOutlined
  },
  name: 'DataSource',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      accessTypes: [
        { label: 'API', value: 'API' },
        { label: 'SQL', value: 'SQL' }
      ],
      dataAccess: []
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler() {
        const temp = JSON.parse(JSON.stringify(this.value))
        temp.forEach((one, index) => {
          const curItem = this.dataAccess[index]
          const params = curItem && curItem.params

          one.params = Object.entries(one.params || {}).map(([key, value]) => {
            const curParams = params && params.find((_) => _.key === key)
            const uniqueId = curParams ? curParams.uniqueId : this.$uniqueId()
            return {
              key,
              value,
              uniqueId
            }
          })
        })
        this.dataAccess = temp
      }
    }
  },

  mounted() {},
  methods: {
    removeOneParams(one, index) {
      one.params.splice(index, 1)
      this.handleChange()
    },
    handleChange() {
      const temp1 = JSON.parse(JSON.stringify(this.dataAccess))
      temp1.forEach((one) => {
        one.params = one.params.reduce((prev, cur) => {
          prev[cur.key] = cur.value
          return prev
        }, {})
      })
      this.$emit('update:value', temp1)
    },
    addOneParams(one) {
      one.params.push({
        key: this.getRandomId(),
        value: '',
        uniqueId: this.getRandomId()
      })
      this.handleChange()
    },
    removeOne(index) {
      this.dataAccess.splice(index, 1)
      this.handleChange()
    },
    handleTypeChange(obj, val) {
      if (val === 'API') {
        obj.sql = null
      } else {
        obj.dataApiUrl = null
      }
      this.handleChange()
    },
    addOne() {
      this.dataAccess.push({
        id: '',
        accessType: 'API',
        dataApiUrl: '',
        params: [],
        uniqueId: this.$uniqueId()
      })
    }
  }
}
</script>

<style scoped lang="scss">
.data-source {
  transition: all 0.6s;
  .add-icon {
    cursor: pointer;
  }
  .item {
    border: 1px solid rgba(240, 234, 234, 0.8);
    padding: 10px;
    margin-bottom: 10px;
    position: relative;

    .close-icon {
      cursor: pointer;
      position: absolute;
      left: 100%;
      transform: translateX(-50%) translateY(-50%);
      top: 0;
    }
    .row {
      display: flex;
      align-items: center;
      span {
        flex-shrink: 0;
      }
    }
    .params {
      align-items: flex-start;
      .one-params {
        margin-top: 10px;
        gap: 5px;
      }
    }
  }
}
</style>
