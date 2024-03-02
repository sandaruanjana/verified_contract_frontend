import ApiResponse from '../utils/api-response-interface'
import apiInstance from '/@src/utils/api-client'

class ProfileViewService {
  async saveContractorProfileViewInfo(formData: FormData) {
    const ContractorProfileViewInfoState: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/contractor/profile-view', formData)
      ContractorProfileViewInfoState.data = result.data
      ContractorProfileViewInfoState.isLoading = false
    } catch (e: any) {
      ContractorProfileViewInfoState.error = e.message
      ContractorProfileViewInfoState.isLoading = false
    }
    return {ContractorProfileViewInfoState}
  }
}

export const profileViewService = new ProfileViewService()
