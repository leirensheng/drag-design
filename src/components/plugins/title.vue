<template>
  <div class="title1" :style="style" :data-series="showSeries">
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
  name: 'TITLE',
  data() {
    return {}
  },
  props: {
    level: PropTypes.select({
      label: '标题类型',
      defaultValue: 1,
      options: [
        {
          label: '一级',
          value: 1
        },
        {
          label: '二级',
          value: 2
        },
        {
          label: '三级',
          value: 3
        },
        {
          label: '四级',
          value: 4
        },
        {
          label: '五级',
          value: 5
        }
      ]
    }),
    fontSize: PropTypes.number({
      label: '字体大小',
      defaultValue: 22
    }),
    serialNum: PropTypes.number({
      label: '序号',
      defaultValue: 1
    }),
    serialNumStyle: PropTypes.select({
      label: '序号样式',
      defaultValue: 'CN_NUMBER',
      options: [
        { label: '数字类型', value: 'NUMBER' },
        { label: '数字带右括号', value: 'NUMBER_WITH_RP' },
        { label: '中文数字', value: 'CN_NUMBER' },
        { label: '中文数字带括号', value: 'CN_NUMBER_WITH_PARENTHESIS' },
        { label: '大写英文字母', value: 'UPPER_CASE_LETTER' },
        { label: '小写英文字母', value: 'LOWER_CASE_LETTER' }
      ]
    }),
    // level: PropTypes.string({
    //   label: 'level',
    //   defaultValue: '1',
    //   visible: false
    // }),
    alignment: PropTypes.string({
      label: 'level',
      defaultValue: 'LEFT',
      visible: false
    }),
    fontFamily: PropTypes.string({
      label: '字体',
      defaultValue: '黑体'
    }),

    '@class': PropTypes.string({
      label: '@class',
      visible: false,
      defaultValue: 'com.ccr.report.configs.TitleConfig'
    }),
    text: PropTypes.string({
      label: '内容',
      defaultValue: '标题'
    }),
    color: PropTypes.color({
      label: '颜色',
      defaultValue: 'rgba(0,0,0,1)'
    })
  },
  computed: {
    showSeries() {
      const map = {
        NUMBER: [1, 2, 3, 4, 5, 6],
        NUMBER_WITH_RP: ['1)', '2)', '3)', '4)', '5)', '6)'],
        CN_NUMBER_WITH_PARENTHESIS: [
          '（一）',
          '（二）',
          '（三）',
          '（四）',
          '（五）',
          '（六）'
        ],
        CN_NUMBER: ['一', '二', '三', '四', '五', '六'],
        UPPER_CASE_LETTER: ['A', 'B', 'C', 'D', 'E', 'F'],
        LOWER_CASE_LETTER: ['a', 'b', 'c', 'd', 'e', 'f']
      }
      return (
        map[this.serialNumStyle] &&
        `${map[this.serialNumStyle][this.serialNum - 1]}.`
      )
    },
    style() {
      return {
        position: 'relative',
        color: `${this.color}`,
        textDecoration: 'none',
        fontFamily: this.fontFamily,
        fontSize: `${this.fontSize}px`
      }
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="scss">
.title1 {
  &::before {
    content: attr(data-series);
    display: inline-block;
  }
}
</style>
