import { remove, save, clear } from '@/assets/js/array-store'
import { SEARCH_KEY } from '@/assets/js/constant'
import { useSearchStore } from '@/stores/search'

export default function useSearchHistory() {
  const maxLen = 200
  const searchStore = useSearchStore()

  function saveSearch(query: string) {
    const searches = save(query, SEARCH_KEY, (item: string) => {
      return item === query
    }, maxLen)
    searchStore.setSearchHistory(searches)
  }

  function deleteSearch(query: string) {
    const searches = remove(SEARCH_KEY, (item) => {
      return item === query
    })
    searchStore.setSearchHistory(searches)
  }

  function clearSearch() {
    const searches = clear(SEARCH_KEY)
    searchStore.setSearchHistory(searches)
  }

  return {
    saveSearch,
    deleteSearch,
    clearSearch
  }
}