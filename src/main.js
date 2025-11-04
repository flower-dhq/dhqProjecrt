import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import installViewUi from '@/components/view-ui-plus'
import mount2global from '@/assets/js/mount2global'
const app = createApp(App)

mount2global(app)
installViewUi(app)
app.use(store)
app.use(router)
app.use(ViewUIPlus)
app.mount('#app')
