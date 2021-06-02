import mitt from 'mitt'
import app from './app'
import router from './router/index'
import regisGlobal from './components/global'
import 'normalize.css'
import './style/index.scss'
import './utils/elementUi'
import store from './store/index'
import './utils/antDesignUI'
import './utils/contextmenu'

const eventBus = mitt()
app.config.globalProperties.$eventBus = eventBus

regisGlobal(app)
app.use(router).use(store).mount('#app')
