import { SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

export const useSearchStore = defineStore('search', () => {

  const searchHistory = ref<string[]>(load(SEARCH_KEY))

  function setSearchHistory(searches: string[]) {
    searchHistory.value = searches
  }

  return {
    searchHistory,
    setSearchHistory
  }
})