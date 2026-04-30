/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, Filter, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Category } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { useState, useMemo } from 'react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

type SortField = 'name' | 'price' | 'stock' | 'category';
type SortOrder = 'asc' | 'desc';

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (a[sortField] < b[sortField]) return -1 * factor;
        if (a[sortField] > b[sortField]) return 1 * factor;
        return 0;
      });
  }, [products, searchTerm, categoryFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
              className="input pl-10 pr-8 appearance-none"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50 border-bottom border-neutral-200">
              <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('name')}>
                <div className="flex items-center">Product <SortIcon field="name" /></div>
              </th>
              <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('category')}>
                <div className="flex items-center">Category <SortIcon field="category" /></div>
              </th>
              <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('stock')}>
                <div className="flex items-center">Stock <SortIcon field="stock" /></div>
              </th>
              <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => toggleSort('price')}>
                <div className="flex items-center">Price <SortIcon field="price" /></div>
              </th>
              <th className="p-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredAndSortedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500">
                  No products found matching your search.
                </td>
              </tr>
            ) : (
              filteredAndSortedProducts.map((product) => (
                <motion.tr 
                  key={product.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group hover:bg-neutral-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-neutral-900">{product.name}</div>
                    <div className="text-xs text-neutral-500 truncate max-w-[200px]">{product.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "font-mono text-sm px-2 py-0.5 rounded",
                        product.stock <= product.minStock ? "bg-amber-100 text-amber-700 font-bold" : "bg-neutral-100 text-neutral-700"
                      )}>
                        {product.stock}
                      </span>
                      {product.stock <= product.minStock && (
                        <span className="text-[10px] uppercase font-bold text-amber-600">Low Stock</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 hover:bg-neutral-200 rounded text-neutral-600 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
