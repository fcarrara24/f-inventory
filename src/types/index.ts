export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
}

export interface Product {
  id: string;
  code: string;
  description: string;
  unit: number;
}

export interface Stock {
  id: string;
  productId: string;
  units: number;
  lastUpdate: string;
  product?: Product;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vat: string;
  isActive: boolean;
}

export enum OrderStatus {
  Draft = 0,
  Confirmed = 1,
  InProduction = 2,
  Ready = 3,
  Shipped = 4,
  Delivered = 5,
  Invoiced = 6,
  Cancelled = 7,
  Returned = 8
}

export enum OrderItemStatus {
  Pending = 0,
  Confirmed = 1,
  InProduction = 2,
  Ready = 3,
  Shipped = 4,
  Delivered = 5,
  BackOrder = 6,
  Cancelled = 7
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vatRate: number;
  status: OrderItemStatus;
  deliveredQuantity: number;
  deliveryDate: string | null;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  isArchived: boolean;
  totalAmount: number;
  vatAmount: number;
  totalItems: number;
  orderDate: string;
  deliveryDate: string;
  customer?: Customer;
  items?: OrderItem[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateCustomerRequest {
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vat: string;
}

export interface CreateProductRequest {
  code: string;
  description: string;
  unit: number;
}

export interface CreateStockRequest {
  productId: string;
  units: number;
}

export interface CreateOrderRequest {
  customerId: string;
  orderNumber: string;
  deliveryDate: string;
  items: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface UpdateOrderItemStatusRequest {
  status: OrderItemStatus;
}
