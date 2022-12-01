import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue3-lazy'
import LoadingImgUrl from '@/assets/images/default.png'

import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'
import { load, saveAll } from './assets/js/array-store'
import { FAVORITE_KEY, PLAY_KEY } from './assets/js/constant'
import { processSongs } from './service/song'
import { usePlayerStore } from './stores/player'
import '@/assets/scss/index.scss'


function appBootstrap() {
  return new Promise(resolve => {
    const app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VueLazyLoad, {
      loading: LoadingImgUrl
    })
    app.directive('loading', loadingDirective)
    app.directive('no-result', noResultDirective)
    app.mount('#app')
    // window.__VueIns__ = app
    resolve({})
  })
}

appBootstrap().then(() => {
  const playerStore = usePlayerStore()
  const favoriteSongs = load(FAVORITE_KEY)
  const historySongs = load(PLAY_KEY)
  if(favoriteSongs.length) {
    processSongs(favoriteSongs).then((songs) => {
      playerStore.setFavoriteList(songs)
      saveAll(songs, FAVORITE_KEY)
    })
  }
  if(historySongs.length) {
    processSongs(historySongs).then((songs) => {
      playerStore.setPlayHistory(songs)
      saveAll(songs, PLAY_KEY)
    })
  }
})
