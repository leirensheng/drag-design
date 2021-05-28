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
        :list="elements"
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
          <div
            tabIndex="0"
            @click.stop
            @mousedown="handleMousedown(element, $event)"
            @keydown.delete="handleDelete"
            :style="element.getStyle()"
            class="component-wrapper"
            :class="editingElement === element && 'shape__wrapper-active'"
          >
            <div
              v-show="editingElement === element"
              v-for="point in points"
              :key="point"
              :data-point="point"
              :style="getPointStyle(point, element)"
              class="shape__scale-point"
              @mousedown.stop.prevent="
                mousedownForMark(point, $event, element, $refs[element.uuid])
              "
            ></div>
            <component
              v-contextmenu:contextmenu
              :is="element.name"
              class="element-on-edit-canvas"
              v-bind="{
                ...element.getProps(),
                editorMode: 'edit',
                isEditingElement: editingElement === element
              }"
            ></component>
          </div>
        </template>
      </draggable>
      <!-- <template v-for="element in elements" :key="element.uuid">
        <div
          tabIndex="0"
          @click.stop
          @mousedown="handleMousedown(element, $event)"
          @keydown.delete="handleDelete"
          :style="element.getStyle({ position: 'absolute' })"
          :class="editingElement === element && 'shape__wrapper-active'"
        >
          <div
            v-show="editingElement === element"
            v-for="point in points"
            :key="point"
            :data-point="point"
            :style="getPointStyle(point, element)"
            class="shape__scale-point"
            @mousedown.stop.prevent="
              mousedownForMark(point, $event, element, $refs[element.uuid])
            "
          ></div>
          <component
            v-contextmenu:contextmenu
            :is="element.name"
            class="element-on-edit-canvas"
            v-bind="{
              ...element.getProps(),
              editorMode: 'edit',
              isEditingElement: editingElement === element
            }"
          ></component>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary */
import draggable from 'vuedraggable/src/vuedraggable'
import { ref, computed } from 'vue'
import { mapActions, mapState, useStore } from 'vuex'
import { limitValue } from '@/utils/index'

const directionKey = {
  t: 'n',
  b: 's',
  l: 'w',
  r: 'e'
}

