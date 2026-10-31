import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { generateInvitationWithAI } from '../../services/geminiService';
import { copyToClipboard } from '../../services/exportService';
import type { GeneratedInvite, InviteChannel } from '../../types/event';
import { 
  Sparkles, 
  MessageCircle, 
  Copy, 
  Check, 
  Trash2, 
  Calendar, 
  Loader2 
} from 'lucide-react';

export const AIInviteGenerator: React.FC = () => {
  const { activeEvent, addInvite, deleteInvite, showToast } = useEvent();
  const [channel, setChannel] = useState<InviteChannel>('whatsapp');
  const [themeStyle, setThemeStyle] = useState('Regal Gold & Emerald');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const invite = await generateInvitationWithAI(activeEvent, channel, themeStyle);
      addInvite(invite);
      showToast(`Generated & saved ${channel} invitation! 💌`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Error generating invite', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (inv: GeneratedInvite) => {
    const ok = await copyToClipboard(inv.content);
    if (ok) {
      setCopiedId(inv.id);
      showToast('Copied invitation copy to clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Creator Panel */}
      <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-success">GenAI Copywriter</span>
          <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>Gemini Invite Engine</span>
        </div>
        <h3 style={{ fontSize: '1.25rem' }}>Personalized Invitations & WhatsApp RSVP Copy</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2, marginBottom: 18 }}>
          Generate engaging invitation text tailored for WhatsApp broadcasts, formal stationery cards, or digital RSVP portals.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Channel / Format</label>
            <select
              className="select"
              value={channel}
              onChange={(e) => setChannel(e.target.value as InviteChannel)}
            >
              <option value="whatsapp">WhatsApp Message (Rich with Emojis & Bold)</option>
              <option value="formal_card">Formal Stationery Card (Elegant Typography)</option>
              <option value="sms">SMS Quick Teaser (Brevity & Link)</option>
              <option value="email">Digital Email Invitation</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Theme & Vibe</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Royal Marigold, Cyberpunk Neon, Rustic Autumn"
              value={themeStyle}
              onChange={(e) => setThemeStyle(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', gap: 8 }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Generating Copy with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Generate Invitation Copy with Gemini</span>
            </>
          )}
        </button>
      </div>

      {/* Invitations Feed */}
      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageCircle size={18} color="#10b981" />
          <span>Invitation Templates ({activeEvent.invitations.length} Created)</span>
        </h4>

        {activeEvent.invitations.length === 0 ? (
          <div className="glass-panel" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
            No invitation copies generated yet. Pick a channel above and click "Generate Invitation Copy"!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {activeEvent.invitations.map((inv) => (
              <div key={inv.id} className="glass-panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                    <div>
                      <span className="badge badge-success">{inv.channel.toUpperCase()}</span>
                      <h4 style={{ fontSize: '1.05rem', marginTop: 4, color: '#f8fafc' }}>{inv.title}</h4>
                    </div>

                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleCopy(inv)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px', gap: 4 }}
                      >
                        {copiedId === inv.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        <span style={{ fontSize: '0.75rem' }}>{copiedId === inv.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => deleteInvite(inv.id)}
                        className="btn-ghost"
                        style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                        title="Delete Invite"
                      >
                        <Trash2 size={15} color="#f87171" />
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 'var(--radius-sm)',
                      padding: 14,
                      whiteSpace: 'pre-line',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      color: '#e2e8f0',
                      maxHeight: 220,
                      overflowY: 'auto'
                    }}
                  >
                    {inv.content}
                  </div>
                </div>

                <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Calendar size={13} />
                  <span>RSVP Target: <strong>{inv.rsvpDeadline || '2 weeks before'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
