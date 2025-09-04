import requests
import sys
import json
from datetime import datetime

class CafeAPITester:
    def __init__(self, base_url="https://mongo-api-deploy.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.created_product_id = None
        self.created_order_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.text}")
                except:
                    pass

            return success, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        success, response = self.run_test(
            "API Root",
            "GET",
            "api/",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/admin/login",
            200,
            data={"username": "admin", "password": "admin123"}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_verify(self):
        """Test admin token verification"""
        if not self.token:
            print("❌ No token available for verification")
            return False
        
        success, response = self.run_test(
            "Admin Token Verification",
            "GET",
            "api/admin/verify",
            200
        )
        return success

    def test_get_products_empty(self):
        """Test getting products (should be empty initially)"""
        success, response = self.run_test(
            "Get Products (Empty)",
            "GET",
            "api/products",
            200
        )
        if success:
            print(f"   Found {len(response)} products")
        return success

    def test_create_product(self):
        """Test creating a product"""
        if not self.token:
            print("❌ No admin token for product creation")
            return False

        product_data = {
            "name": "Тест Кофе",
            "description": "Тест кофе сүрөттөмөсү",
            "price": 150.0,
            "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
            "category": "Суусундуктар"
        }
        
        success, response = self.run_test(
            "Create Product",
            "POST",
            "api/products",
            200,
            data=product_data
        )
        
        if success and 'id' in response:
            self.created_product_id = response['id']
            print(f"   Created product ID: {self.created_product_id}")
            return True
        return False

    def test_get_products_with_data(self):
        """Test getting products after creation"""
        success, response = self.run_test(
            "Get Products (With Data)",
            "GET",
            "api/products",
            200
        )
        if success:
            print(f"   Found {len(response)} products")
            if len(response) > 0:
                print(f"   First product: {response[0].get('name', 'Unknown')}")
        return success

    def test_get_single_product(self):
        """Test getting a single product"""
        if not self.created_product_id:
            print("❌ No product ID available")
            return False
            
        success, response = self.run_test(
            "Get Single Product",
            "GET",
            f"api/products/{self.created_product_id}",
            200
        )
        return success

    def test_update_product(self):
        """Test updating a product"""
        if not self.created_product_id or not self.token:
            print("❌ No product ID or token available")
            return False
            
        update_data = {
            "name": "Жаңыланган Кофе",
            "price": 200.0
        }
        
        success, response = self.run_test(
            "Update Product",
            "PUT",
            f"api/products/{self.created_product_id}",
            200,
            data=update_data
        )
        return success

    def test_create_order(self):
        """Test creating an order"""
        if not self.created_product_id:
            print("❌ No product available for order")
            return False
            
        order_data = {
            "cart_items": [
                {
                    "product_id": self.created_product_id,
                    "product_name": "Тест Кофе",
                    "price": 150.0,
                    "quantity": 2,
                    "image": "test-image"
                }
            ],
            "client_name": "Тест Кардар",
            "phone": "+996700123456",
            "total_price": 300.0
        }
        
        success, response = self.run_test(
            "Create Order",
            "POST",
            "api/orders",
            200,
            data=order_data
        )
        
        if success and 'id' in response:
            self.created_order_id = response['id']
            print(f"   Created order ID: {self.created_order_id}")
            print(f"   Order number: {response.get('order_number', 'N/A')}")
            return True
        return False

    def test_get_orders(self):
        """Test getting orders (admin required)"""
        if not self.token:
            print("❌ No admin token for getting orders")
            return False
            
        success, response = self.run_test(
            "Get Orders",
            "GET",
            "api/orders",
            200
        )
        if success:
            print(f"   Found {len(response)} active orders")
        return success

    def test_get_single_order(self):
        """Test getting a single order"""
        if not self.created_order_id:
            print("❌ No order ID available")
            return False
            
        success, response = self.run_test(
            "Get Single Order",
            "GET",
            f"api/orders/{self.created_order_id}",
            200
        )
        return success

    def test_update_order_status(self):
        """Test updating order status"""
        if not self.created_order_id or not self.token:
            print("❌ No order ID or token available")
            return False
            
        # Test updating to ready
        success1, _ = self.run_test(
            "Update Order Status to Ready",
            "PUT",
            f"api/orders/{self.created_order_id}/status",
            200,
            data={"status": "ready"}
        )
        
        # Test updating to delivered
        success2, _ = self.run_test(
            "Update Order Status to Delivered",
            "PUT",
            f"api/orders/{self.created_order_id}/status",
            200,
            data={"status": "delivered"}
        )
        
        return success1 and success2

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        if not self.token:
            print("❌ No admin token for dashboard")
            return False
            
        success, response = self.run_test(
            "Dashboard Statistics",
            "GET",
            "api/admin/dashboard",
            200
        )
        
        if success:
            print(f"   Total products: {response.get('total_products', 0)}")
            print(f"   Total orders: {response.get('total_orders', 0)}")
            print(f"   Active orders: {response.get('active_orders', 0)}")
            print(f"   Total revenue: {response.get('total_revenue', 0)}")
        
        return success

    def test_order_history(self):
        """Test getting order history"""
        if not self.token:
            print("❌ No admin token for order history")
            return False
            
        success, response = self.run_test(
            "Get Order History",
            "GET",
            "api/orders/history",
            200
        )
        if success:
            print(f"   Found {len(response)} delivered orders")
        return success

    def cleanup_test_data(self):
        """Clean up test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete test product
        if self.created_product_id and self.token:
            success, _ = self.run_test(
                "Delete Test Product",
                "DELETE",
                f"api/products/{self.created_product_id}",
                200
            )

def main():
    print("🚀 Starting Cafe API Testing...")
    print("=" * 50)
    
    tester = CafeAPITester()
    
    # Test sequence
    tests = [
        tester.test_api_root,
        tester.test_admin_login,
        tester.test_admin_verify,
        tester.test_get_products_empty,
        tester.test_create_product,
        tester.test_get_products_with_data,
        tester.test_get_single_product,
        tester.test_update_product,
        tester.test_create_order,
        tester.test_get_orders,
        tester.test_get_single_order,
        tester.test_update_order_status,
        tester.test_dashboard_stats,
        tester.test_order_history,
    ]
    
    # Run all tests
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Cleanup
    tester.cleanup_test_data()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS:")
    print(f"   Tests run: {tester.tests_run}")
    print(f"   Tests passed: {tester.tests_passed}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())