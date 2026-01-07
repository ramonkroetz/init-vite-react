import { useLingui } from '@lingui/react/macro'
import type { AxiosRequestConfig } from 'axios'
import { useCallback, useRef, useState } from 'react'

import { type ApiResponse, ApiService } from '../infra/api'
import { getCustomError, logCustomError } from '../infra/error'

type ErrorMessages = Record<string | number, string>

export type ApiConfig = {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  error: {
    logName: string
    messages: { default: string } & ErrorMessages
  }
}

export type ApiArgs<ResponseData> = {
  appendUrl?: string
  body?: unknown
  config?: AxiosRequestConfig
  onSuccess?: (data: ResponseData) => void
  onError?: (errorMessage: string, filteredErrorMessages: ErrorMessages) => void
}

export type FnRunApi<ResponseData> = (args?: ApiArgs<ResponseData>) => Promise<{
  data: ResponseData | null
  errorMessage: string
  filteredErrorMessages: ErrorMessages
}>

export type LoadingStatusApi = 'idle' | 'loading' | 'finished'

export function useApi<ResponseData>(configParam: ApiConfig) {
  const { t } = useLingui()
  const [data, setData] = useState<ResponseData | null>(null)
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusApi>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const configRef = useRef(configParam)

  const runApi: FnRunApi<ResponseData> = useCallback(
    async ({ appendUrl, body, config: configRequest, onSuccess, onError }: ApiArgs<ResponseData> = {}) => {
      const config = configRef.current

      try {
        setLoadingStatus('loading')
        setErrorMessage('')

        let response: ApiResponse<ResponseData> = { data: null } as ApiResponse<ResponseData>

        const url = appendUrl ? `${config.url}${appendUrl}` : config.url

        switch (config.method) {
          case 'POST':
            response = await ApiService.post(url, body, configRequest)
            break
          case 'PUT':
            response = await ApiService.put(url, body, configRequest)
            break
          case 'DELETE':
            response = await ApiService.delete(url, { data: body, ...configRequest })
            break
          case 'GET':
            response = await ApiService.get(url, configRequest)
            break
          default:
            throw new Error(t`Invalid API method.`)
        }

        setData(response.data)

        onSuccess?.(response.data)

        return { data: response.data, errorMessage: '', filteredErrorMessages: {} }
      } catch (err) {
        const customError = getCustomError(err)
        const errorMessages = Object.entries(config.error.messages).reduce((acc: ErrorMessages, [key]) => {
          if (customError.codes.includes(key)) {
            acc[key] = config.error.messages[key]
          }

          return acc
        }, {})

        const filteredErrorMessages =
          Object.keys(errorMessages).length > 0
            ? errorMessages
            : { default: config.error.messages.default || t`An unexpected error occurred.` }

        const firstErrorMessage = Object.values(filteredErrorMessages)[0]

        setErrorMessage(firstErrorMessage)

        onError?.(firstErrorMessage, filteredErrorMessages)
        logCustomError(config.error.logName, err)

        return { errorMessage: firstErrorMessage, filteredErrorMessages, data: null }
      } finally {
        setLoadingStatus('finished')
      }
    },
    [t],
  )

  return {
    data,
    errorMessage,
    loadingStatus,
    runApi,
    setData,
  }
}
