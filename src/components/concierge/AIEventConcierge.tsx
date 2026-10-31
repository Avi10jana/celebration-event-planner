import React, { useState, useRef, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { askConcierge } from '../../services/geminiService';
import type { ConciergeMessage } from '../../types/event';
import { 
  Sparkles, 
  Send, 
  User, 
  Check, 
  PlusCircle, 
  Loader2, 
  X
} from 'lucide-react';

interface AIEventConciergeProps {
  isDocked?: boolean;
  onCloseDock?: () => void;
}

export const AIEventConcierge: React.FC<AIEventConciergeProps> = ({
  isDocked = false,
  onCloseDock
}) => {
  const { 
    activeEvent, 
    addBudgetItem, 
    addTimelineItem, 
    addIdea, 
    showToast 
  } = useEvent();

  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: 'm-init',
      sender: 'assistant',
      text: `Hello! I am **FestivaAI**, your personal event concierge. I am fully synced with **${activeEvent.title}** (${activeEvent.type.toUpperCase()}).

I can help optimize your budget, build minute-by-minute schedules, draft vendor RFPs, or brainstorm unforgettable experiences. How can I assist you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedPayloadIds, setAppliedPayloadIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    `How can I trim 15% from ${activeEvent.type} catering?`,
    'Build an hourly timeline for the celebration day',
    'Suggest 3 high-engagement icebreaker activities',
    'Write a vendor negotiation message for floral decor'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: ConciergeMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.sender,
        text: m.text
      }));

      const res = await askConcierge(q, activeEvent, historyForApi);

      const aiMsg: ConciergeMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionablePayload: res.actionablePayload
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      showToast('Concierge query failed', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPayload = (msgId: string, payload: any) => {
    if (!payload) return;

    if (payload.type === 'add_expense') {
      addBudgetItem(payload.data);
      showToast(`Added "${payload.data.name}" to budget items!`, 'success');
    } else if (payload.type === 'add_milestone') {
      addTimelineItem(payload.data);
      showToast(`Added "${payload.data.title}" to master timeline!`, 'success');
    } else if (payload.type === 'add_idea') {
      addIdea(payload.data);
      showToast(`Pinned "${payload.data.title}" to Creative Studio!`, 'success');
    }

    setAppliedPayloadIds((prev) => ({ ...prev, [msgId]: true }));
  };

  const containerStyle: React.CSSProperties = isDocked
    ? {}
    : {
        maxWidth: 960,
        margin: '0 auto',
        height: '75vh',
        display: 'flex',
        flexDirection: 'column'
      };

  return (
    <div className={`concierge-component ${isDocked ? 'concierge-chat-window' : 'glass-panel'}`} style={containerStyle}>
      {/* Header */}
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="brand-logo-icon" style={{ width: 34, height: 34, borderRadius: 10 }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>FestivaAI Concierge</h3>
              <span className="badge badge-success" style={{ padding: '2px 6px', fontSize: '0.65rem' }}>Active</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
              Synced with {activeEvent.title}
            </p>
          </div>
        </div>

        {isDocked && onCloseDock && (
          <button onClick={onCloseDock} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="chat-messages">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: 4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0 4px' }}>
                {isUser ? <User size={11} /> : <Sparkles size={11} color="#8b5cf6" />}
                <span>{isUser ? 'You' : 'FestivaAI Concierge'} &bull; {m.timestamp}</span>
              </div>

              <div className={`chat-bubble ${m.sender}`}>
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                {/* Actionable Commit Button */}
                {m.actionablePayload && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '10px 12px',
                      background: 'rgba(0, 0, 0, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
                      ⚡ {m.actionablePayload.title}
                    </span>

                    <button
                      onClick={() => handleApplyPayload(m.id, m.actionablePayload)}
                      disabled={appliedPayloadIds[m.id]}
                      className={`btn btn-sm ${appliedPayloadIds[m.id] ? 'btn-ghost' : 'btn-gold'}`}
                      style={{ fontSize: '0.72rem', padding: '4px 10px', gap: 4 }}
                    >
                      {appliedPayloadIds[m.id] ? (
                        <>
                          <Check size={12} color="#10b981" />
                          <span style={{ color: '#34d399' }}>Applied</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle size={12} />
                          <span>Apply to Event</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', padding: '8px 12px' }}>
            <Loader2 size={16} className="animate-spin" color="#8b5cf6" />
            <span style={{ fontSize: '0.825rem' }}>FestivaAI is orchestrating a solution...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips */}
      <div style={{ padding: '8px 16px', display: 'flex', gap: 6, overflowX: 'auto', background: 'rgba(255, 255, 255, 0.02)' }}>
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            className="btn btn-ghost btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '4px 10px',
              borderRadius: 9999,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              whiteSpace: 'nowrap'
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="chat-input-bar"
      >
        <input
          type="text"
          className="input"
          placeholder="Ask for budget tips, timeline ideas, vendor negotiations..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="btn btn-primary"
          style={{ padding: '10px 14px' }}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
