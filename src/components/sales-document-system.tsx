import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Calendar,
  User,
  Package,
  DollarSign,
  Save,
  Eye,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

const SalesDocumentSystem = () => {
  const [formData, setFormData] = useState({
    // ข้อมูลบริษัท
    companyName: 'ร้าน อ.วัชนา',
    companyAddress: '1167/10 ถ.ประจักษ์ ต.ในเมือง อ.เมือง จ.หนองคาย',
    companyPhone: '042-412212',
    companyMobile: '081-8727872',
    companyTaxId: '8439988003660',
    companyBank: 'ธนาคารกรุงไทย สาขาหนองคาย',
    companyAccount: 'นางสมหล่านกิาณ์ ดิษณุบาท',
    
    // ข้อมูลลูกค้า
    customerCode: '111111',
    customerName: 'ลูกค้าทั่วไป',
    customerAddress: 'อ. จ.',
    customerPhone: '',
    customerTaxId: '',
    
    // ข้อมูลเอกสาร
    quotationNo: 'QT001',
    deliveryNo: 'IV6801797',
    backorderNo: 'BO6801238',
    receiptNo: '0297/2/2568',
    documentDate: new Date().toISOString().split('T')[0],
    
    // รายการสินค้า
    items: [
      {
        id: 1,
        code: '001',
        description: 'สินค้าหายาก 1 บาท',
        quantity: 1,
        unit: 'เซ็ต',
        unitPrice: 140.00,
        discount: 0.00,
        totalPrice: 140.00
      }
    ],
    
    // เงื่อนไขและข้อมูลเพิ่มเติม
    creditDays: 30,
    deliveryDays: 5,
    vatRate: 0, // 0% VAT
    discountAmount: 0,
    
    // ข้อมูลการชำระเงิน
    paymentMethod: 'เงินสด', // เงินสด, เซ็นเนอร์, เงินโอน, เช็ค
    paymentDate: new Date().toISOString().split('T')[0],
    
    // ผู้เกี่ยวข้อง
    salesperson: '',
    preparedBy: '',
    approvedBy: '',
    receivedBy: ''
  });

  const [currentView, setCurrentView] = useState('form');
  const [previewDocument, setPreviewDocument] = useState('quotation');

  // ฟังก์ชันสร้างเลขที่เอกสารอัตโนมัติ
  const generateDocumentNumber = (prefix) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${year}${month}${day}${random}`;
  };

  // ฟังก์ชันเพิ่มรายการสินค้า
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      code: String(formData.items.length + 1).padStart(3, '0'),
      description: '',
      quantity: 1,
      unit: 'เซ็ต',
      unitPrice: 0,
      discount: 0,
      totalPrice: 0
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };

  // ฟังก์ชันลบรายการสินค้า
  const removeItem = (id) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  // ฟังก์ชันอัพเดทรายการสินค้า
  const updateItem = (id, field, value) => {
    setFormData({
      ...formData,
      items: formData.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // คำนวณราคารวมอัตโนมัติ
          if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
            const subtotal = updatedItem.quantity * updatedItem.unitPrice;
            updatedItem.totalPrice = subtotal - updatedItem.discount;
          }
          return updatedItem;
        }
        return item;
      })
    });
  };

  // คำนวณยอดรวม
  const calculateSubtotal = () => {
    return formData.items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * (formData.vatRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT() - formData.discountAmount;
  };

  // แปลงตัวเลขเป็นภาษาไทย
  const numberToThai = (num) => {
    const thaiDigits = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
    
    if (num === 0) return 'ศูนย์บาทถ้วน';
    
    let result = '';
    let numStr = Math.floor(num).toString();
    let len = numStr.length;
    
    for (let i = 0; i < len; i++) {
      let digit = parseInt(numStr[i]);
      let pos = len - i - 1;
      
      if (digit !== 0) {
        if (pos === 1 && digit === 1 && len > 1) {
          result += positions[pos];
        } else if (pos === 1 && digit === 2) {
          result += 'ยี่' + positions[pos];
        } else {
          result += thaiDigits[digit] + positions[pos];
        }
      }
    }
    
    return result + 'บาทถ้วน';
  };

  // ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear() + 543; // แปลงเป็นพุทธศักราช
    return `${day}/${month}/${year}`;
  };

  // ฟอร์มป้อนข้อมูล
  const FormView = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">แบบฟอร์มเอกสารการขาย</h2>
      
      {/* ข้อมูลบริษัท */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลบริษัท</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อร้าน/บริษัท</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
            <input
              type="text"
              value={formData.companyTaxId}
              onChange={(e) => setFormData({...formData, companyTaxId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
          <textarea
            value={formData.companyAddress}
            onChange={(e) => setFormData({...formData, companyAddress: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">โทรศัพท์</label>
            <input
              type="text"
              value={formData.companyPhone}
              onChange={(e) => setFormData({...formData, companyPhone: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">มือถือ</label>
            <input
              type="text"
              value={formData.companyMobile}
              onChange={(e) => setFormData({...formData, companyMobile: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* ข้อมูลลูกค้า */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลลูกค้า</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสลูกค้า</label>
            <input
              type="text"
              value={formData.customerCode}
              onChange={(e) => setFormData({...formData, customerCode: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อลูกค้า</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
            <input
              type="date"
              value={formData.documentDate}
              onChange={(e) => setFormData({...formData, documentDate: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่ลูกค้า</label>
          <textarea
            value={formData.customerAddress}
            onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
          />
        </div>
      </div>

      {/* เลขที่เอกสาร */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">เลขที่เอกสาร</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ใบเสนอราคา</label>
            <div className="flex">
              <input
                type="text"
                value={formData.quotationNo}
                onChange={(e) => setFormData({...formData, quotationNo: e.target.value})}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setFormData({...formData, quotationNo: generateDocumentNumber('QT')})}
                className="px-3 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600 text-xs"
              >
                สร้าง
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ใบส่งสินค้า</label>
            <div className="flex">
              <input
                type="text"
                value={formData.deliveryNo}
                onChange={(e) => setFormData({...formData, deliveryNo: e.target.value})}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setFormData({...formData, deliveryNo: generateDocumentNumber('IV')})}
                className="px-3 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600 text-xs"
              >
                สร้าง
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ใบค้างส่ง</label>
            <div className="flex">
              <input
                type="text"
                value={formData.backorderNo}
                onChange={(e) => setFormData({...formData, backorderNo: e.target.value})}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setFormData({...formData, backorderNo: generateDocumentNumber('BO')})}
                className="px-3 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600 text-xs"
              >
                สร้าง
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ใบเสร็จ</label>
            <div className="flex">
              <input
                type="text"
                value={formData.receiptNo}
                onChange={(e) => setFormData({...formData, receiptNo: e.target.value})}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setFormData({...formData, receiptNo: generateDocumentNumber('RC')})}
                className="px-3 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600 text-xs"
              >
                สร้าง
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">รายการสินค้า</h3>
          <button
            onClick={addItem}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มรายการ
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left border-b">รหัส</th>
                <th className="px-4 py-2 text-left border-b">รายการ</th>
                <th className="px-4 py-2 text-left border-b">จำนวน</th>
                <th className="px-4 py-2 text-left border-b">หน่วย</th>
                <th className="px-4 py-2 text-left border-b">ราคา/หน่วย</th>
                <th className="px-4 py-2 text-left border-b">ส่วนลด</th>
                <th className="px-4 py-2 text-left border-b">รวมเงิน</th>
                <th className="px-4 py-2 text-left border-b">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => updateItem(item.id, 'code', e.target.value)}
                      className="w-16 p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                      placeholder="รายละเอียดสินค้า"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20 p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                      className="w-16 p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      className="w-20 p-1 border border-gray-300 rounded"
                      step="0.01"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className="font-medium">฿{item.totalPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* สรุปยอดเงิน */}
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-end">
            <div className="w-80">
              <div className="flex justify-between py-1">
                <span>รวมเงิน:</span>
                <span>฿{calculateSubtotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>ส่วนลดพิเศษ:</span>
                <input
                  type="number"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData({...formData, discountAmount: parseFloat(e.target.value) || 0})}
                  className="w-24 p-1 border border-gray-300 rounded text-right"
                  step="0.01"
                />
              </div>
              <div className="flex justify-between py-1">
                <span>ราคาสินค้า:</span>
                <span>฿{(calculateSubtotal() - formData.discountAmount).toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>ภาษีมูลค่าเพิ่ม:</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.vatRate}
                    onChange={(e) => setFormData({...formData, vatRate: parseFloat(e.target.value) || 0})}
                    className="w-16 p-1 border border-gray-300 rounded text-right mr-1"
                    step="0.01"
                  />
                  <span className="mr-2">%</span>
                  <span>฿{calculateVAT().toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-t font-bold text-lg">
                <span>รวมทั้งสิ้น:</span>
                <span className="text-green-600">฿{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</span>
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">
                ({numberToThai(calculateTotal())})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* เงื่อนไขและข้อมูลเพิ่มเติม */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">เงื่อนไขและข้อมูลเพิ่มเติม</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลาเครดิต (วัน)</label>
            <input
              type="number"
              value={formData.creditDays}
              onChange={(e) => setFormData({...formData, creditDays: parseInt(e.target.value) || 0})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">กำหนดส่งมอบพัสดุ (วัน)</label>
            <input
              type="number"
              value={formData.deliveryDays}
              onChange={(e) => setFormData({...formData, deliveryDays: parseInt(e.target.value) || 0})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วิธีการชำระเงิน</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="เงินสด">เงินสด</option>
              <option value="เซ็นเนอร์">เซ็นเนอร์</option>
              <option value="เงินโอน">เงินโอน</option>
              <option value="เช็ค">เช็ค</option>
            </select>
          </div>
        </div>
      </div>

      {/* ปุ่มจัดการ */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setCurrentView('preview')}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-5 h-5 mr-2" />
          ดูตัวอย่างเอกสาร
        </button>
        <button
          onClick={() => alert('บันทึกข้อมูลเรียบร้อย')}
          className="flex items-center px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <Save className="w-5 h-5 mr-2" />
          บันทึก
        </button>
      </div>
    </div>
  );

  // หน้าตัวอย่างเอกสาร
  const PreviewView = () => {
    
    // 1. ใบเสนอราคา
    const QuotationDocument = () => (
      <div className="bg-white p-8 shadow-lg min-h-screen text-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">ใบเสนอราคา</h1>
        </div>

        <div className="mb-6">
          <p><strong>เรียน:</strong> {formData.customerName}</p>
          <div className="mt-4">
            <p>1. ข้าพเจ้า {formData.companyName} ตั้งอยู่เลขที่ {formData.companyAddress}</p>
            <p>เลขประจำตัวผู้เสียภาษี {formData.companyTaxId} ข้าพเจ้ามีความยินดีที่จะเสนอราคาให้ท่าน</p>
            <p>และมีใบอนุญาตชองครุ ราคา</p>
            <p>2. ข้าพเจ้าขอเสนอราคาสินค้า รวมทั้งบริการและกำหนดส่งมอบ ดังต่อไปนี้</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-black text-xs mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 text-center w-12">ลำดับ</th>
              <th className="border border-black p-2 text-center">รายการ</th>
              <th className="border border-black p-2 text-center w-20">จำนวน</th>
              <th className="border border-black p-2 text-center w-24">ราคาต่อหน่วย</th>
              <th className="border border-black p-2 text-center w-24">รวมเป็นเงิน</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-black p-2 text-center">{index + 1}</td>
                <td className="border border-black p-2">{item.description}</td>
                <td className="border border-black p-2 text-center">{item.quantity} {item.unit}</td>
                <td className="border border-black p-2 text-right">{item.unitPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                <td className="border border-black p-2 text-right">{item.totalPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
              </tr>
            ))}
            {Array.from({length: Math.max(0, 8 - formData.items.length)}).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="border border-black p-2 h-8"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="border border-black p-2 text-right">รวม</td>
              <td className="border border-black p-2 text-right">{calculateSubtotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-black p-2 text-right">ส่วนลด</td>
              <td className="border border-black p-2 text-right"></td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-black p-2 text-right">ราคาสินค้า</td>
              <td className="border border-black p-2 text-right">{calculateSubtotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-black p-2 text-right">ภาษีมูลค่าเพิ่ม {formData.vatRate}%</td>
              <td className="border border-black p-2 text-right"></td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-black p-2 text-right font-bold">ราคารวมทั้งสิ้น</td>
              <td className="border border-black p-2 text-right font-bold">{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="5" className="border border-black p-2 text-center">
                ({numberToThai(calculateTotal())})
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="text-xs space-y-1 mb-6">
          <p><strong>ขึ้นราคาที่ร่วมการจัดจำหน่ายใหม่รวมทั้งใจจาจองเคเอแล้ว</strong></p>
          <p><strong>3. กำกับอารคาใบระยะเวลา {formData.creditDays} วัน นับตั้งแต่วันที่ขึ้นใบเสนอราคา</strong></p>
          <p><strong>4. กำหนดส่งมอบพัสดุตามกำหนดระยะเวลาข่างต้น ภายใน {formData.deliveryDays} วัน นับถัดจากวันลงนามสั่งซื้อ</strong></p>
        </div>

        <div className="mb-4">
          <p>เสนอราคามา ณ วันที่........... เดือน.......................... พ.ศ. .........................</p>
        </div>

        <div className="flex justify-between">
          <div className="text-center">
            <p>(ลงชื่อ)................................. ผู้เสนอราคา</p>
            <p className="mt-8">(.....................................)</p>
            <br />
            <p>เจ้าหน้าที่</p>
          </div>
          <div className="text-center">
            <p>(ลงชื่อ)................................. ผู้เสนอราคา</p>
            <p>(นางสมหล่านกิาณ์ ดิษณุบาท)</p>
            <br />
            <p>ผู้จัดการ</p>
            <p>ประจำครุ(ต์ชั่น)</p>
          </div>
        </div>
      </div>
    );

    // 2. ใบส่งสินค้า/ใบกำกับภาษี
    const DeliveryDocument = () => (
      <div className="bg-white p-8 shadow-lg min-h-screen text-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">{formData.companyName}</h1>
          <h2 className="text-lg">ใบส่งสินค้า/ใบกำกับภาษี</h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p>{formData.companyAddress}</p>
            <p>โทร {formData.companyPhone} มือถือ {formData.companyMobile}</p>
            <br />
            <p>ชื่อผู้ซื้อ: {formData.customerCode}-{formData.customerName}</p>
            <p>ที่อยู่:</p>
          </div>
          <div className="text-right">
            <div className="border border-black p-2 inline-block">
              <p>เลขประจำตัวผู้เสียภาษี</p>
              <p className="font-bold">{formData.companyTaxId}</p>
            </div>
            <br />
            <p>วันที่ ......./......./........</p>
            <p>เลขที่ {formData.deliveryNo}</p>
          </div>
        </div>

        <div className="mb-4">
          <p>กรุณากำกับภาษี-ลูกค้า</p>
        </div>

        <table className="w-full border-collapse border border-black text-xs mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 text-center w-12">ลำดับ</th>
              <th className="border border-black p-2 text-center">รายการ</th>
              <th className="border border-black p-2 text-center w-20">จำนวนรายการ</th>
              <th className="border border-black p-2 text-center w-20">ราคาต่อหน่วย</th>
              <th className="border border-black p-2 text-center w-16">%ส่วนลด</th>
              <th className="border border-black p-2 text-center w-24">จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-black p-2 text-center">{item.code}</td>
                <td className="border border-black p-2">{item.description}</td>
                <td className="border border-black p-2 text-center">{item.quantity} {item.unit}</td>
                <td className="border border-black p-2 text-right">{item.unitPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                <td className="border border-black p-2 text-center">0.00%</td>
                <td className="border border-black p-2 text-right">{item.totalPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
              </tr>
            ))}
            {Array.from({length: Math.max(0, 8 - formData.items.length)}).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="border border-black p-2 h-8"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" className="border border-black p-2 text-right">รวม</td>
              <td className="border border-black p-2 text-right">{calculateSubtotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="5" className="border border-black p-2 text-right">ส่วนลดพิเศษ</td>
              <td className="border border-black p-2 text-right"></td>
            </tr>
            <tr>
              <td colSpan="5" className="border border-black p-2 text-right">ราคาสินค้า</td>
              <td className="border border-black p-2 text-right">{calculateSubtotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="5" className="border border-black p-2 text-right">ภาษีมูลค่าเพิ่ม %</td>
              <td className="border border-black p-2 text-right"></td>
            </tr>
            <tr>
              <td colSpan="5" className="border border-black p-2 text-right font-bold">รวมทั้งสิ้น</td>
              <td className="border border-black p-2 text-right font-bold">{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="6" className="border border-black p-2 text-center">
                ({numberToThai(calculateTotal())})
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="grid grid-cols-4 gap-4 text-center text-xs">
          <div>
            <p>ผู้รับ............................ ผู้ตรวจ.............................</p>
            <p>(.............................)</p>
            <p>......./......../..........</p>
          </div>
          <div>
            <p>ผู้ส่ง............................ ผู้ส่งสินค้า.............................</p>
            <p>(.............................)</p>
            <p>......./......../..........</p>
          </div>
          <div>
            <p>ผู้เสียภาษี............................ ผู้รับสินค้า.............................</p>
            <p>(.............................)</p>
            <p>......./......../..........</p>
          </div>
          <div>
            <p>ผู้รับ............................ ผู้รับสินค้า.............................</p>
            <p>(.............................)</p>
            <p>......./......../..........</p>
          </div>
        </div>
      </div>
    );

    // 3. ใบค้างส่งสินค้า
    const BackorderDocument = () => (
      <div className="bg-white p-8 shadow-lg min-h-screen text-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">ใบค้างส่งสินค้า</h1>
          <h2 className="text-lg">{formData.companyName}</h2>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>{formData.companyAddress}</p>
              <p>โทร {formData.companyPhone} มือถือ {formData.companyMobile}</p>
              <br />
              <p>ออกใบสำคัญการ และที่ {formData.deliveryNo}</p>
              <p>ชื่อผู้ซื้อ: {formData.customerCode} ลูกค้าทั่วไป</p>
              <p>ที่อยู่:</p>
            </div>
            <div className="text-right">
              <p>เลขที่ {formData.backorderNo}</p>
              <p>วันที่ {formatThaiDate(formData.documentDate)}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p>{formData.companyName} ยังไม่ได้จตรสแก้ไขงานาแก้ไขร้อยปโมมัน</p>
        </div>

        <table className="w-full border-collapse border border-black text-xs mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 text-center w-12">ลำดับ</th>
              <th className="border border-black p-2 text-center">รายการ</th>
              <th className="border border-black p-2 text-center w-20">จำนวน</th>
              <th className="border border-black p-2 text-center w-24">ราคา</th>
              <th className="border border-black p-2 text-center w-24">รวมเป็นเงิน</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-black p-2 text-center">{item.code}</td>
                <td className="border border-black p-2">{item.description}</td>
                <td className="border border-black p-2 text-center">{item.quantity} {item.unit}</td>
                <td className="border border-black p-2 text-right">{item.unitPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
                <td className="border border-black p-2 text-right">{item.totalPrice.toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
              </tr>
            ))}
            {Array.from({length: Math.max(0, 8 - formData.items.length)}).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="border border-black p-2 h-8"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between text-center">
          <div>
            <p>ลงชื่อ................................. ผู้รับสินค้า</p>
            <p className="mt-8">(.....................................)</p>
          </div>
          <div>
            <p>(ลงชื่อ)................................. ผู้ยกใบค้างส่ง</p>
            <p className="mt-8">(.....................................)</p>
          </div>
        </div>
      </div>
    );

    // 4. ใบเสร็จรับเงิน
    const ReceiptDocument = () => (
      <div className="bg-white p-8 shadow-lg min-h-screen text-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">ใบเสร็จรับเงิน</h1>
          <h2 className="text-lg">{formData.companyName}</h2>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>เลขประจำตัวผู้เสียภาษี {formData.companyTaxId}</p>
              <p>{formData.companyAddress}</p>
              <br />
              <p>ชื่อผู้ซื้อ(CUSTOMER) {formData.customerName}</p>
              <p>ที่อยู่(ADDRESS) {formData.customerAddress}</p>
            </div>
            <div className="text-right">
              <p>เลขที่ {formData.receiptNo}</p>
              <p>เลขประจำตัวผู้เสียภาษี {formData.companyTaxId}</p>
              <br />
              <p>วันที่ {formatThaiDate(formData.documentDate)}</p>
            </div>
          </div>
        </div>

        <table className="w-full border-collapse border border-black text-xs mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 text-center w-12">ลำดับ</th>
              <th className="border border-black p-2 text-center">รายการ</th>
              <th className="border border-black p-2 text-center w-20">จำนวนรายการ</th>
              <th className="border border-black p-2 text-center w-24">รวมเป็นเงิน</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2">
                ได้รับเงินค่าสินค้าตามใบส่งสินค้าเลขที่ {formData.deliveryNo} ลงวันที่ {formatThaiDate(formData.documentDate)}
              </td>
              <td className="border border-black p-2 text-center">1</td>
              <td className="border border-black p-2 text-right">{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            {Array.from({length: 7}).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="border border-black p-2 h-8"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
                <td className="border border-black p-2"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="border border-black p-2 text-right font-bold">รวมทั้งสิ้น</td>
              <td className="border border-black p-2 text-right font-bold">{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-black p-2 text-center">
                ({numberToThai(calculateTotal())})
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span>จ่ายแล้วโดย</span>
            <label className="flex items-center">
              <input type="radio" checked={formData.paymentMethod === 'เงินสด'} readOnly />
              <span className="ml-1">เงินสด</span>
            </label>
            <label className="flex items-center">
              <input type="radio" checked={formData.paymentMethod === 'เซ็นเนอร์'} readOnly />
              <span className="ml-1">เซ็นเนอร์</span>
            </label>
            <label className="flex items-center">
              <input type="radio" checked={formData.paymentMethod === 'เงินโอน'} readOnly />
              <span className="ml-1">เงินโอน</span>
            </label>
            <label className="flex items-center">
              <input type="radio" checked={formData.paymentMethod === 'เช็ค'} readOnly />
              <span className="ml-1">เช็ค</span>
            </label>
            <span>ธนาคาร ....................................</span>
          </div>
          <p className="mt-2">เลขที่ ................................ วันที่ ..................................</p>
        </div>

        <div className="text-center">
          <p>กรณีจะเช็คมีปิดยาดา ไม่คด่สงฉันในนาม ร้าน อ.วัชนา และให้เสร็จจัดเมื่อประกันผู้ดสีดสิไม่ได้เยาะกันมีเล่งใบซิวหายกิ</p>
          <br />
          <p>(ลงชื่อ) ......................................... ผู้รับเงิน</p>
          <p>(นางสมหล่านกิาณ์ ดิษณุบาท)</p>
        </div>
      </div>
    );

    const renderDocument = () => {
      switch (previewDocument) {
        case 'quotation':
          return <QuotationDocument />;
        case 'delivery':
          return <DeliveryDocument />;
        case 'backorder':
          return <BackorderDocument />;
        case 'receipt':
          return <ReceiptDocument />;
        default:
          return <QuotationDocument />;
      }
    };

    return (
      <div>
        {/* เมนูเลือกเอกสาร */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">ตัวอย่างเอกสารการขาย</h2>
            <button
              onClick={() => setCurrentView('form')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              กลับไปแก้ไข
            </button>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setPreviewDocument('quotation')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'quotation' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ใบเสนอราคา
            </button>
            <button
              onClick={() => setPreviewDocument('delivery')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'delivery' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ใบส่งสินค้า
            </button>
            <button
              onClick={() => setPreviewDocument('backorder')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'backorder' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ใบค้างส่งสินค้า
            </button>
            <button
              onClick={() => setPreviewDocument('receipt')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'receipt' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ใบเสร็จรับเงิน
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              พิมพ์เอกสาร
            </button>
            <button
              onClick={() => alert('ระบบจะสร้างไฟล์ PDF สำหรับดาวน์โหลด')}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลด PDF
            </button>
          </div>

          {/* แสดง Workflow */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">ลำดับขั้นตอนการขาย:</h3>
            <div className="flex items-center space-x-2 text-sm">
              <span className={`px-2 py-1 rounded ${previewDocument === 'quotation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                1. ใบเสนอราคา
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className={`px-2 py-1 rounded ${previewDocument === 'delivery' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                2. ใบส่งสินค้า
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className={`px-2 py-1 rounded ${previewDocument === 'backorder' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>
                3. ใบค้างส่งสินค้า
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className={`px-2 py-1 rounded ${previewDocument === 'receipt' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>
                4. ใบเสร็จรับเงิน
              </span>
            </div>
          </div>
        </div>

        {/* แสดงเอกสาร */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          {renderDocument()}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ระบบเอกสารการขาย</h1>
          <p className="text-gray-600">ใบเสนอราคา • ใบส่งสินค้า • ใบค้างส่งสินค้า • ใบเสร็จรับเงิน</p>
        </div>

        {currentView === 'form' ? <FormView /> : <PreviewView />}
      </div>
    </div>
  );
};

export default SalesDocumentSystem;