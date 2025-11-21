export interface Example {
  _id: string
  name: string
  description?: string
  quantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateExampleDto {
  name: string
  description?: string
  quantity: number
  isActive?: boolean
}

export interface UpdateExampleDto {
  name?: string
  description?: string
  quantity?: number
  isActive?: boolean
}
