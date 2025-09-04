import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Plus, Minus, ShoppingBag, Phone, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { closeCart, updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/ordersSlice';
import { toast } from 'sonner';

const Cart = () => {
  const dispatch = useDispatch();
  const { isOpen, items, totalPrice } = useSelector((state) => state.cart);
  const { isLoading } = useSelector((state) => state.orders);

  const [customerInfo, setCustomerInfo] = useState({
    client_name: '',
    phone: '',
  });

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Себет бош');
      return;
    }

    if (!customerInfo.client_name || !customerInfo.phone) {
      toast.error('Атыңызды жана телефон номериңизди киргизиңиз');
      return;
    }

    const orderData = {
      cart_items: items,
      client_name: customerInfo.client_name,
      phone: customerInfo.phone,
      total_price: totalPrice,
    };

    try {
      const result = await dispatch(createOrder(orderData));
      if (result.type === 'orders/createOrder/fulfilled') {
        toast.success(`Заказ ийгиликтүү берилди! Номер: ${result.payload.order_number}`);
        dispatch(clearCart());
        dispatch(closeCart());
        setCustomerInfo({ client_name: '', phone: '' });
      }
    } catch (error) {
      toast.error('Заказ берүүдө ката');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && dispatch(closeCart())}>
      <SheetContent className="w-full sm:max-w-lg bg-white">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center space-x-2 text-xl font-serif">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
            <span>Себет</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Себетиңиз бош</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      <p className="text-amber-600 font-semibold">{item.price} сом</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveItem(item.product_id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Info Form */}
              <div className="border-t pt-4 space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Маалымат</h3>
                  <form onSubmit={handleSubmitOrder} className="space-y-3">
                    <div>
                      <Label htmlFor="client_name" className="text-sm">Атыңыз</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="client_name"
                          type="text"
                          placeholder="Атыңызды киргизиңиз"
                          className="pl-10"
                          value={customerInfo.client_name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, client_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm">Телефон</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+996 XXX XXX XXX"
                          className="pl-10"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    {/* Total and Submit */}
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Жалпы:</span>
                        <span className="text-xl font-bold text-amber-600">
                          {totalPrice.toFixed(2)} сом
                        </span>
                      </div>
                      <Button
                        type="submit"
                        className="w-full btn-cafe"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Заказ берилүүдө...' : 'Заказ берүү'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;