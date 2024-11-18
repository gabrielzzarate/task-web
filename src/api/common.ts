import type { Base, AnyKeys } from '@/types/base'
import hmac from 'crypto-js/hmac-sha512'
import type {
  HttpMethod,
  HttpHeaders,
  HttpBody,
  HttpParams,
  ListParams,
  ReadParams,
} from '@/types/http'
import { ApiError } from '@/utils/errors'
import { flattenObject } from '@/lib/utils'
import { apiHost } from '@/lib/env'
import { isServer } from '@/utils'
import { authStoreAtom } from '@/lib/store'
import { atom } from 'jotai'


export class Service<Model extends Base> {
  basePath: string
  host: string

  constructor(basePath: string, host: string = apiHost) {
    this.basePath = basePath
    this.host = host
  }

  async read(id: string, params?: ReadParams): Promise<Model> {
    return this.get(`${this.basePath}/${id}`, params ? flattenObject(params) : undefined)
  }

  async create(body: AnyKeys<Model>): Promise<Model> {
    return this.post(`${this.basePath}`, body)
  }

  async list(params?: ListParams<Model>): Promise<Model[]> {
    return this.get(`${this.basePath}`, params ? flattenObject(params) : undefined)
  }

  async readAndUpdate(id: string, body: AnyKeys<Model>): Promise<Model> {
    return this.put(`${this.basePath}/${id}`, body)
  }

  async readAndDelete(id: string, params?: HttpParams): Promise<Model> {
    return this.delete(`${this.basePath}/${id}`, params)
  }

  async get<T>(path: string, params?: HttpParams): Promise<T> {
    return this.request({ path, method: 'get', params })
  }

  async delete<T>(path: string, params?: HttpParams): Promise<T> {
    return this.request({ path, method: 'delete', params })
  }

  async post<T>(path: string, body?: HttpBody): Promise<T> {
    return this.request({ path, method: 'post', body })
  }

  async put<T>(path: string, body?: HttpBody): Promise<T> {
    return this.request({ path, method: 'put', body })
  }

  async patch<T>(path: string, body: HttpBody): Promise<T> {
    return this.request({ path, method: 'patch', body })
  }

  async request<T>(props: {
    path: string
    method: HttpMethod
    params?: HttpParams
    body?: HttpBody
  }): Promise<T> {
    // Build request
    const req = this.buildAuthRequest(props)

    // Issue request
    const res = await fetch(`${this.host}${req.path}`, {
      method: props.method.toUpperCase(),
      body: req.body,
      headers: {
        'content-type': 'application/json',
        ...req.headers
      }
    })

    // Parse json response
    const json = await res.json()

    // Throw response as an error if we did not receive a 200
    if (!res.ok) {
      if (res.status === 401 && req.path !== '/auth/login') {
        this.handleUnauthorizedRequest()
      }
      throw new ApiError(res.status, json.message, json.error)
    }

    return json
  }

  protected buildAuthRequest(props: {
    path: string
    method: HttpMethod
    params?: HttpParams
    body?: HttpBody
  }): { path: string; headers: HttpHeaders; body?: string } {
    const credentials = atom(get => get(authStoreAtom)?.credentials)

    console.log('credentials', credentials)
    const timestamp = Date.now()

    const { path, params, body } = this.buildRequest(props)

    // const signature = credentials
    //   ? hmac(`${timestamp}.${props.method}.${props.path}.${params ?? body}`, credentials?.privateKey)
    //   : undefined

    return {
      path,
      body,
      headers: {
        // authorization: credentials ? `bearer ${credentials.publicKey}` : undefined,
        'x-api-timestamp': timestamp.toString(),
        // 'x-api-signature': signature?.toString()
      }
    }
  }

  protected buildRequest(props: {
    path: string
    method: HttpMethod
    params?: HttpParams
    body?: HttpBody
  }): { path: string; params?: string; body?: string } {
    let params = undefined
    let body = undefined

    switch (props.method) {
      case 'get':
      case 'delete':
      case 'options': {
        params = props.params
          ? Object.keys(props.params)
              .sort()
              .filter(
                (key: string) => props.params?.[key] !== undefined && props.params?.[key] !== null
              )
              .map((key: string) => [
                encodeURIComponent(key),
                encodeURIComponent(props.params?.[key] as string | number | boolean)
              ])
              .map(([key, value]) => `${key}=${value}`)
              .join('&')
          : ''
        break
      }
      case 'post':
      case 'put':
      case 'patch': {
        body = JSON.stringify(props.body ?? {})
        break
      }
      default:
        throw new Error('Invalid request method')
    }

    return {
      path: [props.path, params].filter(Boolean).join('?'),
      params,
      body: body
    }
  }

  protected handleUnauthorizedRequest() {
    if (isServer) return
    useAuthStore.getState().clear()
    const url = `/auth?from=${encodeURIComponent(window.location.pathname)}`
    setTimeout(() => (window.location.href = url), 100)
  }
  }
}