export default {
  data() {
    return {
      drag: false,
      points: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 't', 'b']
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

    function checkPoint(point) {
      const hasT = /t/.test(point)
      const hasB = /b/.test(point)
      const hasL = /l/.test(point)
      const hasR = /r/.test(point)
      return {
        hasT,
        hasB,
        hasL,
        hasR
      }
    }
    function toggleListener(action, mousemove, mouseup) {
      document[`${action}EventListener`]('mousemove', mousemove)
      document[`${action}EventListener`]('mouseup', mouseup)
    }
    const canvas = ref()
    const dragPart = () => {
      let canvasWidth
      let canvasHeight
      function limitLeft(left, width) {
        return Math.min(Math.max(left, 0), canvasWidth - width)
      }
      function limitTop(top, height) {
        return Math.min(Math.max(top, 0), canvasHeight - height)
      }
      function mousedownForElement(e, commonStyle) {
        const pos = { ...commonStyle }
        const startY = e.clientY
        const startX = e.clientX
        const startTop = pos.top
        const startLeft = pos.left
        canvasWidth = store.state.work.width
        canvasHeight =
          window.getComputedStyle(canvas.value).height.replace('px', '') - 5

        const move = (moveEvent) => {
          moveEvent.stopPropagation()
          moveEvent.preventDefault()
          window.requestAnimationFrame(() => {
            const currX = moveEvent.clientX
            const currY = moveEvent.clientY
            pos.top = limitTop(currY - startY + startTop, pos.height)
            pos.left = limitLeft(currX - startX + startLeft, pos.width)
            store.commit('setElementCommonStyle', pos)
          })
        }

        const up = () => {
          toggleListener('remove', move, up)
        }
        toggleListener('add', move, up)
      }
      return {
        mousedownForElement
      }
    }

    const canvasPart = () => {
      function handleClickCanvas(e) {
        if (!e.target.classList.contains('element-on-edit-canvas')) {
          store.commit('setEditingElement')
        }
      }
      return {
        handleClickCanvas
      }
    }

    const changeSizePart = () => {
      let canvasWidth
      let canvasHeight
      function limitHeight({ height, top }, distance, isChangeTop) {
        if (isChangeTop) {
          return limitValue(height + distance, 0, top + height)
        }
        return limitValue(height + distance, 0, canvasHeight - top)
      }
      function limitWidth({ width, left }, distance, isChangeLeft) {
        if (isChangeLeft) {
          return limitValue(width + distance, 0, left + width)
        }
        return limitValue(width + distance, 0, canvasWidth - left)
      }
      function limitLeft({ left, width }, distance) {
        return limitValue(left + distance, 0, left + width)
      }
      function limitTop({ top, height }, distance) {
        return limitValue(top + distance, 0, top + height)
      }
      function mousedownForMark(point, e, element, component) {
        const startPos = { ...element.commonStyle }
        const startX = e.clientX
        const startY = e.clientY
        canvasWidth = store.state.work.width
        canvasHeight =
          window.getComputedStyle(canvas.value).height.replace('px', '') - 5
        const move = (moveEvent) => {
          window.requestAnimationFrame(() => {
            const disY = moveEvent.clientY - startY
            const disX = moveEvent.clientX - startX
            const { hasT, hasB, hasL, hasR } = checkPoint(point)
            const res = {}
            res.left = limitLeft(startPos, hasL ? disX : 0)
            res.top = limitTop(startPos, hasT ? disY : 0)
            res.width = limitWidth(
              startPos,
              hasL ? -disX : hasR ? disX : 0,
              hasL
            )
            res.height = limitHeight(
              startPos,
              hasT ? -disY : hasB ? disY : 0,
              hasT
            )
            store.commit('setElementCommonStyle', res)
          })
        }
        const up = () => {
          toggleListener('remove', move, up)
          component.handleResize()
        }
        toggleListener('add', move, up)
      }

      return {
        mousedownForMark
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

    const getPointStylePart = () => ({
      getPointStyle(point, element) {
        const { height, width } = element.commonStyle
        const { hasT, hasB, hasL, hasR } = checkPoint(point)
        let newLeft = 0
        let newTop = 0
        if (point.length === 2) {
          newLeft = hasL ? 0 : width
          newTop = hasT ? 0 : height
        } else {
          if (hasT || hasB) {
            newLeft = width / 2
            newTop = hasT ? 0 : height
          }
          if (hasL || hasR) {
            newLeft = hasL ? 0 : width
            newTop = height / 2
          }
        }
        return {
          marginLeft: hasL || hasR ? '-3px' : 0,
          marginTop: hasT || hasB ? '-3px' : 0,
          left: `${newLeft}px`,
          top: `${newTop}px`,
          cursor: `${point
            .split('')
            .reverse()
            .map((m) => directionKey[m])
            .join('')}-resize`
        }
      }
    })

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
        {
          label: '置顶',
          value: 'move2Top'
        },
        {
          label: '置底',
          value: 'move2Bottom'
        },
        {
          label: '上移',
          value: 'addZindex'
        },
        {
          label: '下移',
          value: 'minusZindex'
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
      // ...dragPart(),
      ...canvasPart(),
      ...changeSizePart(),
      ...keyboardPart(),
      ...getPointStylePart(),
      ...contextmenuPart()
    }
  },
  methods: {
    handleMousedown(element, e) {
      this.hideContextMenu()
      this.setEditingElement(element)
      // this.mousedownForElement(e, element.commonStyle)
    },

    ...mapActions(['setEditingElement', 'updateWork'])
  }
}
</script>

<style scoped lang="scss">
.middle-panel {
  height: 100%;
  display: flex;
  justify-content: center;
  .component-wrapper {
    position: relative !important;
  }
  .shape__wrapper-active {
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
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==');
    // background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFJREFUeNpiZGBg4GegAsBlCD8TqSYNQg2Mo6FEBAAIMACdPABtrSW/IQAAAABJRU5ErkJggg==');
    background-repeat: repeat;
    background-attachment: fixed;
    background-color: #fff;
    height: 100%;
    position: relative;
    .element-on-edit-canvas {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
