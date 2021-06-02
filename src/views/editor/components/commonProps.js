import PropTypes from '@/utils/propTypes'

const map = {
  paddingTop: '上边距',
  paddingBottom: '下边距',
  paddingLeft: '左边距',
  paddingRight: '右边距'
}
const commonProps = {}
Object.entries(map).forEach(([key, label]) => {
  commonProps[key] = PropTypes.number({
    label,
    props: {
      step: 1,
      min: 0,
      formatter: (value) => `${parseInt(value)}px`
    },
    defaultValue: 0
  })
  commonProps[key].isCommon = true
})

export default commonProps
