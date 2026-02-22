import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Order, Customer, Product, Stock, OrderStatus } from '../types';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, customersData, productsData, stocksData] = await Promise.all([
          apiService.getOrders(),
          apiService.getCustomers(),
          apiService.getProducts(),
          apiService.getStocks(),
        ]);
        setOrders(ordersData);
        setCustomers(customersData);
        setProducts(productsData);
        setStocks(stocksData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      draft: orders.filter(o => o.status === OrderStatus.Draft).length,
      confirmed: orders.filter(o => o.status === OrderStatus.Confirmed).length,
      inProduction: orders.filter(o => o.status === OrderStatus.InProduction).length,
      ready: orders.filter(o => o.status === OrderStatus.Ready).length,
      shipped: orders.filter(o => o.status === OrderStatus.Shipped).length,
      delivered: orders.filter(o => o.status === OrderStatus.Delivered).length,
    };
    return stats;
  };

  const getTotalStockValue = () => {
    return stocks.reduce((total, stock) => {
      const product = products.find(p => p.id === stock.productId);
      return total + (stock.units * (product?.unit || 0));
    }, 0);
  };

  const getLowStockItems = () => {
    return stocks.filter(stock => stock.units < 10).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const orderStats = getOrderStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <span className="text-white text-2xl">📋</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="text-lg font-medium text-gray-900">{orderStats.total}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <span className="text-white text-2xl">👥</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                <dd className="text-lg font-medium text-gray-900">{customers.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <span className="text-white text-2xl">📦</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Products</dt>
                <dd className="text-lg font-medium text-gray-900">{products.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                <dd className="text-lg font-medium text-gray-900">{getLowStockItems()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order Status Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{orderStats.draft}</div>
              <div className="text-sm text-gray-500">Draft</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orderStats.confirmed}</div>
              <div className="text-sm text-gray-500">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{orderStats.inProduction}</div>
              <div className="text-sm text-gray-500">In Production</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{orderStats.ready}</div>
              <div className="text-sm text-gray-500">Ready</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{orderStats.shipped}</div>
              <div className="text-sm text-gray-500">Shipped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{orderStats.delivered}</div>
              <div className="text-sm text-gray-500">Delivered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === OrderStatus.Delivered ? 'bg-green-100 text-green-800' :
                        order.status === OrderStatus.Shipped ? 'bg-blue-100 text-blue-800' :
                        order.status === OrderStatus.InProduction ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {OrderStatus[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      €{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
