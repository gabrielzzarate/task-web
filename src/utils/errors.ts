export type ErrorData = {
  [key: string]: any
}

export class ApiError extends Error {
  private _status: number
  private _data: ErrorData | null

  constructor(status: number, message: string, data: ErrorData | null = null) {
    super(message)
    this._status = status
    this._data = data
  }

  get status() {
    return this._status
  }

  get data() {
    return this._data
  }
}
