import React from 'react';
import { useEvent } from '../../context/EventContext';
import { printEventDossier } from '../../services/exportService';
import { Printer, X, Calendar, MapPin, Users, Clock } from 'lucide-react';

export const PrintDossierModal: React.FC = () => {
  const { isPrintModalOpen, setIsPrintModalOpen, activeEvent, currencySymbol } = useEvent();

  if (!isPrintModalOpen) return null;

  const totalSpent = activeEvent.budgetItems.reduce(
    (sum, item) => sum + (item.actualCost > 0 ? item.actualCost : item.estimatedCost),
    0
  );

  const dayOfMilestones = activeEvent.timeline.filter((m) => m.isDayOf || m.phase === 'day_of');

  return (
    <div className="modal-overlay" onClick={() => setIsPrintModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 850, maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Controls Bar */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: '#0f172a',
            zIndex: 10
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Master Event Dossier Preview</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Print-ready formatted document for coordinators, families & vendors
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={printEventDossier}
              className="btn btn-gold btn-sm"
              style={{ gap: 6 }}
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="btn-ghost"
              style={{ padding: 4, border: 'none', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div style={{ padding: 32, color: '#f8fafc', background: '#0a0e17' }}>
          {/* Header */}
          <div style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.15)', paddingBottom: 20, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="badge badge-warning" style={{ marginBottom: 6 }}>
                  {activeEvent.type.toUpperCase()} DOSSIER
                </span>
                <h1 style={{ fontSize: '2rem', marginBottom: 6 }}>{activeEvent.title}</h1>
                <p style={{ fontSize: '1rem', color: '#fbbf24', fontWeight: 600 }}>
                  Theme: {activeEvent.theme}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Budget</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                  {currencySymbol}{activeEvent.totalBudget.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Committed: {currencySymbol}{totalSpent.toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={15} color="#8b5cf6" />
                <span>Date: <strong>{activeEvent.date}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={15} color="#ec4899" />
                <span>Start Time: <strong>{activeEvent.time || '17:00'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={15} color="#f59e0b" />
                <span>Location: <strong>{activeEvent.location}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Users size={15} color="#10b981" />
                <span>Guests: <strong>{activeEvent.targetGuests}</strong></span>
              </div>
            </div>
          </div>

          {/* Section 1: Day-Of Run of Show */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 6 }}>
              Day-Of Run of Show (Hourly Schedule)
            </h3>
            {dayOfMilestones.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No hourly milestones scheduled yet.</p>
            ) : (
              <table className="custom-table" style={{ fontSize: '0.825rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>Time</th>
                    <th>Activity / Cue</th>
                    <th>Category</th>
                    <th>Assigned Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {dayOfMilestones.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: '#fbbf24' }}>{item.timeSlot || item.dueDate}</td>
                      <td>
                        <strong>{item.title}</strong>
                        {item.description && <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{item.description}</div>}
                      </td>
                      <td>{item.category}</td>
                      <td>{item.assignedTo || 'Lead Coordinator'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section 2: Key Vendor Directory */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 12, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 6 }}>
              Confirmed Vendor Directory & Contacts
            </h3>
            <table className="custom-table" style={{ fontSize: '0.825rem' }}>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Contact Person</th>
                  <th>Phone / Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeEvent.vendors.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600 }}>{v.name}</td>
                    <td>{v.category.toUpperCase()}</td>
                    <td>{v.contactPerson || '—'}</td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {v.phone && <div>📞 {v.phone}</div>}
                      {v.email && <div>✉️ {v.email}</div>}
                    </td>
                    <td>
                      <span className="badge badge-success">{v.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Strategic Notes & Instructions */}
          {activeEvent.notes && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 8, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 6 }}>
                Coordinator Notes & Vision
              </h3>
              <p style={{ whiteSpace: 'pre-line', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {activeEvent.notes}
              </p>
            </div>
          )}

          <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Generated with FestivaAI &bull; Google Gemini Autonomous Event Planning Engine
          </div>
        </div>
      </div>
    </div>
  );
};
