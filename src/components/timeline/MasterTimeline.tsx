import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import type { TimelineMilestone, TimelinePhase } from '../../types/event';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  UserCheck, 
  Layers
} from 'lucide-react';

const PHASE_LABELS: Record<TimelinePhase, string> = {
  '6_months': '6+ Months Out',
  '3_months': '3 Months Out',
  '1_month': '1 Month Out',
  '2_weeks': '2 Weeks Out',
  '1_week': 'Final Week Pacing',
  'day_before': 'Day Before Rehearsal',
  'day_of': 'Day-Of Run of Show'
};

export const MasterTimeline: React.FC = () => {
  const { 
    activeEvent, 
    addTimelineItem, 
    updateTimelineItem, 
    toggleTimelineStatus, 
    deleteTimelineItem,
    showToast 
  } = useEvent();

  const [viewMode, setViewMode] = useState<'all' | 'milestones' | 'day_of'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineMilestone | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phase: '1_month' as TimelinePhase,
    dueDate: activeEvent.date,
    category: 'logistics' as 'logistics' | 'vendor' | 'guest' | 'creative' | 'legal',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    assignedTo: '',
    isDayOf: false,
    timeSlot: '12:00 PM'
  });

  const handleToggle = (item: TimelineMilestone) => {
    toggleTimelineStatus(item.id);
    if (item.status !== 'completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast(`Completed milestone: "${item.title}"! 🎉`, 'success');
    }
  };

  const openAddModal = (forDayOf: boolean = false) => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      phase: forDayOf ? 'day_of' : '1_month',
      dueDate: activeEvent.date,
      category: 'logistics',
      status: 'pending',
      assignedTo: '',
      isDayOf: forDayOf,
      timeSlot: forDayOf ? '04:00 PM' : ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: TimelineMilestone) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      phase: item.phase,
      dueDate: item.dueDate,
      category: item.category,
      status: item.status,
      assignedTo: item.assignedTo || '',
      isDayOf: Boolean(item.isDayOf || item.phase === 'day_of'),
      timeSlot: item.timeSlot || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingItem) {
      updateTimelineItem({
        ...editingItem,
        ...formData,
        phase: formData.isDayOf ? 'day_of' : formData.phase
      });
    } else {
      addTimelineItem({
        ...formData,
        phase: formData.isDayOf ? 'day_of' : formData.phase
      });
    }
    setIsModalOpen(false);
  };

  // Filter items
  const filteredTimeline = activeEvent.timeline.filter((item) => {
    const isDayOfItem = item.isDayOf || item.phase === 'day_of';
    if (viewMode === 'day_of' && !isDayOfItem) return false;
    if (viewMode === 'milestones' && isDayOfItem) return false;

    if (statusFilter === 'completed' && item.status !== 'completed') return false;
    if (statusFilter === 'pending' && item.status === 'completed') return false;

    return true;
  });

  // Group by phase
  const phasesOrder: TimelinePhase[] = [
    '6_months',
    '3_months',
    '1_month',
    '2_weeks',
    '1_week',
    'day_before',
    'day_of'
  ];

  const completedCount = activeEvent.timeline.filter((t) => t.status === 'completed').length;
  const dayOfCount = activeEvent.timeline.filter((t) => t.isDayOf || t.phase === 'day_of').length;

  return (
    <div className="timeline-container">
      {/* Control bar */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255, 255, 255, 0.04)', padding: 4, borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setViewMode('all')}
            className={`btn btn-sm ${viewMode === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Layers size={14} />
            <span>Full Roadmap ({activeEvent.timeline.length})</span>
          </button>
          <button
            onClick={() => setViewMode('milestones')}
            className={`btn btn-sm ${viewMode === 'milestones' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Calendar size={14} />
            <span>Planning Milestones ({activeEvent.timeline.length - dayOfCount})</span>
          </button>
          <button
            onClick={() => setViewMode('day_of')}
            className={`btn btn-sm ${viewMode === 'day_of' ? 'btn-gold' : 'btn-ghost'}`}
          >
            <Clock size={14} />
            <span>Day-Of Run of Show ({dayOfCount})</span>
          </button>
        </div>

        {/* Status filter & Add buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <select
            className="select"
            style={{ width: 'auto', padding: '6px 12px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed Only ({completedCount})</option>
          </select>

          <button onClick={() => openAddModal(viewMode === 'day_of')} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>{viewMode === 'day_of' ? 'Add Hour Slot' : 'Add Milestone'}</span>
          </button>
        </div>
      </div>

      {/* Main Timeline Feed */}
      <div className="glass-panel" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              {viewMode === 'day_of' ? <Clock size={20} color="#f59e0b" /> : <Calendar size={20} color="#8b5cf6" />}
              <span>{viewMode === 'day_of' ? 'Day-Of Run of Show / Hourly Execution' : 'Master Event Preparation Roadmap'}</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              {viewMode === 'day_of'
                ? 'Hour-by-hour operational cues from morning load-in to evening grand send-off.'
                : 'Countdown phases ensuring vendor contracts, guest lists, and logistics are executed on schedule.'}
            </p>
          </div>
          <span className="badge badge-success">
            {completedCount} / {activeEvent.timeline.length} Milestones Checked
          </span>
        </div>

        {filteredTimeline.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
            <p>No timeline milestones match your selected filters.</p>
            <button onClick={() => openAddModal(viewMode === 'day_of')} className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>
              <Plus size={14} />
              <span>Create First Milestone</span>
            </button>
          </div>
        ) : (
          phasesOrder.map((phase) => {
            const phaseItems = filteredTimeline.filter((item) => (item.isDayOf || item.phase === 'day_of') ? phase === 'day_of' : item.phase === phase);
            if (phaseItems.length === 0) return null;

            return (
              <div key={phase} style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span
                    className="badge"
                    style={{
                      background: phase === 'day_of' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                      color: phase === 'day_of' ? '#fbbf24' : '#c084fc',
                      borderColor: phase === 'day_of' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(139, 92, 246, 0.4)',
                      padding: '4px 12px',
                      fontSize: '0.8rem'
                    }}
                  >
                    {PHASE_LABELS[phase]}
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
                </div>

                <div className="timeline-track">
                  {phaseItems.map((item) => {
                    const isCompleted = item.status === 'completed';
                    return (
                      <div key={item.id} className="timeline-node">
                        {/* Status Check Circle */}
                        <div
                          className={`timeline-dot ${isCompleted ? 'completed' : ''}`}
                          onClick={() => handleToggle(item)}
                          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
                        >
                          {isCompleted ? <CheckCircle size={14} /> : <Circle size={10} />}
                        </div>

                        {/* Card Content */}
                        <div
                          style={{
                            background: isCompleted ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: 'var(--radius-md)',
                            padding: '14px 18px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 16,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                              {item.timeSlot && (
                                <span className="badge" style={{ background: '#f59e0b25', color: '#fbbf24', borderColor: '#f59e0b40' }}>
                                  <Clock size={11} />
                                  {item.timeSlot}
                                </span>
                              )}
                              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                {item.category}
                              </span>
                              {item.assignedTo && (
                                <span style={{ fontSize: '0.72rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <UserCheck size={11} />
                                  {item.assignedTo}
                                </span>
                              )}
                            </div>

                            <h4
                              style={{
                                fontSize: '1rem',
                                color: isCompleted ? 'var(--text-muted)' : '#f8fafc',
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                marginBottom: 4
                              }}
                            >
                              {item.title}
                            </h4>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {item.description}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button
                              onClick={() => openEditModal(item)}
                              className="btn-ghost"
                              style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                              title="Edit Milestone"
                            >
                              <Edit3 size={14} color="#c084fc" />
                            </button>
                            <button
                              onClick={() => deleteTimelineItem(item.id)}
                              className="btn-ghost"
                              style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                              title="Delete Milestone"
                            >
                              <Trash2 size={14} color="#f87171" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Milestone Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>{editingItem ? 'Edit Timeline Item' : 'Add New Timeline Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Milestone / Activity Title *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. 06:30 PM - Grand Entry & Cake Cutting"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Description / Action Details</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="Provide cues for sound, lighting, family leads, or photography..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)' }}>
                <input
                  type="checkbox"
                  id="isDayOfCheck"
                  checked={formData.isDayOf}
                  onChange={(e) => setFormData({ ...formData, isDayOf: e.target.checked, phase: e.target.checked ? 'day_of' : formData.phase })}
                />
                <label htmlFor="isDayOfCheck" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                  This is a <strong>Day-Of Run of Show item</strong> (hourly celebration cue)
                </label>
              </div>

              {formData.isDayOf ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Time Slot (e.g. "04:30 PM")</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 04:30 PM"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Planning Phase</label>
                    <select
                      className="select"
                      value={formData.phase}
                      onChange={(e) => setFormData({ ...formData, phase: e.target.value as TimelinePhase })}
                    >
                      <option value="6_months">6+ Months Out</option>
                      <option value="3_months">3 Months Out</option>
                      <option value="1_month">1 Month Out</option>
                      <option value="2_weeks">2 Weeks Out</option>
                      <option value="1_week">1 Week Out</option>
                      <option value="day_before">Day Before Rehearsal</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Target Date</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Category</label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    <option value="logistics">Logistics</option>
                    <option value="vendor">Vendor Coordination</option>
                    <option value="guest">Guest Relations</option>
                    <option value="creative">Creative & Decor</option>
                    <option value="legal">Legal & Permits</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Assigned Lead (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Maid of Honor, Host, Venue Manager"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
