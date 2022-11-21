import storage from 'good-storage'

function inertArray<T>(arr: T[], val: T, compare:() => {}, maxLen: number) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray<T>(arr: T[], compare: () => {}) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save<T>(item: T, key: string, compare: any, maxLen: number) {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove(key: string, compare: () => {}) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

export function load(key: string) {
  return storage.get(key, [])
}

export function clear(key: string) {
  storage.remove(key)
  return []
}

export function saveAll<T>(items: T[], key: string) {
  storage.set(key, items)
}
