import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Product, 
  Stock, 
  Customer, 
  Order, 
  OrderItem, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  CreateCustomerRequest,
  CreateProductRequest,
  CreateStockRequest,
  CreateOrderRequest,
  CreateOrderItemRequest,
  UpdateOrderStatusRequest,
  UpdateOrderItemStatusRequest
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.setToken(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    this.setToken(response.data.token);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await this.api.post('/auth/change-password', { oldPassword, newPassword });
  }

  // Users endpoints
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<User[]> = await this.api.get('/users');
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Products endpoints
  async getProducts(): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get('/products');
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(productData: CreateProductRequest): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.post('/products', productData);
    return response.data;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.put(`/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  // Stock endpoints
  async getStocks(): Promise<Stock[]> {
    const response: AxiosResponse<Stock[]> = await this.api.get('/stocks');
    return response.data;
  }

  async getStock(id: string): Promise<Stock> {
    const response: AxiosResponse<Stock> = await this.api.get(`/stocks/${id}`);
    return response.data;
  }

  async createStock(stockData: CreateStockRequest): Promise<Stock> {
    const response: AxiosResponse<Stock> = await this.api.post('/stocks', stockData);
    return response.data;
  }

  async updateStock(id: string, stockData: Partial<Stock>): Promise<Stock> {
    const response: AxiosResponse<Stock> = await this.api.put(`/stocks/${id}`, stockData);
    return response.data;
  }

  async deleteStock(id: string): Promise<void> {
    await this.api.delete(`/stocks/${id}`);
  }

  // Customers endpoints
  async getCustomers(): Promise<Customer[]> {
    const response: AxiosResponse<Customer[]> = await this.api.get('/customers');
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(customerData: CreateCustomerRequest): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.post('/customers', customerData);
    return response.data;
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    const response: AxiosResponse<Customer> = await this.api.put(`/customers/${id}`, customerData);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.api.delete(`/customers/${id}`);
  }

  // Orders endpoints
  async getOrders(): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get('/orders');
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post('/orders', orderData);
    return response.data;
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.put(`/orders/${id}`, orderData);
    return response.data;
  }

  async updateOrderStatus(id: string, statusData: UpdateOrderStatusRequest): Promise<void> {
    await this.api.put(`/orders/${id}/status`, statusData);
  }

  async archiveOrder(id: string): Promise<void> {
    await this.api.put(`/orders/${id}/archive`);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.api.delete(`/orders/${id}`);
  }

  // Order Items endpoints
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const response: AxiosResponse<OrderItem[]> = await this.api.get(`/orders/${orderId}/items`);
    return response.data;
  }

  async getOrderItem(orderId: string, itemId: string): Promise<OrderItem> {
    const response: AxiosResponse<OrderItem> = await this.api.get(`/orders/${orderId}/items/${itemId}`);
    return response.data;
  }

  async createOrderItem(orderId: string, itemData: CreateOrderItemRequest): Promise<OrderItem> {
    const response: AxiosResponse<OrderItem> = await this.api.post(`/orders/${orderId}/items`, itemData);
    return response.data;
  }

  async updateOrderItem(orderId: string, itemId: string, itemData: Partial<OrderItem>): Promise<OrderItem> {
    const response: AxiosResponse<OrderItem> = await this.api.put(`/orders/${orderId}/items/${itemId}`, itemData);
    return response.data;
  }

  async updateOrderItemStatus(orderId: string, itemId: string, statusData: UpdateOrderItemStatusRequest): Promise<void> {
    await this.api.put(`/orders/${orderId}/items/${itemId}/status`, statusData);
  }

  async deleteOrderItem(orderId: string, itemId: string): Promise<void> {
    await this.api.delete(`/orders/${orderId}/items/${itemId}`);
  }
}

export const apiService = new ApiService();
