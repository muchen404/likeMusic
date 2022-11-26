import axios from 'axios'

const ERR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://ustbhuangyi.com/music-next/' : '/'

axios.defaults.baseURL = baseURL

export interface ServerData {
  code: number;
  result: any;
}

export function get<T>(url: string, params?: any):Promise<T> {
  return axios
    .get(url, { params })
    .then((res) => {
      const serverData: ServerData = res.data
      if (serverData.code === ERR_OK) {
        return serverData.result
      }
    })
    .catch((e) => {
      console.log(e)
    })
}
