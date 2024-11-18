import { AnyKeys } from '@/types/base'

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options'

export type HttpParams = Record<string, string | number | boolean | null | undefined>

export type HttpBody = Record<string, any>

export type HttpHeaders = Record<string, string | undefined>

export type ListParams<T> = AnyKeys<T> & {
  sort?: string
  limit?: number
  offset?: number
  populate?: string
  select?: string
  sites?: string
}

export type SearchParams<T> = ListParams<T> & { query: string }

export type ReadParams = {
  populate?: string
  select?: string
  sites?: string
}
