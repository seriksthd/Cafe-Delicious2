import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  Phone,
  User,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  fetchOrders, 
  fetchOrderHistory,
  updateOrderStatus, 
  deleteOrder,
  bulkDeleteOrders,
  clearOrderHistory,
  clearError 
} from '../store/slices/ordersSlice';
import { verifyToken, logout } from '../store/slices/authSlice';
import { toast } from 'sonner';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { orders, orderHistory, isLoading, error } = useSelector((state) => state.orders);

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    dispatch(verifyToken());
    dispatch(fetchOrders());
    dispatch(fetchOrderHistory());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus }));
      toast.success('Заказдын статусу өзгөртүлдү');
    } catch (error) {
      toast.error('Статусту өзгөртүүдө ката кетти');
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    if (window.confirm(`Заказ #${orderNumber} өчүрөсүзбү?`)) {
      try {
        await dispatch(deleteOrder(orderId));
        toast.success('Заказ өчүрүлдү');
      } catch (error) {
        toast.error('Заказды өчүрүүдө ката кетти');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Өчүрүү үчүн заказдарды тандаңыз');
      return;
    }

    if (window.confirm(`${selectedOrders.length} заказды өчүрөсүзбү?`)) {
      try {
        await dispatch(bulkDeleteOrders(selectedOrders));
        setSelectedOrders([]);
        toast.success('Заказдар өчүрүлдү');
      } catch (error) {
        toast.error('Заказдарды өчүрүүдө ката кетти');
      }
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Бардык тарыхты тазалоосузбу?')) {
      try {
        await dispatch(clearOrderHistory());
        toast.success('Тарых тазаланды');
      } catch (error) {
        toast.error('Тарыхты тазалоодо ката кетти');
      }
    }
  };

  const handleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="status-pending">Күтүлүүдө</Badge>;
      case 'ready':
        return <Badge className="status-ready">Даяр</Badge>;
      case 'delivered':
        return <Badge className="status-delivered">Жеткирилген</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'ready':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const OrderCard = ({ order, showActions = true }) => (
    <Card className="card-hover border-none shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span>Заказ #{order.order_number}</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {new Date(order.created_at).toLocaleString('ru-RU')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(order.status)}
            {showActions && (
              <input
                type="checkbox"
                checked={selectedOrders.includes(order.id)}
                onChange={() => handleOrderSelection(order.id)}
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{order.client_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{order.phone}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Заказ</h4>
          {order.cart_items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{item.product_name} x{item.quantity}</span>
              <span className="font-medium">{(item.price * item.quantity).toFixed(2)} сом</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="font-semibold">Жалпы:</span>
          <span className="text-lg font-bold text-amber-600">
            {order.total_price.toFixed(2)} сом
          </span>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-2">
            {order.status === 'pending' && (
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => handleStatusUpdate(order.id, 'ready')}
              >
                Даяр деп белгилөө
              </Button>
            )}
            {order.status === 'ready' && (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => handleStatusUpdate(order.id, 'delivered')}
              >
                Жеткирилди
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDeleteOrder(order.id, order.order_number)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Артка
                </Button>
              </Link>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Заказ <span className="gradient-text">Башкаруу</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch(fetchOrders());
                  dispatch(fetchOrderHistory());
                }}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Жаңыртуу
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Чыгуу
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Активдүү заказдар ({orders.length})</TabsTrigger>
            <TabsTrigger value="history">Тарых ({orderHistory.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {/* Filters and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Бардыгы</SelectItem>
                    <SelectItem value="pending">Күтүлүүдө</SelectItem>
                    <SelectItem value="ready">Даяр</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedOrders.length > 0 && (
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Тандалгандарды өчүрүү ({selectedOrders.length})
                </Button>
              )}
            </div>

            {/* Orders Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loading-spinner h-8 w-8 border-4 border-amber-200 border-t-amber-600 rounded-full"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Заказ табылган жок</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Заказдардын тарыхы</h2>
              {orderHistory.length > 0 && (
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleClearHistory}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Тарыхты тазалоо
                </Button>
              )}
            </div>

            {orderHistory.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">Тарыхта заказ жок</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orderHistory.map((order) => (
                  <OrderCard key={order.id} order={order} showActions={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminOrders;