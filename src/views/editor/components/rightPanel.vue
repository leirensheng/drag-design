<template>
  <div class="right-panel" v-if="editingElement">
    <a-form
      ref="form"
      size="mini"
      class="props-config-form"
      layout="horizontal"
    >
      <template v-for="(config, propKey) in pluginProps" :key="propKey">
        <a-form-item
          v-if="config.editor"
          v-bind="getFormItemProp(config.editor)"
        >
          <component
            :is="config.editor.type"
            v-bind="getComponentProp(config.editor, propKey)"
            v-model:value="editingElement.pluginProps[propKey]"
            v-model="editingElement.pluginProps[propKey]"
          ></component>
        </a-form-item>
      </template>
    </a-form>
  </div>
  <div v-else class="page-setting">
    <span>页面宽度：</span>
    <a-input-number
      v-if="$store.state.work"
      v-model:value="$store.state.work.width"
    ></a-input-number>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import plugins from '@/components/plugins/index'

export default {
  data() {
    return {}
  },

  computed: {
    pluginProps() {
      if (!this.editingElement) return []
      const { name } = this.editingElement
      const target = plugins.find((one) => one.name === name)
      return target.component.props
    },

    ...mapState({
      pageWidth: (state) => state.work,
      editingElement: (state) => state.editingElement
    })
  },
  created() {},
  mounted() {},
  methods: {
    getComponentProp(editor) {
      return {
        ...(editor.props || {})
      }
    },
    getFormItemProp(editor) {
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16, offset: 2 }
      }
      return {
        ...formItemLayout,
        label: editor.label,
        ...editor.layout
      }
    }
  }
}
</script>

<style scoped lang="scss">
.right-panel {
  padding: 10px;
  height: 100%;
}
.page-setting {
  padding: 10px;
  display: flex;
  align-items: center;
}
</style>
