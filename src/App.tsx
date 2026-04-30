/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Database, Settings } from 'lucide-react';
import { Product, InventoryStats, Category } from './types';
import { StatsOverview } from './components/StatsOverview';
import { InventoryChart } from './components/InventoryChart';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { motion } from 'motion/react';

const INITIAL_MOCK_DATA: Product[] = [
  {
    id: '1',
    name: 'Pro Laptop 16"',
    description: 'High-performance laptop for professionals',
    price: 1999.99,
    stock: 12,
    minStock: 5,
    category: 'Electronics',
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Premium sound quality with active noise cancellation',
    price: 299.99,
    stock: 3,
    minStock: 10,
    category: 'Electronics',
    updatedAt: Date.now(),
  },
  {
    id: '3',
    name: 'Organic Espresso Beans',
    description: 'Fair trade, medium dark roast espresso beans (1kg)',
    price: 24.50,
    stock: 45,
    minStock: 15,
    category: 'Food & Beverage',
    updatedAt: Date.now(),
  },
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_DATA;
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(products));
  }, [products]);

  const stats = useMemo<InventoryStats>(() => {
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStockItems = products.filter((p) => p.stock <= p.minStock);
    
    // Calculate category distribution
    const catMap = new Map<string, number>();
    products.forEach((p) => {
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    });
    
    const categoryDistribution = Array.from(catMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalProducts: products.length,
      totalValue,
      lowStockCount: lowStockItems.length,
      categoryDistribution,
    };
  }, [products]);

  const handleSaveProduct = (data: Omit<Product, 'id' | 'updatedAt'>) => {
    if (editingProduct) {
      setProducts(products.map((p) => 
        p.id === editingProduct.id 
          ? { ...p, ...data, updatedAt: Date.now() } 
          : p
      ));
    } else {
      const newProduct: Product = {
        ...data,
        id: crypto.randomUUID(),
        updatedAt: Date.now(),
      };
      setProducts([...products, newProduct]);
    }
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      {/* Sidebar - Desktop */}
      <aside className="w-64 border-r border-neutral-200 bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-neutral-900 rounded flex items-center justify-center text-white font-bold">SM</div>
            <span className="font-bold tracking-tight text-lg">StockMaster</span>
          </div>
          
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-neutral-100 text-neutral-900 rounded-lg">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors">
              <Database className="w-4 h-4" />
              Inventory
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200 p-4 md:p-6 mb-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Inventory Dashboard</h1>
              <p className="text-sm text-neutral-500">Manage your product stock and track performance.</p>
            </div>
            <button 
              onClick={() => {
                setEditingProduct(undefined);
                setIsFormOpen(true);
              }}
              className="btn-primary"
            >
              <Plus className="w-5 h-5" />
              New Product
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 pb-12">
          {/* Stats & Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StatsOverview stats={stats} />
            </div>
            <div>
              <InventoryChart data={stats.categoryDistribution} />
            </div>
          </section>

          {/* Product Management Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                All Products
                <span className="text-xs font-normal bg-neutral-200 px-2 py-0.5 rounded-full text-neutral-600">
                  {products.length} items
                </span>
              </h2>
            </div>
            <ProductList 
              products={products} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          </section>
        </div>
      </main>

      <ProductForm 
        isOpen={isFormOpen}
        initialData={editingProduct}
        onCancel={() => {
          setIsFormOpen(false);
          setEditingProduct(undefined);
        }}
        onSave={handleSaveProduct}
      />
    </div>
  );
}

