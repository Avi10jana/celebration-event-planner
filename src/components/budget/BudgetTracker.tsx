import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import type { BudgetCategory, BudgetItem } from '../../types/event';
import { exportBudgetToCsv } from '../../services/exportService';
import { AIBudgetDoctor } from './AIBudgetDoctor';
import { 
  Plus, 
  Download, 
  Search, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  X
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  venue: '#8b5cf6',
  catering: '#ec4899',
  photography: '#06b6d4',
  entertainment: '#f59e0b',
  decor: '#10b981',
  attire: '#6366f1',
  stationery: '#d946ef',
  logistics: '#64748b',
  contingency: '#eab308',
  other: '#94a3b8'
};

export const BudgetTracker: React.FC = () => {
  const { 
    activeEvent, 
    currencySymbol, 
    addBudgetItem, 
    updateBudgetItem, 
    deleteBudgetItem, 
    updateEvent,
    showToast 
  } = useEvent();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'venue' as BudgetCategory,
    estimatedCost: 1000,
    actualCost: 1000,
    paid: 0,
    status: 'pending' as 'pending' | 'partially-paid' | 'paid',
    vendorName: '',
    notes: ''
  });

  const totalBudget = activeEvent.totalBudget || 1;
  const totalProjected = activeEvent.budgetItems.reduce(
    (sum, item) => sum + (item.actualCost > 0 ? item.actualCost : item.estimatedCost),
    0
  );
  const totalPaid = activeEvent.budgetItems.reduce((sum, item) => sum + item.paid, 0);
  const remainingBudget = totalBudget - totalProjected;
  const isOverBudget = remainingBudget < 0;

  // Breakdown by Category
  const categoryTotals: Record<string, number> = {};
  activeEvent.budgetItems.forEach((item) => {
    const cost = item.actualCost > 0 ? item.actualCost : item.estimatedCost;
    if (cost > 0) {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + cost;
    }
  });

  // Filter items
  const filteredItems = activeEvent.budgetItems.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'catering',
      estimatedCost: 500,
      actualCost: 500,
      paid: 0,
      status: 'pending',
      vendorName: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      estimatedCost: item.estimatedCost,
      actualCost: item.actualCost,
      paid: item.paid,
      status: item.status,
      vendorName: item.vendorName || '',
      notes: item.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingItem) {
      updateBudgetItem({
        ...editingItem,
        ...formData
      });
    } else {
      addBudgetItem(formData);
    }
    setIsModalOpen(false);
  };

  const handleExportCsv = () => {
    exportBudgetToCsv(activeEvent);
    showToast('Exported budget spreadsheet to CSV', 'success');
  };

  const handleTotalBudgetChange = (newVal: number) => {
    if (newVal > 0) {
      updateEvent({ ...activeEvent, totalBudget: newVal });
    }
  };

  return (
    <div className="budget-container">
      {/* Financial Health Header */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h3>Total Event Budget</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span className="kpi-value">{currencySymbol}{totalBudget.toLocaleString()}</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Adjust Target:</label>
              <input
                type="number"
                className="input"
                style={{ padding: '4px 8px', fontSize: '0.8rem', width: '130px', marginLeft: 6 }}
                defaultValue={totalBudget}
                onBlur={(e) => handleTotalBudgetChange(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h3>Projected / Actual Cost</h3>
            <div className="kpi-value" style={{ color: isOverBudget ? '#f87171' : '#f8fafc' }}>
              {currencySymbol}{totalProjected.toLocaleString()}
            </div>
            <div className="kpi-sub">
              {((totalProjected / totalBudget) * 100).toFixed(1)}% of total allocated
            </div>
          </div>
          <div className="kpi-icon" style={{ background: isOverBudget ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: isOverBudget ? '#f87171' : '#34d399' }}>
            {isOverBudget ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h3>Total Paid So Far</h3>
            <div className="kpi-value" style={{ color: '#34d399' }}>
              {currencySymbol}{totalPaid.toLocaleString()}
            </div>
            <div className="kpi-sub">
              {currencySymbol}{(totalProjected - totalPaid).toLocaleString()} pending payment
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-info">
            <h3>Remaining Capacity</h3>
            <div className="kpi-value" style={{ color: isOverBudget ? '#f87171' : '#38bdf8' }}>
              {isOverBudget ? '-' : ''}{currencySymbol}{Math.abs(remainingBudget).toLocaleString()}
            </div>
            <div className="kpi-sub" style={{ color: isOverBudget ? '#f87171' : 'var(--text-muted)' }}>
              {isOverBudget ? 'Budget exceeded! Check Doctor' : 'Available for contingencies'}
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* AI Budget Doctor Component */}
      <AIBudgetDoctor />

      {/* Category Visual Breakdown */}
      <div className="glass-panel" style={{ padding: 24, marginBottom: 28 }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 14 }}>Budget Distribution by Category</h3>
        
        {/* Multi-color segment bar */}
        <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', background: 'rgba(255, 255, 255, 0.06)', marginBottom: 16 }}>
          {Object.entries(categoryTotals).map(([cat, amount]) => {
            const pct = Math.max(1, (amount / (totalProjected || 1)) * 100);
            return (
              <div
                key={cat}
                style={{
                  width: `${pct}%`,
                  background: CATEGORY_COLORS[cat] || '#8b5cf6',
                  transition: 'width 0.3s ease'
                }}
                title={`${cat.toUpperCase()}: ${currencySymbol}${amount.toLocaleString()} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Legend Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {Object.entries(categoryTotals).map(([cat, amount]) => (
            <div
              key={cat}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.8rem',
                cursor: 'pointer',
                opacity: categoryFilter === 'all' || categoryFilter === cat ? 1 : 0.4
              }}
              onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
            >
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: CATEGORY_COLORS[cat] || '#8b5cf6' }} />
              <span style={{ textTransform: 'capitalize', color: '#f8fafc' }}>{cat}:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                {currencySymbol}{amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Ledger Header & Filters */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search expense or vendor..."
                className="input"
                style={{ paddingLeft: 34, width: 220 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="select"
              style={{ width: 'auto' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories ({activeEvent.budgetItems.length})</option>
              <option value="venue">Venue</option>
              <option value="catering">Catering</option>
              <option value="photography">Photography</option>
              <option value="entertainment">Entertainment</option>
              <option value="decor">Decor & Flowers</option>
              <option value="attire">Attire & Styling</option>
              <option value="stationery">Stationery</option>
              <option value="logistics">Logistics</option>
              <option value="contingency">Contingency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={handleExportCsv} className="btn btn-secondary btn-sm">
              <Download size={14} />
              <span>Export CSV</span>
            </button>
            <button onClick={openAddModal} className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Expense Item</th>
                <th>Category</th>
                <th>Estimated</th>
                <th>Actual Cost</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Vendor / Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                    No expense records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${CATEGORY_COLORS[item.category] || '#8b5cf6'}25`,
                          borderColor: `${CATEGORY_COLORS[item.category] || '#8b5cf6'}50`,
                          color: CATEGORY_COLORS[item.category] || '#8b5cf6'
                        }}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td>{currencySymbol}{item.estimatedCost.toLocaleString()}</td>
                    <td style={{ fontWeight: 700, color: item.actualCost > item.estimatedCost ? '#f87171' : '#f8fafc' }}>
                      {currencySymbol}{item.actualCost.toLocaleString()}
                    </td>
                    <td style={{ color: '#34d399' }}>{currencySymbol}{item.paid.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === 'paid'
                            ? 'badge-success'
                            : item.status === 'partially-paid'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: 200, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.vendorName && <strong style={{ color: '#ffffff' }}>{item.vendorName}: </strong>}
                      {item.notes || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => openEditModal(item)}
                          className="btn-ghost"
                          style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                          title="Edit Item"
                        >
                          <Edit3 size={15} color="#c084fc" />
                        </button>
                        <button
                          onClick={() => deleteBudgetItem(item.id)}
                          className="btn-ghost"
                          style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                          title="Delete Item"
                        >
                          <Trash2 size={15} color="#f87171" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>{editingItem ? 'Edit Expense Item' : 'Add New Expense Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Item Name / Description *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Multi-tier Floral Wedding Cake"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Category</label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as BudgetCategory })}
                  >
                    <option value="venue">Venue</option>
                    <option value="catering">Catering</option>
                    <option value="photography">Photography</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="decor">Decor & Florals</option>
                    <option value="attire">Attire & Styling</option>
                    <option value="stationery">Stationery & Invites</option>
                    <option value="logistics">Logistics & Rentals</option>
                    <option value="contingency">Contingency</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Payment Status</label>
                  <select
                    className="select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="pending">Pending</option>
                    <option value="partially-paid">Partially Paid</option>
                    <option value="paid">Paid in Full</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Estimated ({currencySymbol})</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Actual Cost ({currencySymbol})</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.actualCost}
                    onChange={(e) => setFormData({ ...formData, actualCost: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Paid ({currencySymbol})</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.paid}
                    onChange={(e) => setFormData({ ...formData, paid: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Vendor Name (Optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Sweet Delights Bakery"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Notes / Deliverables</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="e.g. Deposit paid on May 4th. Delivery scheduled at 1:00 PM."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
