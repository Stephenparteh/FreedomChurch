export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiSuccess<T> {
  success: true
  data: T
  pagination?: PaginationMeta
}

export interface ApiErrorBody {
  success: false
  error: {
    message: string
    code: string
  }
}
