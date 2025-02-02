// //path : src/stores/authStore.ts
// import Cookies from 'js-cookie'
// import { create } from 'zustand'
// const ACCESS_TOKEN = 'thisisjustarandomstring'
// interface AuthUser {
//   accountNo: string
//   email: string
//   role: string[]
//   exp: number
// }
// interface AuthState {
//   auth: {
//     user: AuthUser | null
//     setUser: (user: AuthUser | null) => void
//     accessToken: string
//     setAccessToken: (accessToken: string) => void
//     resetAccessToken: () => void
//     reset: () => void
//   }
// }
// export const useAuthStore = create<AuthState>()((set) => {
//   const cookieState = Cookies.get(ACCESS_TOKEN)
//   const initToken = cookieState ? JSON.parse(cookieState) : ''
//   return {
//     auth: {
//       user: null,
//       setUser: (user) =>
//         set((state) => ({ ...state, auth: { ...state.auth, user } })),
//       accessToken: initToken,
//       setAccessToken: (accessToken) =>
//         set((state) => {
//           Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
//           return { ...state, auth: { ...state.auth, accessToken } }
//         }),
//       resetAccessToken: () =>
//         set((state) => {
//           Cookies.remove(ACCESS_TOKEN)
//           return { ...state, auth: { ...state.auth, accessToken: '' } }
//         }),
//       reset: () =>
//         set((state) => {
//           Cookies.remove(ACCESS_TOKEN)
//           return {
//             ...state,
//             auth: { ...state.auth, user: null, accessToken: '' },
//           }
//         }),
//     },
//   }
// })
// // export const useAuth = () => useAuthStore((state) => state.auth)
import { create } from 'zustand'
import apiClient from '@/lib/api-client'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  fetchUser: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  fetchUser: async () => {
    try {
      const { data } = await apiClient.get('/user')
      set({ user: data, isAuthenticated: true })
    } catch {
      set({ user: null, isAuthenticated: false })
    }
  },

  logout: async () => {
    await apiClient.get('/auth/logout') // Gọi API để logout
    set({ user: null, isAuthenticated: false })
    window.location.href = '/login' // Điều hướng về trang login
  },
}))
