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
  Eye
} from 'lucide-react';

const PurchaseOrderSystem = () => {
  const [formData, setFormData] = useState({
    // ข้อมูลทั่วไป
    documentNo: 'PO001',
    date: new Date().toISOString().split('T')[0],
    department: 'ลูกค้าทั่วไป',
    subject: 'รายงานขอซื้อพัสดุ',
    
    // ข้อมูลผู้จำหน่าย
    vendorName: '',
    vendorAddress: '',
    vendorPhone: '',
    vendorTaxId: '',
    
    // ข้อมูลการจัดส่ง
    deliveryLocation: '',
    deliveryDate: '',
    paymentTerms: '',
    
    // รายการสินค้า
    items: [
      {
        id: 1,
        description: '',
        quantity: 1,
        unit: '',
        unitPrice: 0,
        totalPrice: 0
      }
    ],
    
    // ข้อมูลการอนุมัติ
    requestedBy: '',
    approvedBy: '',
    authorizedBy: '',
    
    // เงื่อนไขและหมายเหตุ
    terms: '',
    notes: '',
    deliveryPeriod: '5 วัน',
    warrantyPeriod: '',
    
    // ข้อมูลใบรับรองพัสดุ
    certificationDate: new Date().toISOString().split('T')[0],
    receivedBy: '',
    checkedBy: '',
    certifiedBy: ''
  });

  const [currentView, setCurrentView] = useState('form');
  const [previewDocument, setPreviewDocument] = useState('memo');

  // ฟังก์ชันเพิ่มรายการสินค้า
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      unit: '',
      unitPrice: 0,
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
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    });
  };

  // คำนวณยอดรวมทั้งหมด
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + item.totalPrice, 0);
  };

  // ฟังก์ชันสร้างเลขที่เอกสารอัตโนมัติ
  const generateDocumentNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO${year}${month}${day}${random}`;
  };

  // แปลงตัวเลขเป็นภาษาไทย
  const numberToThai = (num) => {
    const thaiDigits = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
    
    if (num === 0) return 'ศูนย์บาทถ้วน';
    
    let result = '';
    let numStr = num.toString();
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

  // ฟอร์มป้อนข้อมูล
  const FormView = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">แบบฟอร์มจัดซื้อจัดจ้าง</h2>
      
      {/* ข้อมูลทั่วไป */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลทั่วไป</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่เอกสาร</label>
            <div className="flex">
              <input
                type="text"
                value={formData.documentNo}
                onChange={(e) => setFormData({...formData, documentNo: e.target.value})}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setFormData({...formData, documentNo: generateDocumentNumber()})}
                className="px-3 py-2 bg-gray-500 text-white rounded-r-md hover:bg-gray-600"
              >
                สร้าง
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หน่วยงาน</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">เรื่อง</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* ข้อมูลผู้จำหน่าย */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลผู้จำหน่าย</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้จำหน่าย</label>
            <input
              type="text"
              value={formData.vendorName}
              onChange={(e) => setFormData({...formData, vendorName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี</label>
            <input
              type="text"
              value={formData.vendorTaxId}
              onChange={(e) => setFormData({...formData, vendorTaxId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
          <textarea
            value={formData.vendorAddress}
            onChange={(e) => setFormData({...formData, vendorAddress: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
          <input
            type="text"
            value={formData.vendorPhone}
            onChange={(e) => setFormData({...formData, vendorPhone: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">รายการสินค้า/บริการ</h3>
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
                <th className="px-4 py-2 text-left border-b">ลำดับ</th>
                <th className="px-4 py-2 text-left border-b">รายละเอียด</th>
                <th className="px-4 py-2 text-left border-b">จำนวน</th>
                <th className="px-4 py-2 text-left border-b">หน่วย</th>
                <th className="px-4 py-2 text-left border-b">ราคาต่อหน่วย</th>
                <th className="px-4 py-2 text-left border-b">ราคารวม</th>
                <th className="px-4 py-2 text-left border-b">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                      placeholder="รายละเอียดสินค้า/บริการ"
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
                      className="w-20 p-1 border border-gray-300 rounded"
                      placeholder="หน่วย"
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
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan="5" className="px-4 py-2 text-right font-semibold border-b">รวมเป็นเงิน:</td>
                <td className="px-4 py-2 font-bold border-b text-green-600">
                  ฿{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}
                </td>
                <td className="px-4 py-2 border-b"></td>
              </tr>
              <tr className="bg-gray-50">
                <td colSpan="7" className="px-4 py-2 text-center font-medium border-b">
                  ({numberToThai(calculateTotal())})
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ข้อมูลการจัดส่งและเงื่อนไข */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลการจัดส่งและเงื่อนไข</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สถานที่จัดส่ง</label>
            <textarea
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({...formData, deliveryLocation: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่ต้องการรับสินค้า</label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">กำหนดส่งมอบ</label>
            <input
              type="text"
              value={formData.deliveryPeriod}
              onChange={(e) => setFormData({...formData, deliveryPeriod: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="เช่น 5 วัน, 1 สัปดาห์"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เงื่อนไขการชำระเงิน</label>
            <input
              type="text"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="เช่น เงินสด, เครดิต 30 วัน"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ/เงื่อนไขพิเศษ</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
          />
        </div>
      </div>

      {/* ข้อมูลผู้เกี่ยวข้อง */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลผู้เกี่ยวข้อง</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ผู้ขออนุมัติ</label>
            <input
              type="text"
              value={formData.requestedBy}
              onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ผู้อนุมัติ</label>
            <input
              type="text"
              value={formData.approvedBy}
              onChange={(e) => setFormData({...formData, approvedBy: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ผู้มีอำนาจลงนาม</label>
            <input
              type="text"
              value={formData.authorizedBy}
              onChange={(e) => setFormData({...formData, authorizedBy: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatShortDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear() + 543; // Convert to Buddhist year
      return `${day}/${month}/${year}`;
    };

    // บันทึกข้อความ
    const MemoDocument = () => (
      <div className="bg-white p-8 shadow-lg min-h-screen text-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 border border-black rounded-full flex items-center justify-center">
            <div className="text-xs">ตราครุฑ</div>
          </div>
          <h1 className="text-xl font-bold">บันทึกข้อความ</h1>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p><strong>ส่วนราชการ:</strong> {formData.department}</p>
              <p><strong>ที่:</strong> {formData.documentNo}</p>
              <p><strong>เรื่อง:</strong> {formData.subject}</p>
            </div>
            <div>
              <p><strong>วันที่:</strong> {formatDate(formData.date)}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p><strong>เรียน:</strong> {formData.vendorName || 'ผู้จำหน่าย'}</p>
          <br />
          <p className="indent-8">
            ด้วยกลุ่มงาน มีความประสงค์ขอซื้อพัสดุ จำนวน 1 รายการ 
            ซึ่งได้รับการอนุมัติเงินงบประมาณแผ่นดิน
          </p>
          <p><strong>เพื่อ:</strong> การใช้งานในหน่วยงาน</p>
          <p><strong>งาน/โครงการ:</strong> จำนวน {calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท รายละเอียดดังแนบ</p>
        </div>

        <div className="mb-6">
          <p className="mb-2">จึงเรียนมาเพื่อโปรดพิจารณา และหากท่านมีความยินดี</p>
          
          <div className="space-y-2 ml-8">
            <p>๑. เหตุผลและความจำเป็นที่ต้องซื้อ คือ</p>
            <p>๒. รายละเอียดและงบที่จะซื้อคือ (รายละเอียดตามใบทักศึพแนบ)</p>
            <p>๓. ราคากลางของพัสดุที่จะซื้อเป็นเงิน {calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท</p>
            <p>๔. วงเงินที่จะซื้อครั้งนี้ {calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})} บาท (หนึ่งร้อยสี่สิบบาทถ้วน)</p>
            <p>๕. กำหนดเวลาทำงานและส่งมอบงาน {formData.deliveryPeriod} วัน นับถัดจากวันลงนามในสัญญา</p>
            <p>๖. จำจัดวิธีพิจารณาเลือกเจาะจง เนื่องจาก การจัดจ้างพัสดุที่มีการผลิต จำหน่าย ก่อสร้าง หรือให้บริการทั่วไป และมีวงเงินในการจัดซื้อจัดจ้างครั้งหนึ่งไม่เกิน ๑๐๐,๐๐๐ บาท ที่กำหนดในกฎกระทรวง</p>
          </div>
        </div>

        <div className="mb-6">
          <p>๗. หลักเกณฑ์การพิจารณาคัดเลือกโดยเกณฑ์ราคา</p>
          <p>๘. ข้อเสนออื่นๆ เห็นควรแต่งตั้งผู้ตรวจรับพัสดุ ตามเสนอ</p>
          <br />
          <p>จึงเรียนมาเพื่อโปรดพิจารณา</p>
          <p>๑. เห็นชอบในรายงานข้อซื้อจ้างดังกล่าวข้างต้น</p>
          <p>๒. อนุมัติแต่งตั้ง</p>
        </div>

        <div className="flex justify-between mt-12">
          <div className="text-center">
            <p>ลงชื่อ .................................. ผู้รายงาน</p>
            <p className="mt-8">({formData.requestedBy})</p>
            <p>............./............../.............</p>
          </div>
          <div className="text-center">
            <p>ลงชื่อ .................................. ผู้อนุมัติ</p>
            <p className="mt-8">({formData.approvedBy})</p>
            <p>............./............../.............</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p>เห็นชอบ</p>
          <p>อนุมัติ</p>
          <br />
          <p>ลงชื่อ ..................................................................</p>
          <p>({formData.authorizedBy})</p>
          <p>{formData.department}</p>
          <p>............./............../.............</p>
        </div>
      </div>
    );

    // ตารางรายการสินค้า
    const ItemTableDocument = () => (
      <div className="bg-white p-8 shadow-lg text-sm">
        <div className="text-center mb-6">
          <p>รายละเอียดแนบท้ายบันทึกความ ที่ {formData.documentNo} ลงวันที่ {formatShortDate(formData.date)}</p>
          <p>งานจัดซื้อพัสดุ จำนวน 1 รายการ กลุ่มงาน</p>
          <p>โรงเรียนลูกค้าทั่วไป</p>
          <p className="text-right">หน้า 1/1</p>
        </div>

        <table className="w-full border-collapse border border-black text-xs">
          <thead>
            <tr>
              <th className="border border-black p-2 text-center w-12">ลำดับที่</th>
              <th className="border border-black p-2 text-center">รายละเอียดพัสดุที่จะซื้อ</th>
              <th className="border border-black p-2 text-center w-20">จำนวน/หน่วย</th>
              <th className="border border-black p-2 text-center w-24">ราคาต่อหน่วย<br />บาท</th>
              <th className="border border-black p-2 text-center w-24">จำนวนเงิน<br />บาท</th>
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
            {/* เพิ่มแถวว่างเพื่อให้เหมือนในรูป */}
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
              <td colSpan="4" className="border border-black p-2 text-center font-bold">
                รวมเป็นเงินทั้งสิ้น (หนึ่งร้อยสี่สิบบาทถ้วน)
              </td>
              <td className="border border-black p-2 text-right font-bold">
                {calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="flex justify-between mt-8">
          <div className="text-center">
            <p>ลงชื่อ .................................. ผู้รายงาน</p>
            <p className="mt-8">({formData.requestedBy})</p>
            <p>............./............../.............</p>
          </div>
          <div className="text-center">
            <p>ลงชื่อ .................................. ผู้อนุมัติ</p>
            <p className="mt-8">({formData.approvedBy})</p>
            <p>............./............../.............</p>
          </div>
        </div>
      </div>
    );

    // ใบสั่งซื้อ
    const PurchaseOrderDocument = () => (
      <div className="bg-white p-8 shadow-lg text-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 border border-black rounded-full flex items-center justify-center">
            <div className="text-xs">ตราครุฑ</div>
          </div>
          <h1 className="text-xl font-bold">ใบสั่งซื้อ</h1>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p><strong>ผู้ขาย:</strong> ร้าน อ.วัชนา</p>
            <p><strong>ที่อยู่:</strong> {formData.vendorAddress}</p>
            <br />
            <p><strong>โทรศัพท์:</strong> {formData.vendorPhone}</p>
            <p><strong>เลขประจำตัวผู้เสียภาษี:</strong> {formData.vendorTaxId}</p>
            <p><strong>เลขที่ใบสั่งซื้อ:</strong> {formData.documentNo}</p>
            <p><strong>ชื่อบัญชี:</strong> ร้าน อ.วัชนา โดยนางสมหล่านกิาณ์ ดิษณุบาท</p>
            <p><strong>ธนาคาร:</strong> กรุงไทย สาขาหนองค้าย</p>
          </div>
          <div>
            <p><strong>ใบสั่งซื้อ เลขที่:</strong> {formData.documentNo}</p>
            <p><strong>วันที่:</strong> {formatShortDate(formData.date)}</p>
            <p><strong>ลูกค้าทั่วไป</strong></p>
            <p><strong>ที่อยู่:</strong></p>
            <br />
            <p><strong>โทรศัพท์:</strong></p>
            <br />
            <p><strong>ได้เสนอราคา ตามใบเสนอราคาเลขที่:</strong> ............</p>
            <p><strong>ซึ่งได้รับราคาและตกลงซื้อ ตามรายการ</strong></p>
          </div>
        </div>

        <table className="w-full border-collapse border border-black text-xs mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 text-center w-12">ที่</th>
              <th className="border border-black p-2 text-center">รายการ</th>
              <th className="border border-black p-2 text-center w-20">จำนวน/หน่วย</th>
              <th className="border border-black p-2 text-center w-24">ราคาต่อหน่วยละ</th>
              <th className="border border-black p-2 text-center w-24">จำนวนเงิน</th>
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
            {Array.from({length: Math.max(0, 6 - formData.items.length)}).map((_, index) => (
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
              <td colSpan="3" className="border border-black p-2 text-center">รวมเป็นเงิน</td>
              <td className="border border-black p-2 text-center">ภาษีมูลค่าเพิ่ม</td>
              <td className="border border-black p-2 text-right font-bold">{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr>
              <td colSpan="4" className="border border-black p-2 text-center">รวมเป็นเงินทั้งสิ้น</td>
              <td className="border border-black p-2 text-right font-bold">{calculateTotal().toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
            </tr>
          </tfoot>
        </table>

        <div className="text-xs space-y-1 mb-6">
          <p><strong>การส่งของ:</strong> อยู่ภายใต้เงื่อนไขของใบนี้</p>
          <p><strong>๑. กำหนดส่งมอบภายใน</strong> {formData.deliveryPeriod} วัน นับถัดจากวันที่ผู้ขายได้รับใบสั่งซื้อ</p>
          <p><strong>๒. ครบกำหนดส่งมอบวันที่</strong> .............................................</p>
          <p><strong>๓. สถานที่ส่งมอบ</strong></p>
          <p><strong>๔. ระยะเวลารับประกัน</strong> .............................................</p>
          <p><strong>๕. สรรพสิทธิการประกันผู้ส่งมอบกับกำหนด โดยเคลื่อนคำรับเป็นรายวันในอัตรารอยละ ๐.๒๐ ของราคาสิ่งของที่ยังไม่ได้รับมอบ</strong></p>
          <p><strong>๖. โรงเรียนสรรพสิทธิที่จะไม่รับมอบถ้ากว่าการ จำนวนคำเสียหายและไม่ยินราคาม รายการที่จะรับในใบสั่งซื้อ</strong></p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <p>ลงชื่อ .................................. ผู้สั่งซื้อ</p>
            <p className="mt-8">({formData.authorizedBy})</p>
            <p><strong>ตำแหน่ง</strong> .............................................</p>
            <p><strong>วันที่</strong> .............................................</p>
          </div>
          <div className="text-center">
            <p>ลงชื่อ .................................. ผู้ขาย</p>
            <p className="mt-8">(นายชาลีศักดิ์ ดิษณุญาท)</p>
            <p><strong>ตำแหน่ง</strong> ผู้จัดการ</p>
            <p><strong>วันที่</strong> .............................................</p>
          </div>
        </div>
      </div>
    );

    // ใบรับรองพัสดุ
    const CertificationDocument = () => (
      <div className="bg-white p-8 shadow-lg text-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold">ใบรับรองพัสดุ</h1>
          <p className="mt-2">ตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐ ข้อ ๑๙๔</p>
        </div>

        <div className="mb-6">
          <p className="text-center">เขียนที่ลูกค้าทั่วไป</p>
          <p className="text-right">วันที่ ........... เดือน .................... พ.ศ. ...........</p>
        </div>

        <div className="space-y-4 mb-6">
          <p>ตามที่ ลูกค้าทั่วไป</p>
          <p>จาก ร้าน อ.วัชนา</p>
          <p>ลงวันที่ .................................. ครบกำหนดส่งมอบวันที่ .......................................</p>
          <br />
          <p>บัดนี้ ผู้ขาย/ผู้รับจ้าง ได้ส่งของ/ทำงาน พัสดุ ตามรายการส่งมอบ</p>
          <p>ของผู้ขาย/ผู้รับจ้าง เลขที่ ........................ ลงวันที่ ......................................</p>
          <p>การซื้อ/จ้าง รายที่ได้ส่งมาในเวลาเป็นไปตามเงื่อนไข ........................................................</p>
          <br />
          <p>คณะกรรมการตรวจรับพัสดุได้ตรวจรับงานเมื่อวันที่ ............................................</p>
          <p>เรียบร้อยแล้วและถูกต้องส่งมอบ/รับจ้าง ได้ส่งสิ่งของ/ทำงาน พิพากษาประภา เมื่อวันที่</p>
          <p>จำนวน ........ วัน ดดรายสื่อในอัตรา ......................... รวมเป็นเงินทั้งสิ้น ............ บาท จึงคงเหลืออากร พัสดุ</p>
          <p>ฉบับนี้ไว้ไม่ได้ วันที่ ......................... ผู้ขาย/ผู้รับจ้าง สองใจเงินใน จำนวนเงิน ............ บาท</p>
          <p>(หนึ่งร้อยสามสิบแปดจุดหกสิบบาทถ้วน) ตามสัญญา/ใบสั่งซื้อ/ใบสั่งจ้าง ตามสอบ</p>
        </div>

        <div className="space-y-4 mb-8">
          <p>จึงขอเสนอรายงานผู้อำนาจ เพื่อโปรดทราบ ตามสนธิข้อ ๑๙๔ (๔)</p>
          <p>แห้งระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p>ลงชื่อ .................................. ประธานกรรมการ</p>
            <p className="mt-8">({formData.authorizedBy})</p>
          </div>
          <div>
            <p>ลงชื่อ .................................. กรรมการ</p>
            <p className="mt-8">({formData.approvedBy})</p>
          </div>
          <div>
            <p>ลงชื่อ .................................. กรรมการ</p>
            <p className="mt-8">({formData.requestedBy})</p>
          </div>
        </div>

        <div className="mt-8 text-xs">
          <p><strong>หมายเหตุ:</strong> ใช้กับการจัดซื้อหรือจัดจ้างพัสดุ (ที่มิใช่งานก่อสร้าง)</p>
        </div>
      </div>
    );

    const renderDocument = () => {
      switch (previewDocument) {
        case 'memo':
          return <MemoDocument />;
        case 'table':
          return <ItemTableDocument />;
        case 'purchase':
          return <PurchaseOrderDocument />;
        case 'certification':
          return <CertificationDocument />;
        default:
          return <MemoDocument />;
      }
    };

    return (
      <div>
        {/* เมนูเลือกเอกสาร */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">ตัวอย่างเอกสาร</h2>
            <button
              onClick={() => setCurrentView('form')}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              กลับไปแก้ไข
            </button>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setPreviewDocument('memo')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'memo' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              บันทึกข้อความ
            </button>
            <button
              onClick={() => setPreviewDocument('table')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'table' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ตารางรายการ
            </button>
            <button
              onClick={() => setPreviewDocument('purchase')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'purchase' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ใบสั่งซื้อ
            </button>
            <button
              onClick={() => setPreviewDocument('certification')}
              className={`px-4 py-2 rounded-md transition-colors ${
                previewDocument === 'certification' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ใบรับรองพัสดุ
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              พิมพ์เอกสาร
            </button>
            <button
              onClick={() => {
                // สร้าง PDF (จำลอง)
                alert('ระบบจะสร้างไฟล์ PDF สำหรับดาวน์โหลด');
              }}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              ดาวน์โหลด PDF
            </button>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ระบบจัดซื้อจัดจ้าง</h1>
          <p className="text-gray-600">ชุดเอกสารภาครัฐ ครบถ้วนตามระเบียบ</p>
        </div>

        {currentView === 'form' ? <FormView /> : <PreviewView />}
      </div>
    </div>
  );
};

export default PurchaseOrderSystem;