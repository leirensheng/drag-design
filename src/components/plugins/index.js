import LbpPicture from './lbp-picture.vue'
import LbpText from './lbp-text.vue'
import LbpPie from './lbp-pie.vue'

const plugins = [
  {
    title: '图片',
    icon: 'photo',
    component: LbpPicture,
    visible: true,
    name: LbpPicture.name
  },
  {
    title: '文本',
    icon: 'photo',
    component: LbpText,
    visible: true,
    name: LbpText.name
  },
  {
    title: '饼图',
    icon: 'photo',
    component: LbpPie,
    visible: true,
    name: LbpPie.name
  }
]

export default plugins
