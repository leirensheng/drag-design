<template>
  <div class="">
    <!-- <v-contextmenu ref="contextmenu">
      <v-contextmenu-item
        :key="one.label"
        v-for="one in showVerticalItems"
        @click="handleContextMenu(one.value)"
        >{{ one.label }}</v-contextmenu-item
      >
    </v-contextmenu> -->
          <!-- v-contextmenu:contextmenu -->

    <draggable
      class="draggable-items"
      :list="list"
      group="people"
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
          @keydown.delete.stop="handleDelete"
          :class="
            editingElement &&
            editingElement.uuid === element.uuid &&
            'is-active'
          "
          :is="element.name"
          class="drag-component"
          v-bind="{
            ...element.pluginProps,
            editorMode: 'edit'
          }"
        >
          <drag-part
            v-if="element.children"
            :list="element.children"
            :parentUuid="parentUuid + '~' + element.uuid"
          ></drag-part>
        </component>
      </template>
    </draggable>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { mapActions, mapState, useStore } from 'vuex'
import draggable from 'vuedraggable/src/vuedraggable'

export default {
  name: 'DragPart',
  data() {
    return {
      drag: false
    }
  },
  components: {
    draggable
  },
  setup(props) {
    const store = useStore()

    // const contextmenuPart = () => {
    //   const contextmenuOptions = [
    //     {
    //       label: '复制',
    //       value: 'copy'
    //     },
    //     {
    //       label: '删除',
    //       value: 'remove'
    //     },
    //     /**
    //      * contextMenu 白名单，只有匹配白名单列表里的元素，才会显示该选项
    //      * 支持正则、数组
    //      * 数组：[ElementName]
    //      * 正则：RegExp
    //      */
    //     {
    //       label: 'showOnlyButton',
    //       value: 'showOnlyButton',
    //       elementWhiteList: ['lbp-button']
    //     },
    //     /**
    //      * contextMenu 黑名单，在黑名单列表里的元素，不会显示该选项
    //      * 支持正则、数组
    //      * 数组：[ElementName]
    //      * 正则：RegExp
    //      */
    //     {
    //       label: 'showExcludePicture',
    //       value: 'showExcludePicture',
    //       elementBlackList: /^lbp-picture/
    //     }
    //   ]
    //   const showVerticalItems = computed(() => {
    //     const { editingElement } = store.state
    //     if (!editingElement) {
    //       return []
    //     }
    //     const elementName = editingElement.name
    //     return contextmenuOptions.filter((option) => {
    //       const wl = option.elementWhiteList
    //       const bl = option.elementBlackList
    //       if (wl) {
    //         if (Array.isArray(wl)) return wl.includes(elementName)
    //         return wl.test(elementName)
    //       }
    //       if (bl) {
    //         if (Array.isArray(bl)) return !bl.includes(elementName)
    //         return !bl.test(elementName)
    //       }
    //       return true
    //     })
    //   })
    //   function handleContextMenu(value) {
    //     store.commit('elementManager', { type: value })
    //   }
    //   const contextmenu = ref(null)
    //   function hideContextMenu() {
    //     contextmenu.value.hide()
    //   }
    //   return {
    //     contextmenu,
    //     showVerticalItems,
    //     hideContextMenu,
    //     handleContextMenu
    //   }
    // }

    const keyboardPart = () => {
      function handleDelete() {
        store.commit('elementManager', {
          type: 'remove',
          parentUuid: props.parentUuid
        })
      }
      return {
        handleDelete
      }
    }
    return {
      // ...contextmenuPart(),
      ...keyboardPart()
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    parentUuid: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.$eventBus.on('resize', (uuid) => {
      if (this.$refs[uuid]) {
        this.$refs[uuid].handleResize()
      }
    })
  },
  computed: {
    ...mapState({
      editingElement: (state) => state.editingElement
    }),
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  created() {},
  methods: {
    ...mapActions(['setEditingElement']),

    handleMousedown(element) {
      //   this.hideContextMenu()
      this.setEditingElement(element)
    },
    getCommonStyle({ marginTop, marginBottom, marginLeft, marginRight }) {
      return {
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`
      }
    }
  }
}
</script>

<style scoped lang="scss">
.component-wrapper {
  position: relative !important;
}
.is-active {
  outline: 1px solid #70c0ff !important;
  z-index: 888;
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
</style>
