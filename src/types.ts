/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Electronics' | 'Clothing' | 'Food & Beverage' | 'Home & Garden' | 'Health' | 'Other';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  minStock: number; // For alerts
  category: Category;
  updatedAt: number;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  categoryDistribution: { name: string; value: number }[];
}
