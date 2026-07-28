import { getBrowserId } from 'client-error-logger'

import CookieService from './cookie'
import { CustomError } from './error'

const ENABLE_BROWSER_ID_INTERCEPTOR = false
const ENABLE_FORCED_PHASE_INTERCEPTOR = false

const BROWSER_ID_HEADER = 'x-Coke-Br-Id'
const FORCED_PHASE_COOKIE_NAME = 'phase'

const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL_API

function resolveRequestUrl(url: string): string {
  const isExternalUrl = /^(https?:)?\/\//i.test(url)
  return isExternalUrl ? url : `${BASE_URL}${url}`
}

type ApiResponseError = {
  code: string | number
  date: string
  description: string
  trace: string
  data?: { errors: { code: string }[] }
}

export type ApiResponse<T> = { data: T }

export type RequestConfig = Omit<RequestInit, 'method' | 'body'>

async function buildHeaders(extra?: HeadersInit): Promise<Headers> {
  const headers = new Headers(extra)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  if (ENABLE_BROWSER_ID_INTERCEPTOR) {
    const browserId = await getBrowserId()
    headers.set(BROWSER_ID_HEADER, browserId)
  }

  if (ENABLE_FORCED_PHASE_INTERCEPTOR) {
    const query = new URLSearchParams(window.location.search)
    const phase = query.get('phase')

    if (phase) {
      CookieService.set(FORCED_PHASE_COOKIE_NAME, phase)
    }

    const phaseToForce = CookieService.get(FORCED_PHASE_COOKIE_NAME)

    if (phaseToForce) {
      headers.set('pers_id', phaseToForce)
    }
  }

  return headers
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    let errorBody: ApiResponseError | string | undefined

    try {
      errorBody = await response.json()
    } catch {
      try {
        errorBody = await response.text()
      } catch {
        errorBody = undefined
      }
    }

    const defaultCode = (typeof errorBody === 'object' && errorBody?.code) || response.status || ''
    const codes = [
      String(defaultCode),
      ...((typeof errorBody === 'object' && errorBody?.data?.errors?.map((e) => String(e.code))) || []),
    ]

    function getErrorMessage() {
      if (typeof errorBody === 'string') return errorBody
      if (typeof errorBody === 'object') return errorBody?.description
      return ''
    }

    throw new CustomError({
      name: 'ErrorApiResponse',
      message: getErrorMessage(),
      codes,
      status: response.status,
      cause: undefined,
    })
  }

  const data: T = await response.json()
  return { data }
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  const headers = await buildHeaders(config?.headers)
  const response = await fetch(resolveRequestUrl(url), {
    ...config,
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  return handleResponse<T>(response)
}

export const ApiService = {
  get: <T>(url: string, config?: RequestConfig) => request<T>('GET', url, undefined, config),
  post: <T>(url: string, body?: unknown, config?: RequestConfig) => request<T>('POST', url, body, config),
  put: <T>(url: string, body?: unknown, config?: RequestConfig) => request<T>('PUT', url, body, config),
  delete: <T>(url: string, config?: RequestConfig & { data?: unknown }) => {
    const { data, ...rest } = config ?? {}
    return request<T>('DELETE', url, data, rest)
  },
}
