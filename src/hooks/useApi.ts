import {
  type QueryObserverResult,
  type RefetchOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { type ApiResponse, ApiService, type RequestConfig } from '../infra/api'
import { getCustomError, logCustomError } from '../infra/error'

export type Keys = 'duel-cards'

type ErrorMessages = Record<string | number, string>
export type ErrorState = { firstErrorMessage: string; errorMessages: ErrorMessages }

type ErrorApiConfig = {
  logName: string
  messages: { default: string } & ErrorMessages
}

type ApiQueryConfig<ResponseData> = {
  key: Keys
  url: string
  error: ErrorApiConfig
  requestConfig?: RequestConfig
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
    queryKey: [key, url],
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
    refetchOnWindowFocus: false,
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
  requestConfig?: RequestConfig
  onError?: (error: ErrorState, body: BodyObject) => Promise<void> | void
  onSuccess?: (data: ResponseData, body: BodyObject) => Promise<void> | void
  onSettled?: (data: ResponseData | undefined, error: ErrorState | null, body: BodyObject) => Promise<void>
  refetchQueries?: Keys[]
  removeQueries?: Keys[]
}

export function useMutationApi<ResponseData, BodyObject = void>({
  url,
  method,
  requestConfig,
  error,
  onError,
  onSuccess,
  onSettled,
  refetchQueries = [],
  removeQueries = [],
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
      if (refetchQueries?.length > 0) {
        await Promise.all(refetchQueries.map((key) => queryClient.refetchQueries({ queryKey: [key] })))
      }

      if (removeQueries?.length > 0) {
        removeQueries.forEach((key: Keys) => {
          queryClient.removeQueries({ queryKey: [key] })
        })
      }
    },
    onSettled: async (data, error, body) => {
      await onSettled?.(data, error, body)
    },
  })
}

function handleError(config: ErrorApiConfig, err: unknown) {
  const customError = getCustomError(err)
  const codes = new Set(customError.codes)
  const errorMessages: ErrorMessages = {}

  for (const [key, message] of Object.entries(config.messages)) {
    if (codes.has(key)) {
      errorMessages[key] = message
    }
  }

  const filteredErrorMessages =
    Object.keys(errorMessages).length > 0 ? errorMessages : { default: config.messages.default }

  const firstErrorMessage = Object.values(filteredErrorMessages)[0]
  logCustomError(config.logName, err)

  return { firstErrorMessage, errorMessages: filteredErrorMessages } as ErrorState
}

export type RefetchFn<T> = (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<T, ErrorState>>

export function createDefaultRefetchResult<T>(data: T): QueryObserverResult<T, ErrorState> {
  return {
    data,
    error: null,
    status: 'success',
    isError: false,
    isPending: false,
    isSuccess: true,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isPlaceholderData: false,
    isFetching: false,
    isFetched: true,
    isRefetching: false,
    isStale: false,
    failureCount: 0,
    failureReason: null,
  } as QueryObserverResult<T, ErrorState>
}
