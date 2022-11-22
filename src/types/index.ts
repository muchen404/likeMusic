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

export type SingerFullList = SingerListGroup[]

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