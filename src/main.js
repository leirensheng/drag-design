import addGlobalProperty from './utils/globalProperty'
import app from './app'
import router from './router/index'
import regisGlobal from './components/global'
import 'normalize.css'
import './style/index.scss'
import './utils/elementUi'
import store from './store/index'
import './utils/antDesignUI'
import './utils/contextmenu'
import 'clipboard'

addGlobalProperty(app)
regisGlobal(app)
app.use(router).use(store).mount('#app')
