/* eslint-disable vue/require-default-prop */
import MusicList from '@/components/music-list/music-list.vue'
import type { Song } from '@/types'
import storage from 'good-storage'
import { defineComponent } from 'vue'
import { processSongs } from '@/service/song'
import type { Singer, AlbumsItem } from '../../types/index'


type FnType = Partial<Singer & AlbumsItem>

export default function createDetailComponent<K extends FnType>(name: string, key: string, fetch: (info: K) => Promise<{ songs: Song[] }>) {

  return defineComponent({
    name,
    components: { MusicList },
    props: {
      data: Object
    },
    setup(props) {
      const songs = ref<Song[]>([])
      const loading = ref<boolean>(true)
      const route = useRoute()
      const router = useRouter()

      const computedData = computed(() => {
        let ret = null
        const dataVal = props.data
        if (dataVal) {
          ret = dataVal
        } else {
          const cached: K = storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === route.params.id) {
            ret = cached
          }
        }
        return ret
      })
      const pic = computed(() => {
        const dataVal = computedData.value
        return dataVal && dataVal.pic
      })
      const title = computed(() => {
        const dataVal = computedData.value
        if (dataVal) {
          if ('title' in dataVal) {
            return dataVal.title
          } else {
            return dataVal.name
          }
        }
      })

      onMounted(async () => {
        const data = computedData.value
        if (!data) {
          const path = route.matched[0].path
          router.push({ path })
          return 
        }
        const result = await fetch(data)
        songs.value = await processSongs(result.songs)
        loading.value = false
      })

      return {
        pic,
        title,
        songs,
        loading
      }
    }
  })
}