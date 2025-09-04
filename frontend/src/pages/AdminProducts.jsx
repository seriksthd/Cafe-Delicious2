import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  LogOut, 
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  clearError 
} from '../store/slices/productsSlice';
import { verifyToken, logout } from '../store/slices/authSlice';
import { toast } from 'sonner';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { products, categories, isLoading, error } = useSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  // Sample images for easy selection
  const sampleImages = [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?w=400',
    'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?w=400',
    'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=400',
    'https://images.unsplash.com/photo-1623334044303-241021148842?w=400',
    'https://images.pexels.com/photos/267308/pexels-photo-267308.jpeg?w=400',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400'
  ];

  const defaultCategories = ['Кофе', 'Чай', 'Тамак-аш', 'Десерт', 'Суусундуктар', 'Нан-токоч'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    dispatch(verifyToken());
    dispatch(fetchProducts());
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: ''
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      image: product.image
    });
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error('Бардык керектүү талааларды толтуруңуз');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, ...productData }));
        toast.success('Продукт ийгиликтүү жаңыртылды');
      } else {
        await dispatch(createProduct(productData));
        toast.success('Продукт ийгиликтүү кошулду');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Ката кетти');
    }
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`"${productName}" продуктун өчүрөсүзбү?`)) {
      try {
        await dispatch(deleteProduct(productId));
        toast.success('Продукт өчүрүлдү');
      } catch (error) {
        toast.error('Өчүрүүдө ката кетти');
      }
    }
  };

  const handleImageSelect = (imageUrl) => {
    setFormData({ ...formData, image: imageUrl });
  };

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
                Продукт <span className="gradient-text">Башкаруу</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={openCreateModal} className="btn-cafe">
                <Plus className="h-4 w-4 mr-1" />
                Жаңы продукт
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
        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner h-8 w-8 border-4 border-amber-200 border-t-amber-600 rounded-full"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="card-hover border-none shadow-lg">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-amber-600">
                        {product.price} сом
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Өзгөртүү
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {products.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">Продукт табылган жок</p>
          </div>
        )}
      </div>

      {/* Create/Edit Product Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Продуктту өзгөртүү' : 'Жаңы продукт кошуу'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Аталышы *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Продукттун аталышы"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Баасы (сом) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Категория *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Категория тандоо" />
                </SelectTrigger>
                <SelectContent>
                  {defaultCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Сүрөттөмө</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Продукт жөнүндө кыскача маалымат"
                rows={3}
              />
            </div>

            <div>
              <Label>Сүрөт тандоо *</Label>
              <div className="grid grid-cols-4 gap-3 mt-2">
                {sampleImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      formData.image === imageUrl 
                        ? 'border-amber-500 ring-2 ring-amber-200' 
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                    onClick={() => handleImageSelect(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
              {formData.image && (
                <div className="mt-3">
                  <Label>Тандалган сүрөт:</Label>
                  <img
                    src={formData.image}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded-lg border mt-2"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Жабуу
              </Button>
              <Button type="submit" className="btn-cafe" disabled={isLoading}>
                <Save className="h-4 w-4 mr-1" />
                {isLoading ? 'Сакталууда...' : 'Сактоо'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;