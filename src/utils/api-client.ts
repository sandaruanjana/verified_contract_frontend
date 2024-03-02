import axios, { AxiosInstance } from 'axios'
import { basic_url } from '/@src/utils/basic_config'

const apiInstance: AxiosInstance = axios.create({
  baseURL: `${basic_url}/api`,
  // headers: {
  //   'Content-type': 'application/json',
  // },
})
export default apiInstance
