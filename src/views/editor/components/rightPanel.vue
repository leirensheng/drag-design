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
          v-if="config.editor && config.visible !== false"
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
            v-model:checked="editingElement.pluginProps[propKey]"
            v-model="editingElement.pluginProps[propKey]"
            @change="(...arg) => handleChange(config.editor, ...arg)"
          ></component>
        </a-form-item>
      </template>
    </a-form>

    <a-button class="save-btn" type="primary" @click="showSaveDialog"
      >保存</a-button
    >
  </div>
  <div v-else class="page-setting">
    <span>页面宽度：</span>
    <a-input-number
      v-if="$store.state.work"
      v-model:value="$store.state.work.width"
    ></a-input-number>
  </div>
  <a-modal
    :visible="isShowSaveDialog"
    title="保存组件"
    @cancel="closeDialog"
    @ok="saveComponent"
  >
    <div class="dialog-item">
      <span>组件名称：</span>
      <a-input v-model:value="saveComponentName"></a-input>
    </div>
  </a-modal>
</template>

<script>
import { ref } from 'vue'
import { mapState, useStore } from 'vuex'
import { getPropsByName } from '@/utils/element'
import commonProps from './commonProps'

export default {
  data() {
    return {}
  },
  setup() {
    const store = useStore()

    const saveComponetPart = () => {
      const saveComponentName = ref('')
      const isShowSaveDialog = ref(false)
      const closeDialog = () => {
        isShowSaveDialog.value = false
        saveComponentName.value = ''
      }
      return {
        isShowSaveDialog,
        saveComponentName,
        saveComponent() {
          const { commonProps, pluginProps } = store.state.editingElement
          console.log(JSON.stringify(commonProps, null, 4))
          console.log(JSON.stringify(pluginProps, null, 4))
          closeDialog()
        },
        closeDialog,
        showSaveDialog() {
          isShowSaveDialog.value = true
        }
      }
    }
    return {
      ...saveComponetPart()
    }
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
    handleChange(config, ...arg) {
      if (this.editingElement.name === 'TITLE' && config.label === '标题类型') {
        const map = {
          1: 22,
          2: 16
        }
        const fontSize = map[arg[0]] || 14
        this.editingElement.pluginProps.fontSize = fontSize
      }
    },
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
        labelCol: { flex: '80px' },
        wrapperCol: { flex: '1' }
      }
      return {
        ...formItemLayout,
        label: editor.label,
        ...editor.layout,
        ...editor.props
      }
    }
  }
}
</script>

<style scoped lang="scss">
.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  .props-config-form {
    padding: 10px 15px 10px 10px;

    overflow: auto;
    overflow-x: hidden;
    flex: 1;
    border-bottom: 1px solid rgba(237, 238, 234, 0.8);
  }
  .save-btn {
    display: block;
    margin: 10px auto;
  }
}
.page-setting {
  padding: 10px;
  display: flex;
  align-items: center;
}
.dialog-item {
  display: flex;
  align-items: center;
  span {
    flex-shrink: 0;
  }
}
</style>
