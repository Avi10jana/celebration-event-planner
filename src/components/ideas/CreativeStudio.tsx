import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { AISpeechCrafter } from './AISpeechCrafter';
import { AIInviteGenerator } from './AIInviteGenerator';
import { 
  Sparkles, 
  Palette, 
  Mic, 
  Mail, 
  Gamepad2, 
  Plus, 
  Trash2, 
  GlassWater, 
  Gift, 
  X 
} from 'lucide-react';

export const CreativeStudio: React.FC = () => {
  const { activeEvent, addIdea, deleteIdea } = useEvent();
  const [subTab, setSubTab] = useState<'themes' | 'speeches' | 'invites'>('themes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Idea Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'theme' as 'theme' | 'activity' | 'cocktail' | 'menu' | 'decor' | 'favor',
    description: '',
    tagsString: 'Bespoke, High-Energy',
    colorPaletteString: '#8b5cf6, #ec4899, #f59e0b, #10b981',
    accentHighlight: 'Golden Violet'
  });

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const tags = formData.tagsString.split(',').map((t) => t.trim()).filter(Boolean);
    const colorPalette = formData.colorPaletteString
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.startsWith('#'));

    addIdea({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      tags: tags.length ? tags : ['Creative'],
      colorPalette: colorPalette.length ? colorPalette : ['#8b5cf6', '#ec4899', '#f59e0b'],
      accentHighlight: formData.accentHighlight
    });

    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'cocktail': return GlassWater;
      case 'favor': return Gift;
      case 'activity': return Gamepad2;
      default: return Palette;
    }
  };

  return (
    <div className="creative-studio-container">
      {/* Subtab navigation */}
      <div className="glass-panel" style={{ padding: 12, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSubTab('themes')}
            className={`btn btn-sm ${subTab === 'themes' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Palette size={15} />
            <span>Themes & Moodboards ({activeEvent.ideas.length})</span>
          </button>
          <button
            onClick={() => setSubTab('speeches')}
            className={`btn btn-sm ${subTab === 'speeches' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Mic size={15} />
            <span>AI Speech & Toast Crafter ({activeEvent.speeches.length})</span>
          </button>
          <button
            onClick={() => setSubTab('invites')}
            className={`btn btn-sm ${subTab === 'invites' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Mail size={15} />
            <span>Invitations & WhatsApp RSVPs ({activeEvent.invitations.length})</span>
          </button>
        </div>

        {subTab === 'themes' && (
          <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary btn-sm">
            <Plus size={14} />
            <span>Pin Custom Idea</span>
          </button>
        )}
      </div>

      {/* Themes & Moodboard View */}
      {subTab === 'themes' && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={20} color="#ec4899" />
              <span>Personalized Themes, Moodboards & Aesthetics</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Curated color palettes, signature cocktail creations, guest dress codes, and bespoke decorative concepts for {activeEvent.title}.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {activeEvent.ideas.map((idea) => {
              const Icon = getCategoryIcon(idea.category);
              return (
                <div key={idea.id} className="glass-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                          <Icon size={12} />
                          {idea.category.toUpperCase()}
                        </span>
                        {idea.accentHighlight && (
                          <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                            {idea.accentHighlight}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="btn-ghost"
                        style={{ padding: 6, borderRadius: 6, border: 'none', cursor: 'pointer' }}
                        title="Delete Idea"
                      >
                        <Trash2 size={15} color="#f87171" />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: 8 }}>{idea.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                      {idea.description}
                    </p>

                    {/* Color Swatch Strip for Moodboards */}
                    {idea.colorPalette && idea.colorPalette.length > 0 && (
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Color Palette Swatches
                        </span>
                        <div className="palette-strip">
                          {idea.colorPalette.map((hex, i) => (
                            <div
                              key={i}
                              className="palette-swatch"
                              style={{ background: hex }}
                              title={`Color: ${hex}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                    {idea.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 8px',
                          borderRadius: 9999,
                          color: '#cbd5e1'
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Speeches View */}
      {subTab === 'speeches' && <AISpeechCrafter />}

      {/* Invites View */}
      {subTab === 'invites' && <AIInviteGenerator />}

      {/* Modal to Pin Custom Idea */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Pin Custom Creative Idea</h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-ghost" style={{ padding: 4, border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIdea} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Idea Title *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Celestial Twilight & Candlelit Canopies"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Category</label>
                  <select
                    className="select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    <option value="theme">Theme & Moodboard</option>
                    <option value="activity">Game & Ritual</option>
                    <option value="cocktail">Signature Drink</option>
                    <option value="decor">Decor & Lighting</option>
                    <option value="favor">Keepsake Favor</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Accent Highlight</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Royal Gold & Indigo"
                    value={formData.accentHighlight}
                    onChange={(e) => setFormData({ ...formData, accentHighlight: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Description & Creative Vision</label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Describe the aesthetic, scents, music, or sensory details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>
                  Hex Color Palette (comma separated)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="#8b5cf6, #ec4899, #f59e0b, #10b981"
                  value={formData.colorPaletteString}
                  onChange={(e) => setFormData({ ...formData, colorPaletteString: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Tags (comma separated)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Bespoke, Romantic, High-Energy"
                  value={formData.tagsString}
                  onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Pin to Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
