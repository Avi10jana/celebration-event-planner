import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import type { Vendor } from '../../types/event';
import { generateVendorInquiry } from '../../services/geminiService';
import { copyToClipboard } from '../../services/exportService';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Mail, 
  MessageCircle, 
  Loader2
} from 'lucide-react';

interface VendorRfpModalProps {
  vendor: Vendor;
  onClose: () => void;
}

export const VendorRfpModal: React.FC<VendorRfpModalProps> = ({ vendor, onClose }) => {
  const { activeEvent, showToast } = useEvent();
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ subject?: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateVendorInquiry(
        activeEvent,
        vendor.category,
        vendor.name,
        specialRequests,
        channel
      );
      setGeneratedResult(res);
      showToast('Generated tailored vendor inquiry message!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to generate vendor inquiry', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedResult) return;
    const textToCopy = generatedResult.subject
      ? `Subject: ${generatedResult.subject}\n\n${generatedResult.message}`
      : generatedResult.message;

    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      showToast('Copied inquiry message to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span className="badge badge-warning">GenAI RFP Assistant</span>
              <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>Gemini Copywriter</span>
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>Draft Inquiry for {vendor.name}</h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Channel selector */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { setChannel('whatsapp'); setGeneratedResult(null); }}
              className={`btn ${channel === 'whatsapp' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, gap: 8 }}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Message</span>
            </button>
            <button
              onClick={() => { setChannel('email'); setGeneratedResult(null); }}
              className={`btn ${channel === 'email' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, gap: 8 }}
            >
              <Mail size={16} />
              <span>Formal Email Inquiry</span>
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>
              Custom Priorities / Questions for {vendor.name}
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Ask for vegan menu options, sound limits after 10 PM, or cancellation deposit rules"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', gap: 8 }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Crafting Message with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Tailored {channel === 'whatsapp' ? 'WhatsApp' : 'Email'} Copy</span>
              </>
            )}
          </button>

          {/* Generated Result Card */}
          {generatedResult && (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-md)',
                padding: 18,
                marginTop: 8
              }}
            >
              {generatedResult.subject && (
                <div style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Subject:</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc', marginTop: 2 }}>
                    {generatedResult.subject}
                  </div>
                </div>
              )}

              <div style={{ whiteSpace: 'pre-line', fontSize: '0.875rem', lineHeight: 1.55, color: '#e2e8f0', maxHeight: 250, overflowY: 'auto' }}>
                {generatedResult.message}
              </div>

              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  onClick={handleCopy}
                  className="btn btn-primary btn-sm"
                  style={{ gap: 6 }}
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
