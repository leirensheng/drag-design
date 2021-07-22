<template>
  <div class="container" :style="style">
    <slot class="slot-content"></slot>
  </div>
</template>

<script>
import PropTypes from '@/utils/propTypes'

export default {
  name: 'Container',
  data() {
    return {}
  },
  props: {
    height: PropTypes.number({
      label: '高度',
      props: {
        formatter: (value) => `${parseInt(value)}px`
      },
      defaultValue: 300
    })
  },
  computed: {
    style() {
      return {
        height: `${this.height}px`
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  border: 2px dotted rgb(211, 209, 209);
  min-height: 250px;
  //   .slot-content {
  //     min-height: 20px;
  //   }
}
</style>
