import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import type { Vendor, VendorCategory } from '../../types/event';
import { VendorRfpModal } from './VendorRfpModal';
import { 
  Plus, 
  MessageSquare, 
  Star, 
  CheckSquare, 
  Square, 
  Phone, 
  Trash2, 
  Edit3, 
  X
} from 'lucide-react';

export const VendorChecklist: React.FC = () => {
  const { 
    activeEvent, 
    currencySymbol, 
    addVendor, 
    updateVendor, 
    deleteVendor, 
    toggleVendorChecklist,
    showToast 
  } = useEvent();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rfpVendor, setRfpVendor] = useState<Vendor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // New item input for inline checklists
  const [newChecklistText, setNewChecklistText] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'catering' as VendorCategory,
    contactPerson: '',
    email: '',
    phone: '',
    status: 'researching' as 'researching' | 'contacted' | 'quoted' | 'booked' | 'declined',
    quoteAmount: 2000,
    depositPaid: 500,
    rating: 4.8,
    notes: ''
  });

  const openAddModal = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      category: 'photography',
      contactPerson: '',
      email: '',
      phone: '',
      status: 'researching',
      quoteAmount: 1500,
      depositPaid: 0,
      rating: 4.9,
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      category: vendor.category,
      contactPerson: vendor.contactPerson || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      status: vendor.status,
      quoteAmount: vendor.quoteAmount,
      depositPaid: vendor.depositPaid,
      rating: vendor.rating || 4.8,
      notes: vendor.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingVendor) {
      updateVendor({
        ...editingVendor,
        ...formData
      });
    } else {
      addVendor({
        ...formData,
        checklists: [
          { id: `chk-${Date.now()}-1`, text: 'Check availability on event date', done: true },
          { id: `chk-${Date.now()}-2`, text: 'Review portfolio / tasting / sample', done: false },
          { id: `chk-${Date.now()}-3`, text: 'Confirm cancellation & insurance policy', done: false }
        ]
      });
    }
    setIsModalOpen(false);
  };

  const handleAddInlineChecklist = (vendor: Vendor) => {
    const text = newChecklistText[vendor.id]?.trim();
    if (!text) return;

    const newItem = {
      id: `chk-${Date.now()}`,
      text,
      done: false
    };

    updateVendor({
      ...vendor,
      checklists: [...vendor.checklists, newItem]
    });

    setNewChecklistText({ ...newChecklistText, [vendor.id]: '' });
    showToast(`Added checklist item to ${vendor.name}`, 'success');
  };

  const filteredVendors = activeEvent.vendors.filter((v) => {
    if (categoryFilter === 'all') return true;
    return v.category === categoryFilter;
  });

  return (
    <div className="vendors-container">
      {/* Top Filter and Add Bar */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select
            className="select"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Vendor Categories ({activeEvent.vendors.length})</option>
            <option value="venue">Venue</option>
            <option value="catering">Catering & Bar</option>
            <option value="photography">Photography & Cinema</option>
            <option value="entertainment">Music & DJ</option>
            <option value="decor">Florist & Decor</option>
            <option value="attire">Attire & Beauty</option>
            <option value="cake">Cake & Desserts</option>
            <option value="transport">Transport & Logistics</option>
            <option value="audio_visual">Audio / Visual</option>
          </select>
        </div>

        <button onClick={openAddModal} className="btn btn-primary btn-sm">
          <Plus size={15} />
          <span>Add New Vendor</span>
        </button>
      </div>

      {/* Vendor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {filteredVendors.map((vendor) => {
          const totalTasks = vendor.checklists.length;
          const completedTasks = vendor.checklists.filter((c) => c.done).length;

          return (
            <div key={vendor.id} className="glass-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Header: Name, Category, Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div>
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        color: '#c084fc',
                        marginBottom: 6
                      }}
                    >
                      {vendor.category.toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', color: '#f8fafc' }}>{vendor.name}</h3>
                  </div>

                  <span
                    className={`badge ${
                      vendor.status === 'booked'
                        ? 'badge-success'
                        : vendor.status === 'quoted'
                        ? 'badge-warning'
                        : vendor.status === 'declined'
                        ? 'badge-danger'
                        : 'badge-community'
                    }`}
                  >
                    {vendor.status}
                  </span>
                </div>

                {/* Rating & Contact info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 14, flexWrap: 'wrap' }}>
                  {vendor.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24' }}>
                      <Star size={14} fill="#fbbf24" />
                      <span style={{ fontWeight: 700 }}>{vendor.rating}</span>
                    </div>
                  )}
                  {vendor.contactPerson && (
                    <span>Lead: <strong style={{ color: '#ffffff' }}>{vendor.contactPerson}</strong></span>
                  )}
                  {vendor.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={12} /> {vendor.phone}
                    </span>
                  )}
                </div>

                {/* Financial Summary */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                    marginBottom: 16
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Quoted:</span>{' '}
                    <strong style={{ color: '#f8fafc' }}>{currencySymbol}{vendor.quoteAmount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Deposit Paid:</span>{' '}
                    <strong style={{ color: '#34d399' }}>{currencySymbol}{vendor.depositPaid.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Checklist Section */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Vetting Checklist ({completedTasks}/{totalTasks})
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {vendor.checklists.map((chk) => (
                      <div
                        key={chk.id}
                        onClick={() => toggleVendorChecklist(vendor.id, chk.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          color: chk.done ? 'var(--text-muted)' : '#e2e8f0',
                          textDecoration: chk.done ? 'line-through' : 'none'
                        }}
                      >
                        {chk.done ? (
                          <CheckSquare size={15} color="#10b981" />
                        ) : (
                          <Square size={15} color="var(--text-muted)" />
                        )}
                        <span>{chk.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add inline task */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <input
                      type="text"
                      className="input"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      placeholder="Add task / requirement..."
                      value={newChecklistText[vendor.id] || ''}
                      onChange={(e) => setNewChecklistText({ ...newChecklistText, [vendor.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddInlineChecklist(vendor)}
                    />
                    <button
                      onClick={() => handleAddInlineChecklist(vendor)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: 14,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <button
                  onClick={() => setRfpVendor(vendor)}
                  className="btn btn-gold btn-sm"
                  style={{ gap: 6 }}
                >
                  <MessageSquare size={13} />
                  <span>Draft AI Inquiry</span>
                </button>

                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => openEditModal(vendor)}
                    className="btn-ghost"
                    style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                    title="Edit Vendor"
                  >
                    <Edit3 size={15} color="#c084fc" />
                  </button>
                  <button
                    onClick={() => deleteVendor(vendor.id)}
                    className="btn-ghost"
                    style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                    title="Delete Vendor"
                  >
                    <Trash2 size={15} color="#f87171" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RFP Modal */}
      {rfpVendor && (
        <VendorRfpModal vendor={rfpVendor} onClose={() => setRfpVendor(null)} />
      )}

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>{editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Vendor / Company Name *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Moonlight Sound & Lighting"
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
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as VendorCategory })}
                  >
                    <option value="venue">Venue</option>
                    <option value="catering">Catering & Bar</option>
                    <option value="photography">Photography & Cinema</option>
                    <option value="entertainment">Entertainment & DJ</option>
                    <option value="decor">Florist & Decor</option>
                    <option value="attire">Attire & Styling</option>
                    <option value="cake">Cake & Sweets</option>
                    <option value="transport">Transport</option>
                    <option value="audio_visual">Audio / Visual</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Status</label>
                  <select
                    className="select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="quoted">Quoted</option>
                    <option value="booked">Booked (Deposit Paid)</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Contact Person</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Amanda Stone"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Phone Number</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="+1 555-0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Email Address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="contact@vendor.example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Quoted Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.quoteAmount}
                    onChange={(e) => setFormData({ ...formData, quoteAmount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Notes / Deliverables</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="Terms, cancellation clause, load-in specifications..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
