import LbpPicture from './lbp-picture.vue'
import LbpText from './lbp-text.vue'
import BarChart from './barChart.vue'
import Title from './title.vue'
import Text from './text.vue'
import Table from './myTable.vue'
import PageBreak from './pageBreak.vue'
import Container from './container.vue'
import MapChart from './mapChart.vue'


const plugins = [
  {
    title: '标题',
    icon: 'photo',
    component: Title,
    visible: true,
    name: Title.name
  },
  {
    title: '模板',
    icon: 'photo',
    component: Text,
    visible: true,
    name: Text.name
  },
  {
    title: '表格',
    icon: 'photo',
    component: Table,
    visible: true,
    name: Table.name
  },
  {
    title: '分页符',
    icon: 'photo',
    component: PageBreak,
    visible: true,
    name: PageBreak.name
  },

  {
    title: '容器',
    icon: 'photo',
    component: Container,
    visible: true,
    name: Container.name
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
