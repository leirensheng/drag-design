<template>
  <div :style="wrapStyle">
    <img :src="showUrl" alt="" srcset="" :style="style" />
  </div>
</template>

<script>
import PropTypes from '@/utils/propTypes'
import placeholderImg from '@/assets/lbp-picture-placeholder.png'

export default {
  name: 'lbp-picture',

  data() {
    return {}
  },
  props: {
    height: PropTypes.number({
      label: '高度',
      props: {
        formatter: (value) => `${parseInt(value)}px`
      },
      defaultValue: 40
    }),
    width: PropTypes.number({
      label: '宽度',
      defaultValue: 100,
      props: {
        formatter: (value) => `${value}%`,
        step: 1,
        min: 0,
        max: 100
      }
    }),
    imgSrc: PropTypes.image(),
    fillType: {
      type: String,
      default: 'contain',
      editor: {
        type: 'a-select',
        label: '填充方式',
        props: {
          options: [
            { label: 'contain 短边缩放', value: 'contain' },
            { label: 'cover 长边缩放', value: 'cover' },
            { label: 'fill 拉伸', value: 'fill' },
            { label: 'none 原始', value: 'none' },
            { label: 'scale-down 弹性缩放', value: 'scale-down' }
          ]
        }
      }
    }
  },

  computed: {
    wrapStyle() {
      return {
        width: `${this.width}%`,
        height: `${this.height}px`
      }
    },
    showUrl() {
      return this.imgSrc || placeholderImg
    },
    style() {
      return {
        width: '100%',
        height: '100%',
        objectFit: this.fillType
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
