import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Package, 
  Users, 
  MapPin, 
  Layers, 
  CreditCard,
  ShoppingCart,
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  Home,
  Barcode,
  Calculator,
  Minus,
  Download,
  Printer,
  QrCode,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

// ข้อมูลตัวอย่าง
const initialData = {
  companies: [
    {
      id: 1,
      code: '001',
      name: 'Test Company Co.,Ltd',
      branch: 'สำนักงานใหญ่ (Head Office)',
      taxId: '0123456789',
      address1: '1/234 ถ.ลาดพร้าว 140 แขวงสะพานสูง',
      address2: '1/234 Ladprao 140, Klongchan Sub District, Bangkapi District, Bangkok 10240',
      phone: '023456789',
      website: 'www.bnautoid.com/gmstock/',
      facebook: 'www.facebook.com/morningstock'
    }
  ],
  products: [
    { id: 1, code: 'P001', name: 'สินค้าตัวอย่าง 1', unit: 'ชิ้น', price: 100, stock: 50, minStock: 10, barcode: '1234567890123' },
    { id: 2, code: 'P002', name: 'สินค้าตัวอย่าง 2', unit: 'กล่อง', price: 250, stock: 5, minStock: 15, barcode: '1234567890124' },
    { id: 3, code: 'P003', name: 'สินค้าตัวอย่าง 3', unit: 'ถุง', price: 80, stock: 25, minStock: 20, barcode: '1234567890125' }
  ],
  customers: [
    { id: 1, code: 'C001', name: 'ลูกค้า A', phone: '081-234-5678', address: 'กรุงเทพฯ', email: 'customer-a@email.com' },
    { id: 2, code: 'C002', name: 'ลูกค้า B', phone: '089-876-5432', address: 'นนทบุรี', email: 'customer-b@email.com' }
  ],
  warehouses: [
    { id: 1, code: 'W001', name: 'คลังหลัก', location: 'ชั้น 1', active: true }
  ],
  locations: [
    { id: 1, code: 'L001', name: 'หิ้ง A1', warehouse: 'คลังหลัก', active: true }
  ],
  sales: [
    { id: 1, date: '2024-06-01', customer: 'ลูกค้า A', total: 500, status: 'completed' },
    { id: 2, date: '2024-06-01', customer: 'ลูกค้า B', total: 750, status: 'pending' }
  ]
};

