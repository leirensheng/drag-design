<template>
  <v-contextmenu ref="contextmenu">
    <v-contextmenu-item
      :key="one.label"
      v-for="one in showVerticalItems"
      @click="handleContextMenu(one.value)"
      >{{ one.label }}</v-contextmenu-item
    >
  </v-contextmenu>
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
      <draggable
        class="draggable-items"
        :list="elements"
        group="people"
        tag="transition-group"
        :component-data="{
          tag: 'div',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
        @start="drag = true"
        @end="drag = false"
        item-key="uuid"
        v-bind="dragOptions"
      >
        <template #item="{ element }">
          <component
            :ref="element.uuid"
            :style="getCommonStyle(element.commonProps, element)"
            tabIndex="0"
            :key="element.uuid"
            @click.stop="handleMousedown(element, $event)"
            @keydown.delete="handleDelete"
            :class="
              editingElement &&
              editingElement.uuid === element.uuid &&
              'is-active'
            "
            v-contextmenu:contextmenu
            :is="element.name"
            class="drag-component"
            v-bind="{
              ...element.pluginProps,
              editorMode: 'edit'
            }"
          ></component>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary */
import draggable from 'vuedraggable/src/vuedraggable'
import { ref, computed } from 'vue'
import { mapActions, mapState, useStore } from 'vuex'

export default {
  data() {
    return {
      drag: false
    }
  },
  components: {
    draggable
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    ...mapState({
      editingElement: (state) => state.editingElement,
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

    const keyboardPart = () => {
      function handleDelete() {
        store.commit('elementManager', { type: 'remove' })
      }
      return {
        handleDelete
      }
    }

    const contextmenuPart = () => {
      const contextmenuOptions = [
        {
          label: '复制',
          value: 'copy'
        },
        {
          label: '删除',
          value: 'remove'
        },
        /**
         * contextMenu 白名单，只有匹配白名单列表里的元素，才会显示该选项
         * 支持正则、数组
         * 数组：[ElementName]
         * 正则：RegExp
         */
        {
          label: 'showOnlyButton',
          value: 'showOnlyButton',
          elementWhiteList: ['lbp-button']
        },
        /**
         * contextMenu 黑名单，在黑名单列表里的元素，不会显示该选项
         * 支持正则、数组
         * 数组：[ElementName]
         * 正则：RegExp
         */
        {
          label: 'showExcludePicture',
          value: 'showExcludePicture',
          elementBlackList: /^lbp-picture/
        }
      ]
      const showVerticalItems = computed(() => {
        const { editingElement } = store.state
        if (!editingElement) {
          return []
        }
        const elementName = editingElement.name
        return contextmenuOptions.filter((option) => {
          const wl = option.elementWhiteList
          const bl = option.elementBlackList
          if (wl) {
            if (Array.isArray(wl)) return wl.includes(elementName)
            return wl.test(elementName)
          }
          if (bl) {
            if (Array.isArray(bl)) return !bl.includes(elementName)
            return !bl.test(elementName)
          }
          return true
        })
      })
      function handleContextMenu(value) {
        store.commit('elementManager', { type: value })
      }
      const contextmenu = ref(null)
      function hideContextMenu() {
        contextmenu.value.hide()
      }
      return {
        contextmenu,
        showVerticalItems,
        hideContextMenu,
        handleContextMenu
      }
    }
    return {
      canvas,
      ...canvasPart(),
      ...keyboardPart(),
      ...contextmenuPart()
    }
  },
  mounted() {
    this.$eventBus.on('resize', (uuid) => {
      this.$refs[uuid].handleResize()
    })
  },
  methods: {
    getCommonStyle({ paddingTop, paddingBottom, paddingLeft, paddingRight }) {
      return {
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`
      }
    },
    handleMousedown(element) {
      this.hideContextMenu()
      this.setEditingElement(element)
    },

    ...mapActions(['setEditingElement'])
  }
}
</script>

<style scoped lang="scss">
.middle-panel {
  height: calc(100vh - 50px);
  overflow: auto;
  .component-wrapper {
    position: relative !important;
  }
  .is-active {
    outline: 1px solid #70c0ff !important;
  }
  .shape__scale-point {
    position: absolute;
    background: #fff;
    border: 1px solid rgb(89, 199, 249);
    width: 6px;
    height: 6px;
    z-index: 1;
    border-radius: 50%;
  }
  .canvas-wrapper {
    min-height: 100%;
    margin: 0 auto;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==');
    // background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFJREFUeNpiZGBg4GegAsBlCD8TqSYNQg2Mo6FEBAAIMACdPABtrSW/IQAAAABJRU5ErkJggg==');
    background-repeat: repeat;
    background-attachment: fixed;
    background-color: #fff;
    position: relative;
  }
}
</style>
