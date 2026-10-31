import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { generateSpeechWithAI } from '../../services/geminiService';
import { copyToClipboard } from '../../services/exportService';
import type { GeneratedSpeech, SpeechType } from '../../types/event';
import { 
  Sparkles, 
  Mic, 
  Copy, 
  Check, 
  Clock, 
  Trash2, 
  Loader2 
} from 'lucide-react';

export const AISpeechCrafter: React.FC = () => {
  const { activeEvent, addSpeech, deleteSpeech, showToast } = useEvent();
  const [speechType, setSpeechType] = useState<SpeechType>('best_man');
  const [speakerName, setSpeakerName] = useState('');
  const [honoreeName, setHonoreeName] = useState('');
  const [tone, setTone] = useState<'emotional' | 'humorous' | 'formal' | 'poetic'>('humorous');
  const [memories, setMemories] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const speech = await generateSpeechWithAI(
        activeEvent,
        speechType,
        speakerName,
        honoreeName,
        tone,
        memories
      );
      addSpeech(speech);
      showToast(`Generated & saved: "${speech.title}"! 🥂`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Error generating speech', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (speech: GeneratedSpeech) => {
    const text = `${speech.title.toUpperCase()}\n(${speech.tone.toUpperCase()} TONE - Est: ${speech.estimatedDuration})\n\n${speech.content}`;
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(speech.id);
      showToast('Copied speech to clipboard!', 'success');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Speech Generator Control Panel */}
      <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-birthday">GenAI Speech Studio</span>
          <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600 }}>Gemini Toast Architect</span>
        </div>
        <h3 style={{ fontSize: '1.25rem' }}>Personalized Toasts, Speeches & Welcome Addresses</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2, marginBottom: 18 }}>
          Craft memorable, emotionally rich or delightfully witty speeches tailored for your VIP speakers and milestone moments.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Speech Type</label>
            <select
              className="select"
              value={speechType}
              onChange={(e) => setSpeechType(e.target.value as SpeechType)}
            >
              <option value="best_man">Best Man Toast</option>
              <option value="maid_of_honor">Maid of Honor Speech</option>
              <option value="parent">Parent of Bride/Groom/Birthday Star</option>
              <option value="host_welcome">Host Welcome Address</option>
              <option value="toast">Short & Sweet Celebratory Toast</option>
              <option value="keynote">Community Keynote Address</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Tone & Energy</label>
            <select
              className="select"
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
            >
              <option value="humorous">Humorous & Witty (Playful Roasts)</option>
              <option value="emotional">Emotional & Tearjerker</option>
              <option value="formal">Regal, Warm & Formal</option>
              <option value="poetic">Poetic & Lyrical</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Speaker Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Liam (Best Man)"
              value={speakerName}
              onChange={(e) => setSpeakerName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Honoree(s) Name</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Leo / The Newlyweds"
              value={honoreeName}
              onChange={(e) => setHonoreeName(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            Anecdotes, Inside Jokes, or Memories to Weave In
          </label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Remember road trip to Vegas, always burning pancakes, how they never gave up on each other..."
            value={memories}
            onChange={(e) => setMemories(e.target.value)}
          />
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
              <span>Writing Speech with Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Craft Personalized Speech with Gemini</span>
            </>
          )}
        </button>
      </div>

      {/* Saved Speeches Feed */}
      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Mic size={18} color="#ec4899" />
          <span>Speech Dossier ({activeEvent.speeches.length} Written)</span>
        </h4>

        {activeEvent.speeches.length === 0 ? (
          <div className="glass-panel" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
            No speeches generated yet. Fill the prompt panel above and click "Craft Personalized Speech"!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeEvent.speeches.map((sp) => (
              <div key={sp.id} className="glass-panel" style={{ padding: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="badge badge-birthday">{sp.type.toUpperCase()}</span>
                      <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#f8fafc' }}>
                        {sp.tone} tone
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {sp.estimatedDuration}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>{sp.title}</h3>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleCopy(sp)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: 6 }}
                    >
                      {copiedId === sp.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      <span>{copiedId === sp.id ? 'Copied' : 'Copy Text'}</span>
                    </button>
                    <button
                      onClick={() => deleteSpeech(sp.id)}
                      className="btn-ghost"
                      style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                      title="Delete Speech"
                    >
                      <Trash2 size={16} color="#f87171" />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 20px',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.6,
                    fontSize: '0.9rem',
                    color: '#e2e8f0'
                  }}
                >
                  {sp.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
