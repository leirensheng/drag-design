<template>
  <div :style="style">
    {{ text }}
  </div>
</template>

<script>
import PropTypes from '@/utils/propTypes'

export default {
  extra: {
    defaultStyle: {
      height: 'auto'
    }
  },
  name: 'lbp-text',
  data() {
    return {}
  },
  props: {
    text: PropTypes.string({
      label: '内容',
      defaultValue: '修改文字',
      visible: false
    }),
    color: PropTypes.color({
      label: '颜色',
      defaultValue: 'rgba(0,0,0,1)'
    }),
    borderWidth: PropTypes.number({ label: '边框宽度(px)', defaultValue: 0 }),
    borderRadius: PropTypes.number({ label: '圆角(px)' }),
    lineHeight: PropTypes.number({ label: '行高(px)', defaultValue: 20 }),

    borderColor: PropTypes.color({ label: '边框颜色' })
  },
  computed: {
    style() {
      return {
        position: 'relative',
        color: `${this.color}`,
        textDecoration: 'none',
        lineHeight: `${this.lineHeight}px`,
        border: `${this.borderWidth}px solid ${this.borderColor}`,
        borderRadius: `${this.borderRadius}px`
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
