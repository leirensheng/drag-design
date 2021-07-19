import {
  Input,
  Form,
  Select,
  Button,
  message,
  Modal,
  Card,
  Menu,
  Spin,
  Table,
  InputNumber,
  Switch
} from 'ant-design-vue'
import app from '../app'
// import 'ant-design-vue/dist/antd.css'
app.config.globalProperties.$message = message
app.config.globalProperties.$confirm = Modal.confirm

app
  .use(Menu)
  .use(Card)
  .use(Input)
  .use(Form)
  .use(Select)
  .use(Button)
  .use(InputNumber)
  .use(Spin)
  .use(Switch)
  .use(Table)
