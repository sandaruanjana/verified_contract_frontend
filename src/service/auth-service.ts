import ApiResponse from '../utils/api-response-interface'
import apiInstance from '/@src/utils/api-client'

interface LoginState {
  status: number
  data: string
  isLoading: boolean
  error: any
}

class AuthService {
  async login(user: any) {
    const _loginState: LoginState = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.post('/token', user)
      _loginState.status = result.status
      _loginState.data = result.data
      _loginState.isLoading = false
    } catch (e: any) {
      _loginState.error = e.message
      _loginState.isLoading = false
    }
    return { _loginState }
  }

  async signup(user: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.post('/signup', user)
      state.data = result.data
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async verify(id: string) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.get('/verify/' + id)
      state.data = result.data
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async get(token: string) {
    const state: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.get('/user', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      state.data = result.data
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async forgotPassword(formData: FormData) {
    const state: ApiResponse = {
      status: 0,
      data: {},
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/forgot_password', formData)
      if (result.status === 201) {
        state.status = result.status
        state.data = result.data
        state.isLoading = false
      } else if (result.status === 204) {
        state.error = 'Email not found'
        state.isLoading = false
      } else {
        state.error = 'Something went wrong!'
        state.isLoading = false
      }
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async checkResetPasswordLinkExpired(userId: string) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.get('/reset_password/' + userId)
      state.status = result.status
      state.data = result.data
      state.isLoading = false
    } catch (e: any) {
      state.status = parseInt(e.message.split('code ')[1])
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async resetPassword(updateUserPassword: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.patch('/reset_password', updateUserPassword)
      state.status = result.status
      state.data = result.data
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }
}

export const authService = new AuthService()
