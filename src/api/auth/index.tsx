import { apiHost } from '@/lib/env'
import { ZodError } from 'zod'
import { ApiError } from '@/utils/errors'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  password: string
  created_at: string
  updated_at: string
}

export async function getUser(userId: string) {
  try {
    const requestUrl = `${apiHost}/users/${userId}`
    const response = await fetch(requestUrl, { method: 'GET' })

    const json = await response.json()
    return json?.user?.[0]
  } catch (error) {
    console.error('error', error)
  }
}

export async function checkAccountExists(email: string) {
  console.log('apiHost', apiHost)
  try {
    const requestUrl = `${apiHost}/auth/check-account`
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const json = await response.json()
    return json?.userExists
  } catch (error) {
    console.error('error', error)
  }
}

export async function login(data: Pick<User, 'email' | 'password'>) {
  const requestUrl = `${apiHost}/auth/login`
  const res = await fetch(requestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const json = await res.json()
  if (!res.ok) {
    if (json.details) {
      throw new ZodError(json)
    }
    throw new ApiError(res.status, json.message, json.error)
  }
  console.log('json!!', json)
  localStorage.setItem('user', JSON.stringify({ email: json.email, token: json.token }))

  return json
}

export async function signup(user: Pick<User, 'email' | 'password' | 'first_name' | 'last_name'>) {
  try {
    const requestUrl = `${apiHost}/auth/signup`
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    })

    const json = await response.json()

    if ('success' === json.message) {
      // set user in local storage
      localStorage.setItem('user', JSON.stringify({ email: json.email, token: json.token }))
      return json
      // return json.user
    } else {
      return json
    }
  } catch (error) {
    console.error('error', error)
  }
}

export async function verifyToken(token: string) {
  try {
    const requestUrl = `${apiHost}/auth/verify`
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })

    const json = await response.json()
    return json
  } catch (error) {
    console.error('error', error)
  }
}
