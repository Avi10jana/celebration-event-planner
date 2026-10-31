import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import type { Currency, EventType } from '../../types/event';
import { generateEventBlueprint } from '../../services/geminiService';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  X, 
  Loader2, 
  Wand2, 
  FormInput 
} from 'lucide-react';

export const NewEventModal: React.FC = () => {
  const { isNewEventModalOpen, setIsNewEventModalOpen, createEvent, showToast } = useEvent();
  const [tab, setTab] = useState<'ai' | 'manual'>('ai');
  const [loading, setLoading] = useState(false);

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiEventType, setAiEventType] = useState<EventType>('wedding');

  // Manual Form State
  const [manualData, setManualData] = useState({
    title: '',
    type: 'wedding' as EventType,
    theme: 'Champagne & Botanical Elegance',
    date: '2026-11-20',
    time: '17:00',
    location: 'Grand Ballroom & Private Gardens',
    targetGuests: 120,
    currency: 'USD' as Currency,
    totalBudget: 15000,
    notes: ''
  });

  if (!isNewEventModalOpen) return null;

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setLoading(true);
    try {
      const blueprint = await generateEventBlueprint(aiPrompt, aiEventType);
      createEvent({
        ...blueprint,
        type: aiEventType
      });
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      showToast(`AI successfully generated complete celebration blueprint! 🎉`, 'success');
      setIsNewEventModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error generating event blueprint', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualData.title.trim()) return;

    createEvent({
      ...manualData
    });
    setIsNewEventModalOpen(false);
  };

  const sampleAiPrompts = [
    'Destination beach wedding in Bali for 80 guests with sunset dinner and acoustic fire pit',
    'Neon arcade 30th birthday bash in Brooklyn penthouse for 50 friends with molecular cocktails',
    'Multicultural Diwali & Autumn harvest block party for 300 neighbors with food trucks and kids crafts'
  ];

  return (
    <div className="modal-overlay" onClick={() => setIsNewEventModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 660 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Create New Celebration</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Synthesize a luxury event with GenAI or construct manually
            </p>
          </div>
          <button onClick={() => setIsNewEventModalOpen(false)} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', padding: '12px 24px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <button
            type="button"
            onClick={() => setTab('ai')}
            className={`tab-btn ${tab === 'ai' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Wand2 size={16} color="#8b5cf6" />
            <span>✨ AI Magic Blueprint (Recommended)</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('manual')}
            className={`tab-btn ${tab === 'manual' ? 'active' : ''}`}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <FormInput size={16} />
            <span>Manual Form Setup</span>
          </button>
        </div>

        {/* AI Tab */}
        {tab === 'ai' ? (
          <form onSubmit={handleAiGenerate} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: 14, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(236, 72, 153, 0.12))', border: '1px solid var(--border-glow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Sparkles size={16} color="#ec4899" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                  Autonomous GenAI Architecture
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Describe your dream event in simple English. FestivaAI will automatically assemble a customized budget breakdown, phased timeline milestones, vendor checklists, and creative moodboards!
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Celebration Type</label>
              <select
                className="select"
                value={aiEventType}
                onChange={(e) => setAiEventType(e.target.value as EventType)}
              >
                <option value="wedding">Wedding / Engagement / Reception</option>
                <option value="birthday">Milestone Birthday / Sweet 16 / Jubilee</option>
                <option value="community">Community Cultural Festival / Block Party</option>
                <option value="corporate">Gala / Non-Profit / Corporate Celebration</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>
                Describe Your Event Vision, Guest Count & Budget
              </label>
              <textarea
                required
                className="textarea"
                rows={4}
                placeholder="e.g. Dreamy rustic vineyard wedding in Napa Valley for 110 guests with a $28,000 budget, string lights, live jazz quartet, and farm-to-table wine pairings..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
            </div>

            {/* Prompt presets */}
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try an example vision:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                {sampleAiPrompts.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAiPrompt(sample);
                      if (sample.includes('wedding')) setAiEventType('wedding');
                      else if (sample.includes('birthday')) setAiEventType('birthday');
                      else setAiEventType('community');
                    }}
                    className="btn-ghost"
                    style={{
                      textAlign: 'left',
                      fontSize: '0.78rem',
                      padding: '6px 10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 6,
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button type="button" onClick={() => setIsNewEventModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading || !aiPrompt.trim()} className="btn btn-primary" style={{ minWidth: 200, gap: 8 }}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Synthesizing Event...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Event Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Manual Tab */
          <form onSubmit={handleManualCreate} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Event Title *</label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g. Summer Solstice Rooftop Soirée"
                value={manualData.title}
                onChange={(e) => setManualData({ ...manualData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Type</label>
                <select
                  className="select"
                  value={manualData.type}
                  onChange={(e) => setManualData({ ...manualData, type: e.target.value as EventType })}
                >
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="community">Community Event</option>
                  <option value="corporate">Gala / Corporate</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Theme / Vibe</label>
                <input
                  type="text"
                  className="input"
                  value={manualData.theme}
                  onChange={(e) => setManualData({ ...manualData, theme: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Date</label>
                <input
                  type="date"
                  className="input"
                  value={manualData.date}
                  onChange={(e) => setManualData({ ...manualData, date: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Start Time</label>
                <input
                  type="time"
                  className="input"
                  value={manualData.time}
                  onChange={(e) => setManualData({ ...manualData, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Location / Venue</label>
              <input
                type="text"
                className="input"
                placeholder="City, venue name or address"
                value={manualData.location}
                onChange={(e) => setManualData({ ...manualData, location: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Guests</label>
                <input
                  type="number"
                  className="input"
                  value={manualData.targetGuests}
                  onChange={(e) => setManualData({ ...manualData, targetGuests: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Total Budget</label>
                <input
                  type="number"
                  className="input"
                  value={manualData.totalBudget}
                  onChange={(e) => setManualData({ ...manualData, totalBudget: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}>Currency</label>
                <select
                  className="select"
                  value={manualData.currency}
                  onChange={(e) => setManualData({ ...manualData, currency: e.target.value as Currency })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (CA$)</option>
                  <option value="AUD">AUD (AU$)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button type="button" onClick={() => setIsNewEventModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Event
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
