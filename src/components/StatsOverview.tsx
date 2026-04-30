/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Package, DollarSign, AlertTriangle, Tag } from 'lucide-react';
import { InventoryStats } from '../types';
import { formatCurrency } from '../lib/utils';

interface StatsOverviewProps {
  stats: InventoryStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? 'text-amber-600' : 'text-neutral-400',
      bg: stats.lowStockCount > 0 ? 'bg-amber-50' : 'bg-neutral-50',
    },
    {
      label: 'Categories',
      value: stats.categoryDistribution.length,
      icon: Tag,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6 flex items-start justify-between"
        >
          <div>
            <p className="text-sm font-medium text-neutral-500">{card.label}</p>
            <p className="text-2xl font-bold mt-1 tracking-tight">{card.value}</p>
          </div>
          <div className={`${card.bg} p-2.5 rounded-lg`}>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
