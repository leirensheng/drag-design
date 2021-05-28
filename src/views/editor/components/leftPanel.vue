<template>
  <div class="left-panel">
    <draggable
      :list="plugins"
      @start="drag = true"
      @end="drag = false"
      item-key="name"
    >
      <template #item="{ element }">
        <div class="plugin-item">
          <span> {{ element.title }}</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import plugins from '@/components/plugins'
import { mapMutations } from 'vuex'
import draggable from 'vuedraggable/src/vuedraggable'

let dragDom = null

const dragConfig = {
  isDrag: false, // 正式拖拽
  origin: {
    clientY: 0, // 鼠标按下时候时候值
    clientX: 0,
    layerX: 0, // 鼠标.x 相对于元素左上角.left 的偏移
    layerY: 0 // 鼠标.y 相对于元素左上角.top  的偏移
  }
}
export default {
  components: {
    draggable
  },
  data() {
    return {
      plugins
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapMutations(['elementManager']),

    toggleListener(action) {
      document[`${action}EventListener`]('mousemove', this.mousemove)
      document[`${action}EventListener`]('mouseup', this.mouseup)
    },
    startDrag(element, e) {
      if (e.button !== 0) return
      this.dragElement = element
      const { layerX, layerY, clientX, clientY } = e
      dragConfig.origin.layerX = layerX
      dragConfig.origin.layerY = layerY
      dragConfig.origin.clientX = clientX
      dragConfig.origin.clientY = clientY

      dragDom = e.currentTarget.cloneNode(true)
      document.body.appendChild(dragDom)
      dragDom.style.position = 'absolute'
      dragDom.style.left = `${e.clientX - layerX}px`
      dragDom.style.top = `${e.clientY - layerY}px`
      dragDom.classList.add('dragging-dom-ele', 'hidden')

      this.toggleListener('add')
    },
    mousemove(e) {
      dragDom.classList.remove('hidden')
      const { layerX, layerY } = dragConfig.origin
      dragDom.style.left = `${e.clientX - layerX}px`
      dragDom.style.top = `${e.clientY - layerY}px`
    },
    checkCanDrop(source, target) {
      const checkLeft = source.left + 25 > target.left
      const checkTop = source.top + 15 > target.top
      const checkRight = source.left + 50 < target.left + target.width
      return checkLeft && checkTop && checkRight
    },

    mouseup(e) {
      this.toggleListener('remove')
      const { layerX, layerY } = dragConfig.origin

      document.body.removeChild(dragDom)
      dragDom = null

      const canvasWrapper = document.querySelector('.canvas-wrapper')
      const { left, top, width } = canvasWrapper.getBoundingClientRect()

      if (
        this.checkCanDrop(
          { left: e.clientX - layerX, top: e.clientY - layerY },
          { left, top, width }
        )
      ) {
        this.elementManager({
          type: 'add',
          value: {
            ...this.dragElement,
            dragStyle: {
              left: e.clientX - layerX - left,
              top: e.clientY - layerY - top
            }
          }
        })
      }
      this.dragElement = null
    }
  }
}
</script>

<style scoped lang="scss">
.left-panel {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
<style>
.plugin-item {
  user-select: none;
  position: relative;
  margin-bottom: 10px;
  background-color: rgb(245, 248, 251);
  width: 80px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
