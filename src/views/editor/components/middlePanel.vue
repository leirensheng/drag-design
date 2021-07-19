<template>
  <div class="middle-panel">
    <div
      class="canvas-wrapper"
      :style="{
        width: $store.state.work.width + 'px'
      }"
      ref="canvas"
      @contextmenu.prevent
      @click="handleClickCanvas"
    >
      <drag-part :list="elements"></drag-part>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary */
import { ref } from 'vue'
import { mapState, useStore } from 'vuex'

export default {
  data() {
    return {}
  },
  components: {},

  computed: {
    ...mapState({
      elements: (state) => state.editingPage && state.editingPage.elements
    })
  },
  setup() {
    const store = useStore()

    const canvas = ref()

    const canvasPart = () => {
      function handleClickCanvas(e) {
        if (!e.target.classList.contains('drag-component')) {
          store.commit('setEditingElement')
        }
      }
      return {
        handleClickCanvas
      }
    }

    return {
      canvas,
      ...canvasPart()
    }
  },

  methods: {}
}
</script>

<style scoped lang="scss">
.middle-panel {
  height: calc(100vh - 50px);
  overflow: auto;

  .canvas-wrapper {
    min-height: 100%;
    margin: 0 auto;
    border: 1px solid transparent;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==');
    // background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFJREFUeNpiZGBg4GegAsBlCD8TqSYNQg2Mo6FEBAAIMACdPABtrSW/IQAAAABJRU5ErkJggg==');
    background-repeat: repeat;
    background-attachment: fixed;
    background-color: #fff;
    position: relative;
  }
}
</style>
