<template>
  <a-modal v-model:visible="visible" :footer="null">
    <div class="json-content">
      <div class="json">
        <pre v-html="jsonHandled" v-if="visible"></pre>
      </div>
      <a-button type="primary" :data-clipboard-text="json" class="copy"
        >复制</a-button
      >
    </div>
  </a-modal>
  <div class="editor-container">
    <div class="editor-top">
      <div class="left"></div>
      <div class="right">
        <a-button size="small" @click="showJson">查看</a-button>

        <!-- <a-button>保存</a-button> -->
        <!-- <a-button size="small" @click="gotoPreview">预览</a-button> -->
      </div>
    </div>
    <div class="editor">
      <div class="left">
        <left-panel />
      </div>
      <div class="middle">
        <middle-panel v-if="$store.state.work" />
        <a-spin v-else>
          <div style="height: 100vh"></div>
        </a-spin>
      </div>
      <Width-Adjust
        @lineMove="handleLineMove"
        :checkMove="checkMove"
      ></Width-Adjust>
      <div class="right" :style="style">
        <right-panel></right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import ClipboardJS from 'clipboard'
import LeftPanel from './components/leftPanel.vue'
import MiddlePanel from './components/middlePanel.vue'
import RightPanel from './components/rightPanel.vue'
import WidthAdjust from './components/widthAdjust.vue'

export default {
  data() {
    return {
      rightWidth: 308
    }
  },
  components: {
    LeftPanel,
    RightPanel,
    WidthAdjust,
    MiddlePanel
  },
  computed: {
    style() {
      return {
        width: `${this.rightWidth}px`
      }
    }
  },
  setup() {
    const store = useStore()
    const getDataPart = () => {
      onMounted(() => {
        store.dispatch('fetchWork')
      })
      return {}
    }

    const getJsonPart = () => {
      new ClipboardJS('.copy')
      function addColor(json) {
        const temp = json
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        return temp.replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
          (match) => {
            let cls = 'number'
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = 'key'
              } else {
                cls = 'string'
              }
            } else if (/true|false/.test(match)) {
              cls = 'boolean'
            } else if (/null/.test(match)) {
              cls = 'null'
            }
            return `<span class="${cls}">${match}</span>`
          }
        )
      }

      const getJson = () => {
        const config =
          store.state.editingPage && store.state.editingPage.elements
        let res = JSON.parse(JSON.stringify(config))

        const getOne = (one) => {
          const {
            name,
            pluginProps,
            commonProps: { marginTop, marginBottom, marginLeft, marginRight }
          } = one
          const removeArr = ['uuid']
          removeArr.forEach((item) => {
            delete pluginProps[item]
          })

          const nameMap = {
            Container: 'CHART_WITH_TEXT'
          }

          const obj = {
            elementConfig: {
              ...pluginProps
            },
            type: nameMap[name] || name
          }

          const isChangeMargin =
            marginTop + marginLeft + marginBottom + marginRight !== 0
          if (isChangeMargin) {
            obj.margin = {
              top: marginTop,
              left: marginLeft,
              bottom: marginBottom,
              right: marginRight
            }
          }
          if (name.indexOf('CHART') !== -1) {
            delete obj.elementConfig.options.series[0].data
            if (obj.elementConfig.options.xAxis) {
              delete obj.elementConfig.options.xAxis.data
            }
          }
          if (one.children && one.children.length) {
            obj.items = one.children.map((_) => getOne(_))
          }
          return obj
        }

        res = res.map((one) => getOne(one))
        // console.log(JSON.stringify(res, null, 4))
        return JSON.stringify(res, null, 4)
      }
      const visible = ref(false)
      const json = ref('')
      const jsonHandled = ref('')

      const showJson = () => {
        visible.value = true
        json.value = getJson()
        jsonHandled.value = addColor(json.value)
      }

      return {
        showJson,
        visible,
        json,
        jsonHandled
      }
    }
    return {
      ...getDataPart(),
      ...getJsonPart()
    }
  },
  created() {},
  mounted() {},
  methods: {
    gotoPreview() {
      this.$router.push({ name: 'Preview' })
    },
    checkMove(offset) {
      return this.rightWidth + offset >= 266
    },
    handleLineMove(offset) {
      this.rightWidth += offset
    }
  }
}
</script>

<style scoped lang="scss">
$headerTop: 50px;
.editor-container {
  height: 100vh;
  .editor-top {
    background-color: rgb(0, 21, 41);
    height: $headerTop;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
  }
  .editor {
    height: calc(100vh - 50px);
    display: flex;
    .left {
      width: 175px;
      flex-shrink: 0;
    }
    .middle {
      flex: 1;
      background-color: #f0f2f5;
    }

    .right {
      width: 308px;
    }
  }
}
</style>
<style lang="scss">
.json-content {
  margin-top: 20px;
  z-index: 88888;
  .json {
    max-height: 60vh;
    overflow: auto;
  }
  //  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
  .string {
    color: green;
  }
  .number {
    color: darkorange;
  }
  .boolean {
    color: blue;
  }
  .null {
    color: magenta;
  }
  .key {
    color: red;
  }
  .copy {
    display: block;
    margin: 0 auto;
    margin-top: 10px;
  }
}
</style>
