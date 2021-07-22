import LbpPicture from './lbp-picture.vue'
import LbpText from './lbp-text.vue'
import BarChart from './barChart.vue'
import Title from './title.vue'
import Text from './text.vue'
import Table from './myTable.vue'
import Container from './container.vue'
import MapChart from './mapChart.vue'
import Image from './image.vue'
import Iterate from './iterate.vue'
import Catalogue from './catalogue.vue'
import QrCode from './qrCode.vue'

const plugins = [
  {
    title: '标题',
    icon: 'photo',
    component: Title,
    visible: true,
    name: Title.name
  },
  {
    title: '文本',
    icon: 'photo',
    component: Text,
    visible: true,
    name: Text.name
  },
  {
    title: '数据表',
    icon: 'photo',
    component: Table,
    visible: true,
    name: Table.name
  },
  {
    title: '图片',
    icon: 'photo',
    component: Image,
    visible: true,
    name: Image.name
  },
  {
    title: '文本列表',
    icon: 'photo',
    component: Iterate,
    visible: true,
    name: Iterate.name
  },
  {
    title: '图文组合',
    icon: 'photo',
    component: Container,
    visible: true,
    name: Container.name
  },

  {
    title: '目录',
    icon: 'photo',
    component: Catalogue,
    visible: true,
    name: Catalogue.name
  },
  {
    title: '二维码',
    icon: 'photo',
    component: QrCode,
    visible: true,
    name: QrCode.name
  },

  // {
  //   title: '图片',
  //   icon: 'photo',
  //   component: LbpPicture,
  //   visible: true,
  //   name: LbpPicture.name
  // },
  // {
  //   title: '文本',
  //   icon: 'photo',
  //   component: LbpText,
  //   visible: true,
  //   name: LbpText.name
  // },
  {
    title: '柱形图',
    icon: 'photo',
    component: BarChart,
    visible: true,
    name: BarChart.name
  },
  {
    title: '地图',
    icon: 'photo',
    component: MapChart,
    visible: true,
    name: MapChart.name
  }
]

export default plugins
