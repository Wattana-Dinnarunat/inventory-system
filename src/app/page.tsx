'use client';

import { useState } from 'react';
import InventoryManagementSystem from '@/components/inventory-management-system';
import PurchaseOrderSystem from '@/components/purchase-order-system';
import SalesDocumentSystem from '@/components/sales-document-system';

export default function Home() {
  const [currentSystem, setCurrentSystem] = useState('inventory');

  const systems = [
    { id: 'inventory', name: 'ระบบจัดการสต๊อก', component: InventoryManagementSystem },
    { id: 'purchase', name: 'ระบบจัดซื้อจัดจ้าง', component: PurchaseOrderSystem },
    { id: 'sales', name: 'ระบบเอกสารการขาย', component: SalesDocumentSystem }
  ];

  const CurrentComponent = systems.find(s => s.id === currentSystem)?.component || InventoryManagementSystem;

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ระบบจัดการธุรกิจครบวงจร</h1>
            </div>
            <div className="flex items-center space-x-4">
              {systems.map(system => (
                <button
                  key={system.id}
                  onClick={() => setCurrentSystem(system.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentSystem === system.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {system.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <CurrentComponent />
      </main>
    </div>
  );
}