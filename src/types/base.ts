export interface Base {
  id: string
  createdAt: string
  updatedAt: string
}

export type AnyKeys<T> = { [P in keyof T]?: T[P] | any }
