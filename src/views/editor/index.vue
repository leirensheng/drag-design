<template>
  <div class="editor-container">
    <div class="editor-top">
      <div class="left"></div>
      <div class="right">
        <!-- <a-button>保存</a-button> -->
        <a-button size="small" @click="gotoPreview">预览</a-button>
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
import { onMounted } from 'vue'
import { useStore } from 'vuex'
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
    return {
      ...getDataPart()
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
  display: flex;
  flex-direction: column;
  .editor-top {
    background-color: rgb(0, 21, 41);
    height: $headerTop;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
  }
  .editor {
    flex: 1;
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
