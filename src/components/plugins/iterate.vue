<template>
  <div>
    <div
      v-for="(item, index) in items"
      :key="index"
      :style="getStyle(item.elementConfig)"
    >
      <ul v-if="item.elementConfig.showSymbol">
        <li>
          {{ item.elementConfig.template }}
        </li>
      </ul>
      <span v-else> {{ item.elementConfig.template }}</span>
    </div>
  </div>
</template>
<script>
import PropTypes from '@/utils/propTypes'

const uniqueId = Math.random().toString(16).slice(-6)
export default {
  name: 'ITERATE',
  data() {
    return {}
  },
  computed: {},
  methods: {
    getStyle({ alignment, indentFirstLine }) {
      return {
        textAlign: alignment.toLowerCase(),
        textIndent: indentFirstLine ? '2rem' : '0'
      }
    }
  },
  props: {
    '@class': PropTypes.string({
      label: '@class',
      defaultValue: 'com.ccr.report.configs.IterateConfig',
      visible: false
    }),
    dataAccess: PropTypes.api(),
    items: PropTypes.items({
      defaultValue: [
        {
          elementConfig: {
            '@class': 'com.ccr.report.configs.TextConfig',
            template: '{title}',
            alignment: 'LEFT',
            showSymbol: false,
            indentFirstLine: false
          },
          uniqueId,
          type: 'TEXT'
        }
      ]
    })
  }
}
</script>
