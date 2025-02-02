//path : src/hooks/use-auth.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/apiClient'

export const useAuthQuery = () => {
  const queryClient = useQueryClient()

  // Fetch user từ API `/auth/user`
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const { data } = await apiClient.get('/auth/user')
      return data
    },
    retry: false, // Không tự động retry nếu request fail
    staleTime: 5 * 60 * 1000, // Giữ dữ liệu 5 phút trước khi fetch lại
  })

  // Hàm logout → Gọi API và xóa cache user
  const logout = async () => {
    await apiClient.get('/auth/logout')
    queryClient.setQueryData(['authUser'], null) // Xóa cache user
    window.location.href = '/login'
  }

  return { user, isLoading, isError, logout }
}
