import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp,
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { fetchDashboardStats } from '../store/slices/ordersSlice';
import { verifyToken, logout } from '../store/slices/authSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { dashboardStats } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    dispatch(verifyToken());
    dispatch(fetchDashboardStats());
  }, [dispatch, isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const stats = [
    {
      title: 'Жалпы продуктулар',
      value: dashboardStats?.total_products || 0,
      icon: <Package className="h-6 w-6" />,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Жалпы заказдар',
      value: dashboardStats?.total_orders || 0,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-green-500',
      change: '+23%'
    },
    {
      title: 'Активдүү заказдар',
      value: dashboardStats?.active_orders || 0,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-orange-500',
      change: '+5%'
    },
    {
      title: 'Жалпы киреше',
      value: `${dashboardStats?.total_revenue?.toFixed(2) || 0} сом`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-purple-500',
      change: '+18%'
    }
  ];

  const orderStats = [
    {
      title: 'Күтүлүп жаткан',
      value: dashboardStats?.pending_orders || 0,
      color: 'status-pending'
    },
    {
      title: 'Даяр',
      value: dashboardStats?.ready_orders || 0, 
      color: 'status-ready'
    },
    {
      title: 'Жеткирилген',
      value: dashboardStats?.delivered_orders || 0,
      color: 'status-delivered'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Admin <span className="gradient-text">Панель</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.username || 'Admin'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Чыгуу
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Status Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-amber-600" />
                <span>Заказдардын статистикасы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{stat.title}</span>
                    <Badge className={stat.color}>
                      {stat.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-amber-600" />
                <span>Тез аткаруу</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/products">
                <Button className="w-full justify-start btn-cafe-outline">
                  <Package className="h-4 w-4 mr-2" />
                  Продуктуларды башкаруу
                </Button>
              </Link>
              <Link to="/admin/orders">
                <Button className="w-full justify-start btn-cafe-outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Заказдарды башкаруу
                </Button>
              </Link>
              <Link to="/">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Сайтты көрүү
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Акыркы иш-аракеттер</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Акыркы иш-аракеттердин тизмеси бул жерде көрсөтүлөт</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;