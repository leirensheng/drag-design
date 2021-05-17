<template>
  <div
    class="adjust-line-wrapper adjust-line-wrapper-v"
    @mousedown="onMousedown"
  >
    <div class="adjust-line adjust-line-v"></div>
    <div class="adjust-button">
      <div class="indicator"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    checkMove: {
      type: Function
    }
  },
  created() {},
  mounted() {},
  methods: {
    toggleListener(action, mousemove, mouseup) {
      document[`${action}EventListener`]('mousemove', mousemove, true)
      document[`${action}EventListener`]('mouseup', mouseup, true)
    },
    onMousedown(e) {
      let startX = e.clientX
      const move = (moveEvent) => {
        moveEvent.preventDefault()
        moveEvent.stopPropagation()
        const { clientX } = moveEvent
        const offset = startX - clientX
        if (this.checkMove && !this.checkMove(offset)) return
        startX -= offset
        this.$emit('lineMove', offset)
      }

      const up = () => {
        this.toggleListener('remove', move, up)
      }
      this.toggleListener('add', move, up)
    }
  }
}
</script>

<style scoped lang="scss">
$activeHoverColor: #1593ff;

.adjust-line-wrapper {
  cursor: ew-resize;
  position: relative;
  &:hover {
    .adjust-button {
      background-color: $activeHoverColor;
    }

    .adjust-line {
      border-color: $activeHoverColor;
    }
  }
  .adjust-line {
    border: 1px solid #eee;
  }

  .adjust-line-v {
    height: 100%;
  }

  .adjust-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    height: 30px;
    width: 10px;
    position: absolute;
    right: 1px;
    top: 50%;
    background-color: #fff;

    .indicator {
      margin: 0 auto;
      width: 1px;
      height: 10px;
      background-color: #ccd5db;
    }
  }
}
</style>
