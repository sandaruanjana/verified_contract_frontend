import { useStorage } from '@vueuse/core'
const token = useStorage('token', '')

export default function authHeader() {
  if (token) {
    return 'Bearer ' + token.value
  } else {
    return ''
  }
}
