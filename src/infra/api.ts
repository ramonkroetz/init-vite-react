import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { getBrowserId } from 'utils'

import CookieService from './cookie'
import { CustomError } from './error'

const ENABLE_BROWSER_ID_INTERCEPTOR = false
const ENABLE_FORCED_PHASE_INTERCEPTOR = false

type ApiResponseError = {
  code: string | number
  date: string
  description: string
  trace: string
  data?: { errors: { code: string }[] }
}

export type ApiResponse<T> = AxiosResponse<T>

export const ApiService = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL_API,
})

ApiService.interceptors.response.use(
  (response: AxiosResponse<unknown>) => {
    return response
  },
  (error: AxiosError<ApiResponseError>) => {
    const defaultCode = error.response?.data?.code || error.response?.status || error.code || ''
    const codes = [
      String(defaultCode),
      ...(error.response?.data?.data?.errors?.map((e: { code: string }) => String(e.code)) || []),
    ]

    function getErrorMessage() {
      if (typeof error.response?.data === 'string') {
        return error.response?.data
      }

      if (typeof error.response?.data === 'object') {
        return error.response?.data?.description
      }

      return ''
    }

    const customError = new CustomError({
      name: 'ErrorApiResponse',
      message: getErrorMessage(),
      codes,
      status: error.response?.status,
      cause: error,
    })

    return Promise.reject(customError)
  },
)

if (ENABLE_BROWSER_ID_INTERCEPTOR) {
  const BROWSER_ID_HEADER = 'x-Coke-Br-Id'

  ApiService.interceptors.request.use(async (request) => {
    const config = { ...request }
    const browserId = await getBrowserId()
    config.headers[BROWSER_ID_HEADER] = browserId

    return config
  })
}

if (ENABLE_FORCED_PHASE_INTERCEPTOR) {
  const FORCED_PHASE_COOKIE_NAME = 'phase'

  ApiService.interceptors.request.use(async (request) => {
    const query = new URLSearchParams(window.location.search)
    const phase = query.get('phase')

    if (phase) {
      CookieService.set(FORCED_PHASE_COOKIE_NAME, phase)
    }

    const phaseToForce = CookieService.get(FORCED_PHASE_COOKIE_NAME)

    if (phaseToForce) {
      const requestWithForcedPhase = { ...request }
      requestWithForcedPhase.headers.pers_id = phaseToForce

      return requestWithForcedPhase
    }

    return request
  })
}
