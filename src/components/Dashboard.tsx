import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Order, Customer, Product, Stock, OrderStatus } from '../types';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  ShoppingCart,
  CheckCircle,
  Clock,
  Truck,
  Home
} from 'lucide-react';

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
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 mb-1">Ordini Totali</p>
              <p className="text-3xl font-bold text-white">{orderStats.total}</p>
              <p className="text-xs text-emerald-400 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% da mese scorso
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 mb-1">Clienti</p>
              <p className="text-3xl font-bold text-white">{customers.length}</p>
              <p className="text-xs text-emerald-400 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8% nuovi clienti
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 mb-1">Prodotti</p>
              <p className="text-3xl font-bold text-white">{products.length}</p>
              <p className="text-xs text-gray-500 mt-2">Catalogo attivo</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 mb-1">Scorte Basse</p>
              <p className="text-3xl font-bold text-red-400">{getLowStockItems()}</p>
              <p className="text-xs text-red-400 mt-2 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Richiede attenzione
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Status Breakdown */}
        <div className="lg:col-span-2 bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-2">Stato Ordini</h3>
            <p className="text-sm text-gray-400">Panoramica degli ordini per stato</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-4 text-center hover:bg-gray-700 transition-colors">
              <div className="text-2xl font-bold text-gray-200">{orderStats.draft}</div>
              <div className="text-sm text-gray-400 mt-1">Bozza</div>
            </div>
            <div className="bg-blue-900/30 rounded-xl p-4 text-center hover:bg-blue-900/50 transition-colors">
              <div className="text-2xl font-bold text-blue-400">{orderStats.confirmed}</div>
              <div className="text-sm text-blue-400 mt-1">Confermati</div>
            </div>
            <div className="bg-yellow-900/30 rounded-xl p-4 text-center hover:bg-yellow-900/50 transition-colors">
              <div className="text-2xl font-bold text-yellow-400">{orderStats.inProduction}</div>
              <div className="text-sm text-yellow-400 mt-1">In Produzione</div>
            </div>
            <div className="bg-green-900/30 rounded-xl p-4 text-center hover:bg-green-900/50 transition-colors">
              <div className="text-2xl font-bold text-green-400">{orderStats.ready}</div>
              <div className="text-sm text-green-400 mt-1">Pronti</div>
            </div>
            <div className="bg-purple-900/30 rounded-xl p-4 text-center hover:bg-purple-900/50 transition-colors">
              <div className="text-2xl font-bold text-purple-400">{orderStats.shipped}</div>
              <div className="text-sm text-purple-400 mt-1">Spediti</div>
            </div>
            <div className="bg-indigo-900/30 rounded-xl p-4 text-center hover:bg-indigo-900/50 transition-colors">
              <div className="text-2xl font-bold text-indigo-400">{orderStats.delivered}</div>
              <div className="text-sm text-indigo-400 mt-1">Consegnati</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-6">Riepilogo Rapido</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-100">Valore Inventario</span>
              <span className="font-bold">€{getTotalStockValue().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-100">Ordini Oggi</span>
              <span className="font-bold">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-purple-100">Prodotti Attivi</span>
              <span className="font-bold">{products.length}</span>
            </div>
            <div className="pt-4 border-t border-white/20">
              <button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-lg py-2 px-4 transition-colors font-medium">
                Visualizza Report Completo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Ordini Recenti</h3>
              <p className="text-sm text-gray-400 mt-1">Ultimi 5 ordini ricevuti</p>
            </div>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
              Vedi tutti →
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50 border-b border-gray-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Numero Ordine
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Totale
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-white">#{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{order.customer?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === OrderStatus.Delivered ? 'bg-green-900/30 text-green-400' :
                      order.status === OrderStatus.Shipped ? 'bg-blue-900/30 text-blue-400' :
                      order.status === OrderStatus.InProduction ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {order.status === OrderStatus.Delivered && <CheckCircle className="w-3 h-3 mr-1" />}
                      {order.status === OrderStatus.Shipped && <Truck className="w-3 h-3 mr-1" />}
                      {order.status === OrderStatus.InProduction && <Clock className="w-3 h-3 mr-1" />}
                      {order.status === OrderStatus.Confirmed && <Package className="w-3 h-3 mr-1" />}
                      {OrderStatus[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-white">€{order.totalAmount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-200">{new Date(order.orderDate).toLocaleDateString('it-IT')}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
