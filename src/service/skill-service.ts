import apiInstance from '../utils/api-client'
import ApiResponse from '../utils/api-response-interface'
import authHeader from './auth-header'

class SkillService {
  async getAllByType(type: string) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/v1/skill?type=' + type, {
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

export const skillService = new SkillService()
