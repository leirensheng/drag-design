<template>
  <div class="middle-panel">
    <div
      class="canvas-wrapper"
      :style="style"
      ref="canvas"
      @contextmenu.prevent
      @click="handleClickCanvas"
    >
      <!-- <ContextMenu
        :style="contextmenuStyle"
        @select="handleSelect"
        @hideMenu="hideContextMenu"
      /> -->
      <template v-for="element in elements" :key="element.uuid">
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
            @mousedown.stop.prevent="mousedownForMark(point, $event, element)"
          ></div>
          <component
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
    </div>
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary */
import { reactive, ref, onMounted } from 'vue'
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
      points: ['lt', 'rt', 'lb', 'rb', 'l', 'r', 't', 'b'],
      vLines: [],
      hLines: []
    }
  },

  computed: {
    contextmenuStyle() {
      return {
        left: `${this.contextmenuPos[0]}px`,
        top: `${this.contextmenuPos[1]}px`,
        userSelect: 'none',
        position: 'absolute',
        zIndex: 999
      }
    },
    ...mapState({
      editingElement: (state) => state.editingElement,
      elements: (state) => state.editingPage && state.editingPage.elements
    })
  },
  setup() {
    const store = useStore()
    const style = reactive({
      width: '600px',
      height: '100vh'
    })
    let contextmenuPos = ref([])

    function hideContextMenu() {
      contextmenuPos = []
    }

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
        canvasWidth = Number(style.width.replace('px', ''))
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
        hideContextMenu()
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
      function mousedownForMark(point, e, element) {
        const startPos = { ...element.commonStyle }

        const startX = e.clientX
        const startY = e.clientY
        canvasWidth = Number(style.width.replace('px', ''))
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

    const getDataPart = () => {
      onMounted(() => {
        store.dispatch('fetchWork')
      })
      return {}
    }

    const getPointStylePart = () => ({
      getPointStyle(point, element) {
        const isWrapElement = true
        const { top, left, height, width } = element.commonStyle
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
          left: `${newLeft + (isWrapElement ? 0 : left)}px`,
          top: `${newTop + (isWrapElement ? 0 : top)}px`,
          cursor: `${point
            .split('')
            .reverse()
            .map((m) => directionKey[m])
            .join('')}-resize`
        }
      }
    })
    return {
      style,
      contextmenuPos,
      hideContextMenu,
      canvas,
      ...dragPart(),
      ...canvasPart(),
      ...changeSizePart(),
      ...keyboardPart(),
      ...getDataPart(),
      ...getPointStylePart()
    }
  },
  methods: {
    handleSelect({ key }) {
      this.elementManager({ type: key })
      this.hideContextMenu()
    },
    handleMousedown(element, e) {
      this.hideContextMenu()
      this.setEditingElement(element)
      this.mousedownForElement(e, element.commonStyle)
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
