import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { type ApiResponse, ApiService } from '../infra/api'
import { getCustomError, logCustomError } from '../infra/error'

export type Keys = 'todo'

type ErrorMessages = Record<string | number, string>
type ErrorState = { firstErrorMessage: string; errorMessages: ErrorMessages }

type ErrorApiConfig = {
  logName: string
  messages: { default: string } & ErrorMessages
}

type ApiQueryConfig<ResponseData> = {
  key: Keys
  url: string
  error: ErrorApiConfig
  requestConfig?: AxiosRequestConfig
  execute?: boolean
  cacheTime?: number
  initialData?: ResponseData
}

export function useQueryApi<ResponseData>({
  key,
  url,
  requestConfig,
  execute = true,
  cacheTime = 0,
  initialData,
  error,
}: ApiQueryConfig<ResponseData>) {
  return useQuery<ResponseData, ErrorState>({
    queryKey: [key],
    queryFn: async () => {
      try {
        const response: ApiResponse<ResponseData> = await ApiService.get(url, requestConfig)
        return response.data
      } catch (err) {
        throw handleError(error, err)
      }
    },
    enabled: execute,
    retry: false,
    retryOnMount: false,
    staleTime: cacheTime,
    initialData: initialData,
  })
}

type ApiMutationConfig<ResponseData, BodyObject> = {
  url: string
  method: 'POST' | 'PUT' | 'DELETE'
  error: {
    logName: string
    messages: { default: string } & ErrorMessages
  }
  requestConfig?: AxiosRequestConfig
  onError?: (error: ErrorState, body: BodyObject) => Promise<void>
  onSuccess?: (data: ResponseData, body: BodyObject) => Promise<void>
  onSettled?: (data: ResponseData | undefined, error: ErrorState | null, body: BodyObject) => Promise<void>
  invalidateQueries?: Keys[]
}

export function useMutationApi<ResponseData, BodyObject = void>({
  url,
  method,
  requestConfig,
  error,
  onError,
  onSuccess,
  onSettled,
  invalidateQueries = [],
}: ApiMutationConfig<ResponseData, BodyObject>) {
  const queryClient = useQueryClient()

  return useMutation<ResponseData, ErrorState, BodyObject>({
    mutationFn: async (body) => {
      try {
        let response: ApiResponse<ResponseData> = { data: null } as ApiResponse<ResponseData>

        switch (method) {
          case 'POST':
            response = await ApiService.post(url, body, requestConfig)
            break
          case 'PUT':
            response = await ApiService.put(url, body, requestConfig)
            break
          case 'DELETE':
            response = await ApiService.delete(url, { data: body, ...requestConfig })
            break
          default:
            throw new Error('Invalid API method.')
        }

        return response.data
      } catch (err) {
        throw handleError(error, err)
      }
    },
    onError: async (error, body) => {
      await onError?.(error, body)
    },
    onSuccess: async (data, body) => {
      await onSuccess?.(data, body)
      if (invalidateQueries?.length > 0) {
        queryClient.invalidateQueries({ queryKey: invalidateQueries })
      }
    },
    onSettled: async (data, error, body) => {
      await onSettled?.(data, error, body)
    },
  })
}

function handleError(config: ErrorApiConfig, err: unknown) {
  const customError = getCustomError(err)
  const errorMessages = Object.entries(config.messages).reduce((acc: ErrorMessages, [key]) => {
    if (customError.codes.includes(key)) {
      acc[key] = config.messages[key]
    }

    return acc
  }, {})

  const filteredErrorMessages =
    Object.keys(errorMessages).length > 0 ? errorMessages : { default: config.messages.default }

  const firstErrorMessage = Object.values(filteredErrorMessages)[0]
  logCustomError(config.logName, err)

  return { firstErrorMessage, errorMessages: filteredErrorMessages } as ErrorState
}