const InventoryManagementSystem = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [data, setData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  // เมนูหลัก
  const menuItems = [
    { id: 'dashboard', name: 'หน้าหลัก', icon: Home },
    { id: 'companies', name: 'ข้อมูลบริษัท/สาขา', icon: Building2 },
    { id: 'products', name: 'สินค้า', icon: Package },
    { id: 'customers', name: 'ลูกค้า', icon: Users },
    { id: 'warehouses', name: 'คลังสินค้า', icon: MapPin },
    { id: 'locations', name: 'ที่ตั้งสินค้า', icon: Layers },
    { id: 'pos', name: 'POS', icon: Calculator },
    { id: 'documents', name: 'เอกสาร', icon: FileText },
    { id: 'reports', name: 'รายงาน', icon: TrendingUp }
  ];

  // ฟังก์ชันจำลองการแสกน Barcode
  const simulateBarcodeScanner = () => {
    const barcodes = ['1234567890123', '1234567890124', '1234567890125'];
    const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
    handleBarcodeScanned(randomBarcode);
  };

  // ฟังก์ชันจัดการ Barcode ที่แสกนได้
  const handleBarcodeScanned = (barcode) => {
    const product = data.products.find(p => p.barcode === barcode);
    if (product && product.stock > 0) {
      addToCart(product);
      setShowBarcodeScanner(false);
    } else {
      alert(product ? 'สินค้าหมด' : 'ไม่พบสินค้า');
    }
  };

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert('สินค้าไม่เพียงพอ');
          return prevCart;
        }
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // ฟังก์ชันลดจำนวนสินค้าในตะกร้า
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      return prevCart.map(item =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0);
    });
  };

  // ฟังก์ชันลบสินค้าออกจากตะกร้า
  const deleteFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // ฟังก์ชันคำนวณยอดรวม
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // ฟังก์ชันชำระเงิน
  const checkout = () => {
    if (cart.length === 0) {
      alert('ไม่มีสินค้าในตะกร้า');
      return;
    }
    
    if (!selectedCustomer) {
      alert('กรุณาเลือกลูกค้า');
      return;
    }

    // อัพเดทสต๊อกสินค้า
    setData(prevData => ({
      ...prevData,
      products: prevData.products.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
          return { ...product, stock: product.stock - cartItem.quantity };
        }
        return product;
      }),
      sales: [
        ...prevData.sales,
        {
          id: prevData.sales.length + 1,
          date: new Date().toISOString().split('T')[0],
          customer: selectedCustomer.name,
          total: calculateTotal(),
          status: 'completed',
          items: cart
        }
      ]
    }));

    // เคลียร์ตะกร้าและลูกค้า
    setCart([]);
    setSelectedCustomer(null);
    alert('ขายสำเร็จ!');
    
    // สร้างใบเสร็จ
    generateReceipt();
  };

  // ฟังก์ชันสร้างใบเสร็จ
  const generateReceipt = () => {
    const receiptContent = `
ใบเสร็จรับเงิน
บริษัท: ${data.companies[0]?.name}
ลูกค้า: ${selectedCustomer?.name}
วันที่: ${new Date().toLocaleDateString('th-TH')}

รายการสินค้า:
${cart.map(item => `${item.name} x${item.quantity} = ฿${(item.price * item.quantity).toLocaleString()}`).join('\n')}

ยอดรวม: ฿${calculateTotal().toLocaleString()}
    `;
    
    // สร้าง Blob และดาวน์โหลด
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ฟังก์ชันตรวจสอบสินค้าใกล้หมด
  const getLowStockProducts = () => {
    return data.products.filter(product => product.stock <= product.minStock);
  };

  // ฟังก์ชันเปิด Modal
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  // ฟังก์ชันปิด Modal
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType('');
  };

  // ฟังก์ชันบันทึกข้อมูล
  const saveItem = (formData, type) => {
    if (editingItem) {
      setData(prev => ({
        ...prev,
        [type]: prev[type].map(item => 
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        )
      }));
    } else {
      const newId = Math.max(...data[type].map(item => item.id), 0) + 1;
      setData(prev => ({
        ...prev,
        [type]: [...prev[type], { ...formData, id: newId }]
      }));
    }
    closeModal();
  };

  // ฟังก์ชันลบข้อมูล
  const deleteItem = (id, type) => {
    if (confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
      setData(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));
    }
  };

  // แสดงหน้า Dashboard
  const DashboardContent = () => {
    const lowStockProducts = getLowStockProducts();
    const totalSales = data.sales.reduce((sum, sale) => sum + sale.total, 0);
    
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ระบบบริหารจัดการสินค้า</h1>
        
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
              <h3 className="text-lg font-medium text-red-800">
                สินค้าใกล้หมด ({lowStockProducts.length} รายการ)
              </h3>
            </div>
            <div className="mt-2">
              {lowStockProducts.map(product => (
                <p key={product.id} className="text-sm text-red-700">
                  {product.name} (เหลือ {product.stock} {product.unit})
                </p>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <Package className="w-12 h-12 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">สินค้าทั้งหมด</h3>
                <p className="text-2xl font-bold">{data.products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <Users className="w-12 h-12 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">ลูกค้า</h3>
                <p className="text-2xl font-bold">{data.customers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <TrendingUp className="w-12 h-12 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">ยอดขาย</h3>
                <p className="text-2xl font-bold">฿{totalSales.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-500 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <FileText className="w-12 h-12 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">มูลค่าสต๊อก</h3>
                <p className="text-2xl font-bold">฿{data.products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">ฟีเจอร์หลัก</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.slice(1).map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon className="w-8 h-8 text-blue-500 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ฟอร์มสำหรับสินค้า
  const ProductForm = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState(item || {
      code: '',
      name: '',
      unit: '',
      price: 0,
      stock: 0,
      minStock: 0,
      barcode: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData, 'products');
    };

    // สร้าง barcode อัตโนมัติ
    const generateBarcode = () => {
      const barcode = '12345' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      setFormData({...formData, barcode});
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสสินค้า</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
            <div className="flex">
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={generateBarcode}
                className="px-3 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หน่วย</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ราคา</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนคงเหลือ</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สต๊อกขั้นต่ำ</label>
            <input
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            บันทึก
          </button>
        </div>
      </form>
    );
  };

  // ระบบ POS
  const POSContent = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ระบบ POS</h1>
      
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">เลือกลูกค้า</h3>
        <select
          value={selectedCustomer?.id || ''}
          onChange={(e) => {
            const customer = data.customers.find(c => c.id === parseInt(e.target.value));
            setSelectedCustomer(customer);
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">-- เลือกลูกค้า --</option>
          {data.customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">รายการสินค้า</h2>
            <button
              onClick={() => setShowBarcodeScanner(true)}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Barcode className="w-4 h-4 mr-2" />
              แสกน
            </button>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.products
              .filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.code.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.code} | คงเหลือ: {product.stock} {product.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">฿{product.price.toLocaleString()}</div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`mt-1 px-3 py-1 text-sm rounded ${
                      product.stock === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {product.stock === 0 ? 'หมด' : 'เพิ่ม'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">ตะกร้าสินค้า ({cart.length})</h2>
          
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>ไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">฿{item.price} x {item.quantity}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded hover:bg-red-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.quantity >= item.stock}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          item.quantity >= item.stock 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded hover:bg-red-200 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="ml-4 font-bold">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold mb-4">
                  <span>ยอดรวม:</span>
                  <span className="text-green-600">฿{calculateTotal().toLocaleString()}</span>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={checkout}
                    disabled={!selectedCustomer}
                    className={`w-full py-3 rounded-md font-semibold transition-colors ${
                      selectedCustomer 
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    ชำระเงิน
                  </button>
                  
                  <button
                    onClick={() => setCart([])}
                    className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    เคลียร์ตะกร้า
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <h3 className="text-lg font-semibold mb-4">แสกน Barcode</h3>
            <div className="text-center py-8">
              <QrCode className="w-24 h-24 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">กำลังเปิดกล้องสำหรับแสกน...</p>
              <button
                onClick={simulateBarcodeScanner}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
              >
                จำลองแสกน
              </button>
              <button
                onClick={() => setShowBarcodeScanner(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ฟอร์มสำหรับบริษัท
  const CompanyForm = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState(item || {
      code: '',
      name: '',
      branch: '',
      taxId: '',
      address1: '',
      address2: '',
      phone: '',
      website: '',
      facebook: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData, 'companies');
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสบริษัท</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบริษัท</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">สาขา</label>
          <input
            type="text"
            value={formData.branch}
            onChange={(e) => setFormData({...formData, branch: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
          <input
            type="text"
            value={formData.taxId}
            onChange={(e) => setFormData({...formData, taxId: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ (ภาษาไทย)</label>
          <textarea
            value={formData.address1}
            onChange={(e) => setFormData({...formData, address1: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ (ภาษาอังกฤษ)</label>
          <textarea
            value={formData.address2}
            onChange={(e) => setFormData({...formData, address2: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เว็บไซต์</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">เฟซบุ๊ก</label>
          <input
            type="text"
            value={formData.facebook}
            onChange={(e) => setFormData({...formData, facebook: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            บันทึก
          </button>
        </div>
      </form>
    );
  };

  // ฟอร์มสำหรับลูกค้า
  const CustomerForm = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState(item || {
      code: '',
      name: '',
      phone: '',
      address: '',
      email: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData, 'customers');
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสลูกค้า</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อลูกค้า</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทร</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            บันทึก
          </button>
        </div>
      </form>
    );
  };

  // หน้ารายงาน
  const ReportsContent = () => {
    const totalSales = data.sales.reduce((sum, sale) => sum + sale.total, 0);
    const todaySales = data.sales.filter(sale => sale.date === new Date().toISOString().split('T')[0]);
    const lowStockProducts = getLowStockProducts();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">รายงาน</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">รายงานยอดขาย</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>ยอดขายรวม:</span>
                <span className="font-bold">฿{totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ยอดขายวันนี้:</span>
                <span className="font-bold">฿{todaySales.reduce((sum, sale) => sum + sale.total, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>จำนวนบิลวันนี้:</span>
                <span className="font-bold">{todaySales.length}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              <Download className="w-4 h-4 inline mr-2" />
              ดาวน์โหลดรายงาน
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">รายงานสต๊อกสินค้า</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>จำนวนสินค้าทั้งหมด:</span>
                <span className="font-bold">{data.products.length}</span>
              </div>
              <div className="flex justify-between">
                <span>สินค้าใกล้หมด:</span>
                <span className="font-bold text-red-600">{lowStockProducts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>มูลค่าสต๊อกรวม:</span>
                <span className="font-bold">฿{data.products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              <Download className="w-4 h-4 inline mr-2" />
              ดาวน์โหลดรายงาน
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">รายงานลูกค้า</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>จำนวนลูกค้า:</span>
                <span className="font-bold">{data.customers.length}</span>
              </div>
              <div className="flex justify-between">
                <span>ลูกค้าซื้อวันนี้:</span>
                <span className="font-bold">{new Set(todaySales.map(sale => sale.customer)).size}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
              <Download className="w-4 h-4 inline mr-2" />
              ดาวน์โหลดรายงาน
            </button>
          </div>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">สินค้าใกล้หมด</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">รหัสสินค้า</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อสินค้า</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">คงเหลือ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ขั้นต่ำ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lowStockProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock} {product.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.minStock} {product.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          ใกล้หมด
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Documents Content
  const DocumentsContent = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">จัดการเอกสาร</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FileText className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">ใบเสนอราคา</h3>
          <p className="text-gray-600 mb-4">จัดทำใบเสนอราคาให้ลูกค้า</p>
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mb-2">
            สร้างใบเสนอราคา
          </button>
          <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center">
            <Printer className="w-4 h-4 mr-2" />
            พิมพ์เอกสาร
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FileText className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">ใบส่งสินค้า</h3>
          <p className="text-gray-600 mb-4">จัดทำใบส่งสินค้าและจัดส่ง</p>
          <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors mb-2">
            สร้างใบส่งสินค้า
          </button>
          <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center">
            <Printer className="w-4 h-4 mr-2" />
            พิมพ์เอกสาร
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FileText className="w-12 h-12 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">ใบเสร็จรับเงิน</h3>
          <p className="text-gray-600 mb-4">ออกใบเสร็จรับเงิน</p>
          <button 
            onClick={generateReceipt}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors mb-2"
          >
            สร้างใบเสร็จ
          </button>
          <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลด PDF
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FileText className="w-12 h-12 text-orange-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">ใบค้างส่งสินค้า</h3>
          <p className="text-gray-600 mb-4">จัดการสินค้าที่ค้างส่ง</p>
          <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors mb-2">
            สร้างใบค้างส่ง
          </button>
          <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center">
            <Printer className="w-4 h-4 mr-2" />
            พิมพ์เอกสาร
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <FileText className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">ใบจัดซื้อจัดจ้าง</h3>
          <p className="text-gray-600 mb-4">จัดทำใบสั่งซื้อสินค้า</p>
          <button className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors mb-2">
            สร้างใบจัดซื้อ
          </button>
          <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center">
            <Printer className="w-4 h-4 mr-2" />
            พิมพ์เอกสาร
          </button>
        </div>
      </div>
    </div>
  );

  // แสดงตารางข้อมูล
  const DataTable = ({ title, data, columns, type, canAdd = true }) => {
    const filteredData = data.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {canAdd && (
            <button
              onClick={() => openModal(type)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              เพิ่ม{title}
            </button>
          )}
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => openModal(type, item)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id, type)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Modal
  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // เลือกเนื้อหาที่จะแสดงตาม active menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <DashboardContent />;
      case 'companies':
        return (
          <DataTable
            title="ข้อมูลบริษัท/สาขา"
            data={data.companies}
            columns={[
              { key: 'code', label: 'รหัส' },
              { key: 'name', label: 'ชื่อบริษัท' },
              { key: 'branch', label: 'สาขา' },
              { key: 'taxId', label: 'เลขผู้เสียภาษี' },
              { key: 'phone', label: 'เบอร์โทร' }
            ]}
            type="companies"
          />
        );
      case 'products':
        return (
          <DataTable
            title="สินค้า"
            data={data.products}
            columns={[
              { key: 'code', label: 'รหัสสินค้า' },
              { key: 'name', label: 'ชื่อสินค้า' },
              { key: 'unit', label: 'หน่วย' },
              { 
                key: 'price', 
                label: 'ราคา',
                render: (value) => `฿${value.toLocaleString()}`
              },
              { key: 'stock', label: 'คงเหลือ' },
              { 
                key: 'minStock', 
                label: 'ขั้นต่ำ',
                render: (value, item) => (
                  <span className={item.stock <= item.minStock ? 'text-red-600 font-bold' : ''}>
                    {value}
                  </span>
                )
              },
              { key: 'barcode', label: 'Barcode' }
            ]}
            type="products"
          />
        );
      case 'customers':
        return (
          <DataTable
            title="ลูกค้า"
            data={data.customers}
            columns={[
              { key: 'code', label: 'รหัสลูกค้า' },
              { key: 'name', label: 'ชื่อลูกค้า' },
              { key: 'phone', label: 'เบอร์โทร' },
              { key: 'email', label: 'อีเมล' },
              { key: 'address', label: 'ที่อยู่' }
            ]}
            type="customers"
          />
        );
      case 'warehouses':
        return (
          <DataTable
            title="คลังสินค้า"
            data={data.warehouses}
            columns={[
              { key: 'code', label: 'รหัสคลัง' },
              { key: 'name', label: 'ชื่อคลัง' },
              { key: 'location', label: 'ตำแหน่ง' },
              { 
                key: 'active', 
                label: 'สถานะ',
                render: (value) => (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {value ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </span>
                )
              }
            ]}
            type="warehouses"
          />
        );
      case 'locations':
        return (
          <DataTable
            title="ที่ตั้งสินค้า"
            data={data.locations}
            columns={[
              { key: 'code', label: 'รหัสที่ตั้ง' },
              { key: 'name', label: 'ชื่อที่ตั้ง' },
              { key: 'warehouse', label: 'คลังสินค้า' },
              { 
                key: 'active', 
                label: 'สถานะ',
                render: (value) => (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {value ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </span>
                )
              }
            ]}
            type="locations"
          />
        );
      case 'pos':
        return <POSContent />;
      case 'documents':
        return <DocumentsContent />;
      case 'reports':
        return <ReportsContent />;
      default:
        return <DashboardContent />;
    }
  };

  // เลือกฟอร์มที่จะแสดงใน Modal
  const renderModalContent = () => {
    switch (modalType) {
      case 'companies':
        return (
          <CompanyForm
            item={editingItem}
            onSave={saveItem}
            onClose={closeModal}
          />
        );
      case 'products':
        return (
          <ProductForm
            item={editingItem}
            onSave={saveItem}
            onClose={closeModal}
          />
        );
      case 'customers':
        return (
          <CustomerForm
            item={editingItem}
            onSave={saveItem}
            onClose={closeModal}
          />
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const titles = {
      companies: 'ข้อมูลบริษัท/สาขา',
      products: 'ข้อมูลสินค้า',
      customers: 'ข้อมูลลูกค้า',
      warehouses: 'ข้อมูลคลังสินค้า',
      locations: 'ข้อมูลที่ตั้งสินค้า'
    };
    
    return `${editingItem ? 'แก้ไข' : 'เพิ่ม'}${titles[modalType] || ''}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">ระบบจัดการสต๊อก</h1>
        </div>
        
        <nav className="mt-6">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeMenu === item.id ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-700' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onClose={closeModal}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default InventoryManagementSystem;