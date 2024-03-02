import apiInstance from '../utils/api-client'
import ApiResponse from '../utils/api-response-interface'
import authHeader from './auth-header'

class AbilityService {
  async getAll() {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/v1/ability', {
        headers: {
          Authorization: authHeader(),
        },
      })
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

export const abilityService = new AbilityService()
