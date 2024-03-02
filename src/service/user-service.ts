import apiInstance from '../utils/api-client'
import ApiListResponse from '../utils/api-list-response-interface'
import ApiResponse from '../utils/api-response-interface'
import authHeader from './auth-header'

class UserService {
  async update(user: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.put('/v1/user', user, {
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

  async updateAbilitySkill(userAbilitySkill: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.put('/v1/user/ability_skill', userAbilitySkill, {
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

  async updatePassword(updateUserPassword: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.put('/v1/user/password', updateUserPassword, {
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

  async getByDistanceRange(params: any) {
    const state: ApiListResponse = {
      status: 0,
      data: [],
      total: 0,
      isLoading: true,
      error: null,
    }
    try {
      var searchParams = new URLSearchParams()
      searchParams.append('page', params.page)
      searchParams.append('pageSize', params.pageSize)
      searchParams.append('sortField', 'DISTANCE')
      searchParams.append('sortOrder', 'ASC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('abilities', params.abilities)
      searchParams.append('skills', params.skills)
      searchParams.append('longitude', params.longitude)
      searchParams.append('latitude', params.latitude)
      searchParams.append('role', params.role)

      const result = await apiInstance.get(
        '/v1/user/distance?' + searchParams.toString(),
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      if (result.status === 200) {
        state.data = result.data.response
        state.total = result.data.total
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
    return { state }
  }

  async getById(id: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/v1/user/' + id, {
        headers: {
          Authorization: authHeader(),
        },
      })
      if (result.status === 200) {
        state.status = result.status
        state.data = result.data
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

  async saveFavourite(userFavouriteUser: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.post('/v1/user/favourite', userFavouriteUser, {
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

  async getAllFavouriteById(params: any) {
    const state: ApiListResponse = {
      status: 0,
      data: [],
      total: 0,
      isLoading: true,
      error: null,
    }
    try {
      var searchParams = new URLSearchParams()
      searchParams.append('page', params.page)
      searchParams.append('pageSize', params.pageSize)
      searchParams.append('sortField', 'NAME')
      searchParams.append('sortOrder', 'ASC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('id', params.id)

      const result = await apiInstance.get(
        '/v1/user/favourite?' + searchParams.toString(),
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      )
      if (result.status === 200) {
        state.data = result.data.response
        state.total = result.data.total
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
    return { state }
  }

  async deleteFavouriteContractorByCustomerId(formData: FormData) {
    const deleteFavouriteContractorState: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/favourite/remove', formData)
      if (result.status === 200) {
        deleteFavouriteContractorState.data = result.data
        deleteFavouriteContractorState.isLoading = false
      } else {
        deleteFavouriteContractorState.error = 'something went wrong'
        deleteFavouriteContractorState.isLoading = false
      }
      deleteFavouriteContractorState.isLoading = false
    } catch (e: any) {
      deleteFavouriteContractorState.error = e.message
      deleteFavouriteContractorState.isLoading = false
    }
    return { deleteFavouriteContractorState }
  }

  async saveFavouriteContractor(formData: FormData) {
    const saveFavouriteContractorState: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/favourite/save', formData)
      if (result.status === 200) {
        saveFavouriteContractorState.data = result.data
        saveFavouriteContractorState.isLoading = false
      } else {
        saveFavouriteContractorState.error = 'something went wrong'
        saveFavouriteContractorState.isLoading = false
      }
      saveFavouriteContractorState.isLoading = false
    } catch (e: any) {
      saveFavouriteContractorState.error = e.message
      saveFavouriteContractorState.isLoading = false
    }
    return { saveFavouriteContractorState }
  }

  async updateCustomerProfile(formData: FormData) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/customer/profile/update', formData)
      if (result.status === 200) {
        state.data = result.data
        state.isLoading = false
      } else {
        state.error = 'something went wrong'
        state.isLoading = false
      }
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async getCustomerProfile(id: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/customer/profile/details?Id=' + id)
      if (result.status === 200) {
        state.data = result.data
        state.isLoading = false
      } else {
        state.error = 'something went wrong'
        state.isLoading = false
      }
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async LoadCustomerDashboardInfo(id: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/dashboard/customer?Id=' + id)
      if (result.status === 200) {
        state.data = result.data
        state.isLoading = false
      } else {
        state.error = 'something went wrong'
        state.isLoading = false
      }
      state.isLoading = false
    } catch (e: any) {
      state.error = e.message
      state.isLoading = false
    }
    return state
  }
}

export const userService = new UserService()
