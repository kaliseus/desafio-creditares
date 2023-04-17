import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'

import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'

import App from './App.vue'
import router from './router'

import './assets/main.css'
const app = createApp(App)

app.use(Quasar, {
    plugins: {Notify},
    config: {
        notify: { position: "top-right" }
    }
})

app.use(createPinia())
app.use(router)

app.mount('#app')
