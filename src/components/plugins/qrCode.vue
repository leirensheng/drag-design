<template>
  <div class="qr-code" :style="style">
    <img
      src="https://tse3-mm.cn.bing.net/th/id/OIP-C.vNGLLv95qnbCEMsbT6nnGAHaHa?w=197&h=197&c=7&o=5&dpr=3&pid=1.7"
    />
  </div>
</template>

<script>
import PropTypes from '@/utils/propTypes'

export default {
  name: 'QR_CODE',
  data() {
    return {}
  },
  props: {
    '@class': PropTypes.string({
      label: '@class',
      visible: false,
      defaultValue: 'com.ccr.report.configs.QrCodeConfig'
    }),
    content: PropTypes.string({
      label: '内容',
      defaultValue: ''
    }),
    alignment: PropTypes.select({
      label: '对齐方式',
      defaultValue: 'LEFT',
      options: [
        { label: '左', value: 'LEFT' },
        { label: '中', value: 'CENTER' },
        { label: '右', value: 'RIGHT' }
      ]
    })
  },
  computed: {
    style() {
      return {
        textAlign: this.alignment.toLowerCase()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.qr-code {
  img {
    width: 50px;
  }
}
</style>
