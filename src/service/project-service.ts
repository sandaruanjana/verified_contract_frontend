import ApiListResponse from '../utils/api-list-response-interface'
import ApiResponse from '../utils/api-response-interface'
import authHeader from './auth-header'
import apiInstance from '/@src/utils/api-client'

class ProjectService {
  async save(project: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.post('/v1/project', project, {
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

  async getAllByIsPublicAndDistance(params: any) {
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
      searchParams.append('sortField', 'CREATED_TIME')
      searchParams.append('sortOrder', 'DESC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('userId', params.userId)
      searchParams.append('isPublic', params.isPublic)
      searchParams.append('radius', params.radius)
      searchParams.append('category', params.category)
      searchParams.append('categoryOneId', params.categoryOneId)
      searchParams.append('categoryTwoId', params.categoryTwoId)
      searchParams.append('categoryThreeId', params.categoryThreeId)

      const result = await apiInstance.get(
        '/v1/project/public/distance?' + searchParams.toString(),
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

  async getAllAssignByPrivate(params: any) {
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
      searchParams.append('sortField', 'CREATED_TIME')
      searchParams.append('sortOrder', 'DESC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('status', params.status)

      const result = await apiInstance.get(
        '/v1/project/assign/private?' + searchParams.toString(),
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

  async getAllAssignByStatus(params: any) {
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
      searchParams.append('sortField', 'CREATED_TIME')
      searchParams.append('sortOrder', 'DESC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('status', params.status)

      const result = await apiInstance.get(
        '/v1/project/assign/status?' + searchParams.toString(),
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

  async getAllAssigneeByStatus(params: any) {
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
      searchParams.append('sortField', 'CREATED_TIME')
      searchParams.append('sortOrder', 'DESC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('status', params.status)

      const result = await apiInstance.get(
        '/v1/project/assignee/status?' + searchParams.toString(),
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

  async updateStatus(formData: FormData) {
    const state: ApiResponse = {
      status: 0,
      data: {},
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.patch('/v1/project/status', formData, {
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

  async updateStatusAndAssignUser(formData: FormData) {
    const state: ApiResponse = {
      status: 0,
      data: {},
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.patch('/v1/project/status/assign', formData, {
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

  async getImageByProjectId(projectId: any) {
    const state: ApiListResponse = {
      status: 0,
      data: [],
      total: 0,
      isLoading: true,
      error: null,
    }
    try {
      var searchParams = new URLSearchParams()
      searchParams.append('projectId', projectId)

      const result = await apiInstance.get(
        '/v1/project/image?' + searchParams.toString(),
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

  async saveBid(projectBid: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.post('/v1/project/bid', projectBid, {
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

  async getAllBids(params: any) {
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
      searchParams.append('sortField', 'PD.CREATED_TIME')
      searchParams.append('sortOrder', 'DESC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('projectId', params.projectId)

      const result = await apiInstance.get('/v1/project/bid?' + searchParams.toString(), {
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

  async saveProjectProgress(projectProgress: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }

    try {
      const result = await apiInstance.post('/v1/project/progress', projectProgress, {
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

  async getProjectProgress(params: any) {
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
      searchParams.append('sortField', 'CREATED_TIME')
      searchParams.append('sortOrder', 'DESC')
      searchParams.append('searchTerm', params.searchTerm)
      searchParams.append('projectId', params.projectId)

      const result = await apiInstance.get(
        '/v1/project/progress?' + searchParams.toString(),
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

  async getProjectProgressLastWeekNumberByProjectId(projectId: any) {
    const state: ApiResponse = {
      status: 0,
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/v1/project/progress/week/' + projectId, {
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

  async savePublicProject(formData: FormData) {
    const savePublicProjectState: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/project/add', formData)
      savePublicProjectState.data = result.data
      savePublicProjectState.isLoading = false
    } catch (e: any) {
      savePublicProjectState.error = e.message
      savePublicProjectState.isLoading = false
    }
    return { savePublicProjectState }
  }

  async getAllProjectsByCustomerId(customer_id: any) {
    const customerProjects: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/all?userId=' + customer_id)

      if (result.status === 200) {
        customerProjects.data = result.data
        customerProjects.isLoading = false
      } else {
        customerProjects.error = 'something went wrong'
        customerProjects.isLoading = false
      }
      customerProjects.isLoading = false
    } catch (e: any) {
      customerProjects.error = e.message
      customerProjects.isLoading = false
    }
    return { customerProjects }
  }

  async getProjectProgressByProjectId(project_id: any) {
    const projectProgress: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/progress/all?Id=' + project_id)

      if (result.status === 200) {
        projectProgress.data = result.data
        projectProgress.isLoading = false
      } else {
        projectProgress.error = 'something went wrong'
        projectProgress.isLoading = false
      }
      projectProgress.isLoading = false
    } catch (e: any) {
      projectProgress.error = e.message
      projectProgress.isLoading = false
    }
    return { projectProgress }
  }

  async saveProjectFeedback(formData: FormData) {
    const state: ApiResponse = {
      data: '',
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/rating/add', formData)

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
    return { state }
  }

  async getAllProjectProposalByCustomerId(customer_id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/proposal/all?Id=' + customer_id)

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

  async getAllDeleteRequestProjectByCustomerId(customer_id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/delete_request/all?Id=' + customer_id)

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

  async saveWinProject(formData: FormData) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/win-project/save', formData)

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

  async addWinProject(formData: FormData) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/win-project/add', formData)

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

  async getAllWinProjectByContractorId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/win/all?Id=' + id)

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

  async getAllContractorProjectByContractorId(id: any, currentPage: any, limit: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get(
        `/project/contractor?Id=${id}&page=${currentPage}&limit=${limit}`
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

  async deleteProjectRequest(formData: FormData) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/delete_request/add', formData)

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

  async updateProjectRequest(formData: FormData) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/project/update', formData)

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

  async getAllInitiateProjectByContractorId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/Initiate/all?Id=' + id)

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

  async getAllInitiateProjectsByContractorIdByCategories(
    id: any,
    cat_1: any,
    cat_2: any,
    cat_3: any
  ) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get(
        `/category/contractor/filter?Id=${id}&cat_1=${cat_1}&cat_2=${cat_2}&cat_3=${cat_3}`
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

  async addBidProject(formData: FormData) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.post('/project/bit', formData)

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

  async getAllBidProjectByContractorId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/bit/all?Id=' + id)

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

  async deleteBidProjectByProjectId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/bit/delete?Id=' + id)

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

  async getAllInProgressProjectsByContractorId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/inprogress/all?Id=' + id)

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

  async deleteProjectById(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
      status: 0,
    }
    try {
      const result = await apiInstance.delete('/v1/project/' + id, {
        headers: {
          Authorization: authHeader(),
        },
      })

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

  async getAllAcceptedProjectsByContractorId(id: any) {
    const state: ApiResponse = {
      data: [],
      isLoading: true,
      error: null,
    }
    try {
      const result = await apiInstance.get('/project/accept/all?Id=' + id)

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

export const projectService = new ProjectService()
