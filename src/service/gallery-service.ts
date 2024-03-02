import apiInstance from '../utils/api-client'
import ApiListResponse from '../utils/api-list-response-interface'
import ApiResponse from '../utils/api-response-interface'
import authHeader from './auth-header'

class GalleryService {
  async upload(formData: FormData) {
    const state: ApiResponse = {
      status: 0,
      data: {},
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/v1/user_image', formData, {
        headers: {
          Authorization: authHeader(),
        },
      })
      if (result.status === 201) {
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
    return { state }
  }

  async get(params: any) {
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
      searchParams.append('sortField', 'UPLOAD_TIME')
      searchParams.append('sortOrder', 'DESC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('userId', params.userId)
      searchParams.append('isPublic', params.isPublic)

      const result = await apiInstance.get('/v1/user_image?' + searchParams.toString(), {
        headers: {
          Authorization: authHeader(),
        },
      })
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

  async delete(id: any) {
    const state: ApiResponse = {
      status: 0,
      data: {},
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.delete('/v1/user_image/' + id, {
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
    return { state }
  }

  async getGalleryImageByCustomerId(id: any) {
    const getCustomerGallery: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/customer-gallery/all?Id=' + id)
      if (result.status === 200) {
        getCustomerGallery.data = result.data
        getCustomerGallery.isLoading = false
      } else {
        getCustomerGallery.error = 'something went wrong'
        getCustomerGallery.isLoading = false
      }
      getCustomerGallery.isLoading = false
    } catch (e: any) {
      getCustomerGallery.error = e.message
      getCustomerGallery.isLoading = false
    }
    return { getCustomerGallery }
  }

  async deleteGalleryImageByCustomerId(id: any) {
    const deleteGalleryImage: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/customer-gallery/delete?Id=' + id)
      if (result.status === 200) {
        deleteGalleryImage.data = result.data
        deleteGalleryImage.isLoading = false
      } else {
        deleteGalleryImage.error = 'something went wrong'
        deleteGalleryImage.isLoading = false
      }
      deleteGalleryImage.isLoading = false
    } catch (e: any) {
      deleteGalleryImage.error = e.message
      deleteGalleryImage.isLoading = false
    }
    return { deleteGalleryImage }
  }

  async uploadGalleryImage(formData: FormData) {
    const uploadGalleryImageState: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/customer-gallery/add', formData)
      if (result.status === 200) {
        uploadGalleryImageState.data = result.data
        uploadGalleryImageState.isLoading = false
      } else {
        uploadGalleryImageState.error = 'something went wrong'
        uploadGalleryImageState.isLoading = false
      }
      uploadGalleryImageState.isLoading = false
    } catch (e: any) {
      uploadGalleryImageState.error = e.message
      uploadGalleryImageState.isLoading = false
    }
    return { uploadGalleryImageState }
  }

  async getGalleryImageByContractorId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor-gallery/all?Id=' + id)
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

  async deleteContractorGalleryImage(id: any) {
    const deleteGalleryImage: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/contractor-gallery/delete?Id=' + id)
      if (result.status === 200) {
        deleteGalleryImage.data = result.data
        deleteGalleryImage.isLoading = false
      } else {
        deleteGalleryImage.error = 'something went wrong'
        deleteGalleryImage.isLoading = false
      }
      deleteGalleryImage.isLoading = false
    } catch (e: any) {
      deleteGalleryImage.error = e.message
      deleteGalleryImage.isLoading = false
    }
    return { deleteGalleryImage }
  }

  async uploadContractorGalleryImage(formData: FormData) {
    const uploadGalleryImageState: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/contractor-gallery/add', formData)
      if (result.status === 200) {
        uploadGalleryImageState.data = result.data
        uploadGalleryImageState.isLoading = false
      } else {
        uploadGalleryImageState.error = 'something went wrong'
        uploadGalleryImageState.isLoading = false
      }
      uploadGalleryImageState.isLoading = false
    } catch (e: any) {
      uploadGalleryImageState.error = e.message
      uploadGalleryImageState.isLoading = false
    }
    return { uploadGalleryImageState }
  }

  async getProjectGalleryByProjectId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project_image/all?ProjectId=' + id)
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

export const galleryService = new GalleryService()
