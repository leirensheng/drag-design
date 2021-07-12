<template>
  <div class="right-panel" v-if="editingElement">
    <a-form
      ref="form"
      size="mini"
      class="props-config-form"
      layout="horizontal"
    >
      <template v-for="(config, propKey) in componentProps" :key="propKey">
        <a-form-item
          v-if="config.editor"
          v-bind="getFormItemProp(config.editor)"
        >
          <component
            v-if="config.isCommon"
            :is="config.editor.type"
            v-bind="getComponentProp(config.editor, propKey)"
            :value="editingElement.commonProps[propKey]"
            @update:value="
              (val) => handleCommonUpdate(val, editingElement, propKey)
            "
          ></component>
          <component
            v-else
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
import { getPropsByName } from '@/utils/element'
import commonProps from './commonProps'

export default {
  data() {
    return {}
  },

  computed: {
    componentProps() {
      if (!this.editingElement) return []
      return {
        ...commonProps,
        ...getPropsByName(this.editingElement.name)
      }
    },

    ...mapState({
      pageWidth: (state) => state.work,
      editingElement: (state) => state.editingElement
    })
  },
  created() {},
  mounted() {},
  methods: {
    handleCommonUpdate(val, editingElement, propKey) {
      editingElement.commonProps[propKey] = val
      if (editingElement.name === 'lib-pie') {
        this.$eventBus.emit('resize', editingElement.uuid)
      }
    },
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
  overflow: auto;
}
.page-setting {
  padding: 10px;
  display: flex;
  align-items: center;
}
</style>
