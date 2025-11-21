import { apiService } from '@/shared/services/api.service'
import type { Example, CreateExampleDto, UpdateExampleDto } from '../types/example.types'

export class ExampleService {
  /**
   * Get all examples
   */
  async getAll() {
    return apiService.get<Example[]>('/api/examples')
  }

  /**
   * Get example by ID
   */
  async getById(id: string) {
    return apiService.get<Example>(`/api/examples/${id}`)
  }

  /**
   * Create new example
   */
  async create(data: CreateExampleDto) {
    return apiService.post<Example>('/api/examples', data)
  }

  /**
   * Update example
   */
  async update(id: string, data: UpdateExampleDto) {
    return apiService.put<Example>(`/api/examples/${id}`, data)
  }

  /**
   * Delete example
   */
  async delete(id: string) {
    return apiService.delete(`/api/examples/${id}`)
  }
}

// Export singleton instance
export const exampleService = new ExampleService()
