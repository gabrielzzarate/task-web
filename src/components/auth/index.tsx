'use client'
import { createContext, useContext, useState, useLayoutEffect } from 'react'

const AuthContext = createContext({})

export const useAuth = () => {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return authContext
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)

  async function getToken() {
    try {
      // await api.get('/auth/me')
      // setToken(response.data.token)
    } catch (err) {
      setToken(null)
    }
  }

  useLayoutEffect(() => {
    // add token to the authorization headers of the api handler
  }, [])

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
}
