export type SliderItem = {
  id: string
  link: string
  pic: string
}

export type AlbumsItem = {
  id: number
  pic: string
  title: string
  username: string
}

export interface Singer {
  id: number,
  mid: string,
  name: string,
  pic: string
}

export interface SingerListGroup {
  title: string,
  list: Singer[]
}

export interface SongListItemInTopList {
  id: number
  singerName: string
  songName: string
}

export interface TopListItem {
  id: number
  name: string
  period: string
  pic: string
  songList: SongListItemInTopList[]
}

export type SingerFullList = SingerListGroup[]

export interface HotKey {
  id: number
  key: string
}

export interface Song {
  album:  string
  duration:  number
  id:  number
  mid:  string
  name:  string
  pic:  string
  singer:  string
  url:  string
  lyric?: string
}

export interface BSPosition {x: number, y: number}