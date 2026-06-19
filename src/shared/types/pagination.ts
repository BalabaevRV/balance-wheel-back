export interface PaginationParams {
	page: number
	limit: number
	sortBy?: string
	sortOrder?: string
}

export interface PaginatedResponse<T> {
	items: T[]
	total: number
	page: number
	limit: number
	totalPages: number
	hasNext: boolean
	hasPrev: boolean
}

export interface PaginationQuery {
	page?: string
	limit?: string
	sortBy?: string
	sortOrder?: string
}
