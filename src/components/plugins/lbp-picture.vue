<template>
  <img :src="showUrl" alt="" srcset="" width="100%" :style="style" />
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
    showUrl() {
      return this.imgSrc || placeholderImg
    },
    style() {
      return {
        objectFit: this.fillType
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
