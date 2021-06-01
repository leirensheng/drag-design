<template>
  <div class="preview-wrap">
    <div
      v-if="$store.state.work"
      class="preview"
      ref="canvas"
      :style="{ width: $store.state.work.width + 'px' }"
    >
      <template v-for="element in elements" :key="element.uuid">
        <component
          :is="element.name"
          class="element-on-edit-canvas"
          v-bind="{
            ...element.pluginProps,
            editorMode: 'edit',
            isEditingElement: editingElement === element
          }"
        ></component>
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
  name: 'Preview',
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
    height: 100vh;
  }
}
</style>
