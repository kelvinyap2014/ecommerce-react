// ==========================================
// 1. DUMMYJSON CATALOG & PRODUCT TYPES
// ==========================================

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

export interface ProductsAPIResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// ==========================================
// 2. AUTODELIVER SUBSCRIPTION TYPES
// ==========================================

export type DeliveryFrequency = '1-week' | '2-weeks' | '4-weeks' | '8-weeks';

export interface SubscriptionConfig {
  isSubscribed: boolean;
  frequency: DeliveryFrequency;
  discountPercentage: number; // e.g., 10 for 10% Autodeliver discount
}

// ==========================================
// 3. CART TYPES
// ==========================================

export interface CartItem {
  product: Product;
  quantity: number;
  subscription: SubscriptionConfig;
}

export interface CartSummary {
  subtotal: number;
  subscriptionSavings: number;
  estimatedTax: number;
  shippingTotal: number;
  grandTotal: number;
  totalItemCount: number;
}

// ==========================================
// 4. REDUX SLICE STATE TYPES
// ==========================================

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProductState {
  items: Product[];
  selectedCategory: string;
  searchQuery: string;
  status: LoadingStatus;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
