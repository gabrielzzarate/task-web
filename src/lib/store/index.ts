import { atomWithStorage } from 'jotai/utils'

interface AuthStore {
  token: string | null
  user: string | null
  credentials: {
    publicKey: string
    privateKey: string
  } | null
}

export const authStoreAtom = atomWithStorage<AuthStore>('auth', {
  token: null,
  user: null,
  credentials: null
})
