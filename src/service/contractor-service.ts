import ApiResponse from '../utils/api-response-interface'
import apiInstance from '/@src/utils/api-client'

class ContractorService {
  async getAllContractor() {
    const getAllContractorState: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor/all')
      if (result.status === 200) {
        getAllContractorState.data = result.data
        getAllContractorState.isLoading = false
      } else {
        getAllContractorState.error = 'something went wrong'
        getAllContractorState.isLoading = false
      }
      getAllContractorState.isLoading = false
    } catch (e: any) {
      getAllContractorState.error = e.message
      getAllContractorState.isLoading = false
    }
    return { getAllContractorState }
  }

  async getFilteredContractors(formData: FormData) {
    const getAllFilteredContractorState: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/category/customer/filter', formData)
      if (result.status === 200) {
        getAllFilteredContractorState.data = result.data ? result.data : []
        getAllFilteredContractorState.isLoading = false
      } else {
        getAllFilteredContractorState.error = 'something went wrong'
        getAllFilteredContractorState.isLoading = false
      }
      getAllFilteredContractorState.isLoading = false
    } catch (e: any) {
      getAllFilteredContractorState.error = e.message
      getAllFilteredContractorState.isLoading = false
    }
    return { getAllFilteredContractorState }
  }

  async getContractorById(id: any) {
    const getContractor: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor/profile/details?Id=' + id)
      if (result.status === 200) {
        getContractor.data = result.data
        getContractor.isLoading = false
      } else {
        getContractor.error = 'something went wrong'
        getContractor.isLoading = false
      }
      getContractor.isLoading = false
    } catch (e: any) {
      getContractor.error = e.message
      getContractor.isLoading = false
    }
    return { getContractor }
  }

  async getContractorProfileViewById(id: any) {
    const ProfileView: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor/profile-view?Id=' + id)
      if (result.status === 200) {
        ProfileView.data = result.data
        ProfileView.isLoading = false
      } else {
        ProfileView.error = 'something went wrong'
        ProfileView.isLoading = false
      }
      ProfileView.isLoading = false
    } catch (e: any) {
      ProfileView.error = e.message
      ProfileView.isLoading = false
    }
    return { ProfileView }
  }

  async getCategoriesOfContractor(id: any) {
    const getSelectedCategories: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('category/contractor/all?Id=' + id)
      if (result.status === 200) {
        getSelectedCategories.data = result.data ? result.data : []
        getSelectedCategories.isLoading = false
      } else {
        getSelectedCategories.error = 'something went wrong'
        getSelectedCategories.isLoading = false
      }
      getSelectedCategories.isLoading = false
    } catch (e: any) {
      getSelectedCategories.error = e.message
      getSelectedCategories.isLoading = false
    }
    return { getSelectedCategories }
  }

  async getAllFavouriteContractorById(id: any) {
    const getFavouriteContractor: ApiResponse = {
      status: 0,
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/favourite/getAll?Id=' + id)
      if (result.status === 200) {
        getFavouriteContractor.data = result.data
        getFavouriteContractor.isLoading = false
      } else {
        getFavouriteContractor.error = 'something went wrong'
        getFavouriteContractor.isLoading = false
      }
      getFavouriteContractor.isLoading = false
    } catch (e: any) {
      getFavouriteContractor.error = e.message
      getFavouriteContractor.isLoading = false
    }
    return { getFavouriteContractor }
  }

  async getProjectProposalByContractorId(id: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor/bit/all?Id=' + id)
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

  async getAllFeedbackByContractorId(id: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor/comments?Id=' + id)
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

  async LoadContractorDashboardInfo(id: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/dashboard/contractor?Id=' + id)
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

  async updateContractorProfile(form: FormData) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/contractor/profile/update', form)
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

  async updateAbilitiesAndCategories(formData: FormData) {
    console.log('abilities: ', formData)

    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.put('/category/contractor/update', formData)
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

  async chargeAndSubscribeCreditCard(formData: FormData) {
    console.log('chargeCreditCard: ', formData)

    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post(
        '/payment/contractor/subscribe-payment',
        formData
      )
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

  async checkIfContractorSubscribed(id: any) {
    const state = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/payment/contractor/is-subscribed?Id=' + id)
      if (result.status === 200) {
        state.data = result.data
        state.isLoading = false
      } else {
        // @ts-ignore
        state.error = 'something went wrong'
        state.isLoading = false
      }
      state.isLoading = false
    } catch (e) {
      // @ts-ignore
      state.error = e.message
      state.isLoading = false
    }
    return state
  }

  async getAllUSZips() {
    const state = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor/us_zips')
      if (result.status === 200) {
        state.data = result.data
        state.isLoading = false
      } else {
        // @ts-ignore
        state.error = 'something went wrong'
        state.isLoading = false
      }
      state.isLoading = false
    } catch (e) {
      // @ts-ignore
      state.error = e.message
      state.isLoading = false
    }
    return state
  }
}

export const contractorService = new ContractorService()
