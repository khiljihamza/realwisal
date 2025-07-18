// Global Types for Enterprise E-commerce Platform

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  addresses: Address[];
  role: 'user' | 'admin';
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  _id: string;
  name: string;
  email: string;
  password: string;
  description?: string;
  address: string;
  phoneNumber: string;
  role: 'seller';
  avatar?: {
    public_id: string;
    url: string;
  };
  zipCode: string;
  withdrawMethod?: any;
  availableBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2?: string;
  zipCode: string;
  addressType: 'home' | 'office' | 'other';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  tags?: string;
  originalPrice: number;
  discountPrice?: number;
  stock: number;
  images: ProductImage[];
  reviews: Review[];
  ratings: number;
  shopId: string;
  shop: Seller;
  sold_out: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface Review {
  user: User;
  rating: number;
  comment: string;
  productId: string;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: ProductImage[];
  shopId: string;
  qty: number;
}

export interface Order {
  _id: string;
  cart: CartItem[];
  shippingAddress: Address;
  user: User;
  totalPrice: number;
  status: 'Processing' | 'Transferred to delivery partner' | 'Shipping' | 'Received' | 'On the way' | 'Delivered';
  paymentInfo: {
    id?: string;
    status: string;
    type: string;
  };
  paidAt: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  category: string;
  start_Date: string;
  Finish_Date: string;
  status: 'Running' | 'Upcoming' | 'Ended';
  tags?: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  images: ProductImage[];
  shopId: string;
  shop: Seller;
  sold_out: number;
  createdAt: string;
}

export interface CouponCode {
  _id: string;
  name: string;
  value: number;
  minAmount?: number;
  maxAmount?: number;
  shopId: string;
  selectedProduct?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brand?: string;
  location?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'relevance';
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand';
  count?: number;
}

// Analytics Types
export interface AnalyticsData {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  topProducts: Product[];
  topCategories: { name: string; count: number }[];
  userGrowth: number[];
}

// Recommendation Types
export interface RecommendationRequest {
  userId?: string;
  productId?: string;
  category?: string;
  limit?: number;
}

export interface RecommendedProduct {
  product: Product;
  score: number;
  reason: 'similar_users' | 'similar_products' | 'category_based' | 'trending';
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'upi' | 'netbanking' | 'cod';
  name: string;
  icon?: string;
  isActive: boolean;
}

export interface PaymentGateway {
  name: string;
  provider: 'stripe' | 'paypal' | 'razorpay' | 'paytm' | 'phonepe';
  publicKey: string;
  isActive: boolean;
  supportedMethods: PaymentMethod[];
}

// Notification Types
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'promotion' | 'system';
  isRead: boolean;
  data?: any;
  createdAt: string;
}

// Chat/Message Types
export interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  receiver: string;
  text?: string;
  images?: string[];
  seen: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  groupTitle?: string;
  members: string[];
  lastMessage?: string;
  lastMessageId?: string;
  updatedAt: string;
}
