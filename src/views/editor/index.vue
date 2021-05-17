<template>
  <div class="editor">
    <div class="left">
      <left-panel />
    </div>
    <div class="middle">
      <middle-panel />
    </div>
    <div class="right">
      <right-panel></right-panel>
    </div>
  </div>
</template>

<script>
import LeftPanel from './components/leftPanel.vue'
import MiddlePanel from './components/middlePanel.vue'
import RightPanel from './components/rightPanel.vue'

export default {
  data() {
    return {}
  },
  components: {
    LeftPanel,
    RightPanel,
    MiddlePanel
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.editor {
  height: 100vh;
  display: flex;
  .left {
    width: 175px;
  }
  .middle {
    flex: 1;
    background-color: #f0f2f5;
  }

  .right {
    width: 308px;
  }
}
</style>
