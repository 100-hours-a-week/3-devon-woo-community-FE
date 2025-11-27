export interface ValidationError {
  field: string
  message: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string | null
  data: T | null
  errors: ValidationError[] | null
}

export const createSuccessResponse = <T>(
  data?: T,
  message?: string | null
): ApiResponse<T> => ({
  success: true,
  message: message ?? null,
  data: data ?? null,
  errors: null,
})

export const createErrorResponse = (
  message: string,
  errors?: ValidationError[] | null
): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
  errors: errors ?? null,
})
