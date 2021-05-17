import { ElColorPicker, ElButton, ElInput, ElPopover } from 'element-plus'
import app from '../app'
import 'element-plus/packages/theme-chalk/src/base.scss'

app.use(ElColorPicker).use(ElButton).use(ElInput).use(ElPopover)
