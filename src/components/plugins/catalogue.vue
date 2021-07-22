<template>
  <div class="catalog">目录</div>
</template>

<script>
import PropTypes from '@/utils/propTypes'

export default {
  name: 'CATALOGUE',
  data() {
    return {}
  },
  props: {
    '@class': PropTypes.string({
      label: '@class',
      visible: false,
      defaultValue: 'com.ccr.report.configs.CatalogueConfig'
    })
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.catalog {
  height: 50px;
  text-align: center;
}
</style>
