<template>
  <div class="my-text" :style="style">
    {{ template }}
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
  name: 'TEXT',
  data() {
    return {}
  },
  props: {
    '@class': PropTypes.string({
      label: '@class',
      visible: false,
      defaultValue: 'com.ccr.report.configs.TextConfig'
    }),

    alignment: PropTypes.select({
      label: '对齐方式',
      defaultValue: 'LEFT',
      options: [
        { label: '左', value: 'LEFT' },
        { label: '中', value: 'CENTER' },
        { label: '右', value: 'RIGHT' }
      ]
    }),
    template: PropTypes.textarea({
      label: '模板',
      defaultValue: '模板'
    }),
    indentFirstLine: PropTypes.boolean({
      label: '是否缩进',
      defaultValue: false
    }),
    dataAccess: PropTypes.api()
  },
  computed: {
    style() {
      return {
        textAlign: this.alignment.toLowerCase(),
        textIndent: this.indentFirstLine ? '2rem' : '0'
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss"></style>
