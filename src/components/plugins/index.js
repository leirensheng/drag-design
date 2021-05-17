import LbpPicture from './lbp-picture.vue'
import LbpText from './lbp-text.vue'

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
  }
]

export default plugins
