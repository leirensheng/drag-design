<template>
  <img :src="imageContent" :style="style" />
</template>
<script>
import PropTypes from '@/utils/propTypes'

export default {
  name: 'IMAGE',
  data() {
    return {}
  },
  computed: {
    style() {
      return {
        height: `${this.height}px`,
        width: `${this.width}px`
      }
    }
  },
  props: {
    '@class': PropTypes.string({
      label: '@class',
      defaultValue: 'com.ccr.report.configs.ImageConfig',
      visible: false
    }),
    imageType: PropTypes.select({
      label: '类型',
      defaultValue: 'URL',
      options: [
        { label: 'URL', value: 'URL' },
        { label: 'BASE64', value: 'BASE64' }
      ]
    }),
    imageContent: PropTypes.string({
      label: '内容',
      defaultValue:
        'https://tse1-mm.cn.bing.net/th/id/R-C.99c17a64707822ed071aa73b0f41fd02?rik=XHL2flZ2h8wgEw&riu=http%3a%2f%2fwww.dnzhuti.com%2fuploads%2fallimg%2f170323%2f95-1F323144449.jpg&ehk=aYX9ubjmsW26aNvEe2oJRJwuS%2bR8VHXQk0P3gqFgUd8%3d&risl=&pid=ImgRaw'
    }),
    height: PropTypes.number({
      label: '高度',
      props: {
        formatter: (value) => `${parseInt(value)}px`
      },
      defaultValue: 300
    }),
    width: PropTypes.number({
      label: '宽度',
      props: {
        formatter: (value) => `${parseInt(value)}px`
      },
      defaultValue: 300
    })
  }
}
</script>
