import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, SearchFilters, PaginatedResponse } from '@/types';
import { api } from '@/utils/api';

// Product Queries
export const useProducts = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get<PaginatedResponse<Product>>('/products', { params: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.get<Product>(`/products/${productId}`),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useShopProducts = (shopId: string) => {
  return useQuery({
    queryKey: ['shop-products', shopId],
    queryFn: () => api.get<Product[]>(`/products/shop/${shopId}`),
    enabled: !!shopId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.get<Product[]>('/products/featured'),
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRecommendedProducts = (userId?: string, productId?: string) => {
  return useQuery({
    queryKey: ['recommended-products', userId, productId],
    queryFn: () => api.get<Product[]>('/products/recommendations', {
      params: { userId, productId }
    }),
    enabled: !!(userId || productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Product Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productData: FormData) => api.post<Product>('/products', productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => 
      api.put<Product>(`/products/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['product', variables.id], data);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productId: string) => api.delete(`/products/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, review }: { productId: string; review: any }) =>
      api.put(`/products/review/${productId}`, review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
