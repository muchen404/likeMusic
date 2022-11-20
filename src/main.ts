import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue3-lazy'
import LoadingImgUrl from '@/assets/images/default.png'

import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'

import '@/assets/scss/index.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueLazyLoad, {
  loading: LoadingImgUrl
})
app.directive('loading', loadingDirective)
app.directive('no-result', noResultDirective)

app.mount('#app')
