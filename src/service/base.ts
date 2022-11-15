import axios from 'axios'

const ERR_OK = 0
const baseURL = '/'

axios.defaults.baseURL = baseURL

export interface ServerData {
  code: number;
  result: any;
}

export function get(url: string, params?: any) {
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
