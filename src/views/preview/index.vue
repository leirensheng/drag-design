<template>
  <div class="preview-wrap">
    <div
      v-if="$store.state.work"
      class="preview"
      ref="canvas"
      :style="{ width: $store.state.work.width + 'px' }"
    >
      <template v-for="element in elements" :key="element.uuid">
        <div :style="element.getStyle({ position: 'absolute' })">
          <component
            :is="element.name"
            class="element-on-edit-canvas"
            v-bind="{
              ...element.getProps(),
              editorMode: 'edit'
            }"
          ></component>
        </div>
      </template>
    </div>
    <a-spin v-else>
      <div style="height: 100vh"></div>
    </a-spin>
  </div>
</template>

<script>
import { mapState, useStore } from 'vuex'
import { onMounted } from 'vue'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      elements: (state) => state.editingPage && state.editingPage.elements
    })
  },
  setup() {
    const store = useStore()

    const getDataPart = () => {
      onMounted(() => {
        // store.dispatch('fetchWork')
      })
      return {}
    }
    return {
      ...getDataPart()
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.preview-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  .preview {
    position: relative;
    width: 600px;
    height: 100vh;
    .element-on-edit-canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
