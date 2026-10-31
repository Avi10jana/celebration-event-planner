import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { getStoredApiKey, saveApiKey } from '../../services/geminiService';
import { Key, ShieldCheck, ExternalLink, X, Trash2, Check } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, showToast } = useEvent();
  const [apiKey, setApiKey] = useState(getStoredApiKey());

  if (!isApiKeyModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiKey(apiKey);
    showToast(apiKey.trim() ? 'Gemini API key saved securely in browser!' : 'API key cleared. Offline engine active.', 'success');
    setIsApiKeyModalOpen(false);
  };

  const handleClear = () => {
    saveApiKey('');
    setApiKey('');
    showToast('Cleared API key. Switched to high-fidelity built-in engine.', 'info');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsApiKeyModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, borderRadius: 10, background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc' }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Google Gemini AI Settings</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Bring Your Own Key or use Built-in Engine
              </p>
            </div>
          </div>
          <button onClick={() => setIsApiKeyModalOpen(false)} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              padding: 14,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              fontSize: '0.8rem',
              color: '#a7f3d0',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start'
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2, color: '#34d399' }} />
            <div>
              <strong>Client-Side Security Guarantee:</strong> Your Gemini API key is stored exclusively in your local browser storage (<code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: 4 }}>localStorage</code>) and is sent directly to Google's official Gemini endpoint. It never touches external middleware.
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>
              Gemini API Key
            </label>
            <input
              type="password"
              className="input"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Don't have an API key? You can get a free key from{' '}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#8b5cf6', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: 3 }}
            >
              Google AI Studio <ExternalLink size={12} />
            </a>
            , or leave empty to use our built-in high-fidelity intelligent event reasoning engine!
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-danger btn-sm"
                style={{ gap: 4 }}
              >
                <Trash2 size={13} />
                <span>Remove Key</span>
              </button>
            )}

            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ gap: 6 }}>
                <Check size={15} />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
