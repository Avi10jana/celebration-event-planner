import React from 'react';
import { useEvent } from '../../context/EventContext';
import { CURRENCY_MAP } from '../../types/event';
import type { Currency } from '../../types/event';
import { getStoredApiKey } from '../../services/geminiService';
import { exportEventToJson } from '../../services/exportService';
import { 
  Sparkles, 
  Calendar, 
  PlusCircle, 
  Printer, 
  Download, 
  RotateCcw, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    events,
    activeEvent,
    activeEventId,
    setActiveEventId,
    setCurrency,
    setIsNewEventModalOpen,
    setIsApiKeyModalOpen,
    setIsPrintModalOpen,
    resetToDefaults,
    showToast,
    setActiveTab
  } = useEvent();

  const apiKey = getStoredApiKey();
  const hasApiKey = Boolean(apiKey && apiKey.trim().length > 5);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'NEW_EVENT') {
      setIsNewEventModalOpen(true);
    } else {
      setActiveEventId(val);
    }
  };

  const handleExportJson = () => {
    exportEventToJson(activeEvent);
    showToast('Exported Master Event Dossier as JSON', 'success');
  };

  return (
    <header className="app-header no-print">
      <div className="nav-container">

        {/* ── Brand ── */}
        <div
          className="brand-section"
          onClick={() => setActiveTab('overview')}
          style={{ cursor: 'pointer' }}
          title="Return to FestivaAI Home"
        >
          <div className="brand-logo-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
              <span className="brand-title">
                Festiva<span className="text-gradient">AI</span>
              </span>
              <span className="brand-badge">Luxury</span>
            </div>
            <p className="brand-subtitle">Autonomous Event Suite</p>
          </div>
        </div>

        {/* ── Center: Event Selector + Currency ── */}
        <div className="nav-center">
          <div className="event-switcher-wrapper">
            <Calendar size={15} color="#fbbf24" />
            <select
              className="event-select"
              value={activeEventId}
              onChange={handleEventChange}
              aria-label="Select celebration event"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.type.toUpperCase()})
                </option>
              ))}
              <option value="NEW_EVENT">+ Create / AI Generate New Event…</option>
            </select>
            <button
              onClick={() => setIsNewEventModalOpen(true)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '3px 6px', color: '#fbbf24' }}
              title="Add or AI-Generate New Event"
            >
              <PlusCircle size={14} />
            </button>
          </div>

          {/* Currency */}
          <select
            className="currency-select"
            value={activeEvent.currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            aria-label="Select currency"
          >
            {Object.entries(CURRENCY_MAP).map(([code, cfg]) => (
              <option key={code} value={code}>{cfg.label}</option>
            ))}
          </select>
        </div>

        {/* ── Right: Actions ── */}
        <div className="nav-actions">

          {/* API Key / Gemini status */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`api-status-pill ${hasApiKey ? 'connected' : 'offline'}`}
            title="Configure Google Gemini API Key"
          >
            {hasApiKey ? (
              <>
                <span className="status-dot green" />
                <ShieldCheck size={13} />
                <span className="btn-text-desktop">Gemini Connected</span>
              </>
            ) : (
              <>
                <span className="status-dot amber" />
                <Zap size={13} />
                <span className="btn-text-desktop">Offline AI Ready</span>
              </>
            )}
          </button>

          <div className="nav-divider" />

          {/* Print Dossier */}
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Print or Save PDF Event Dossier"
          >
            <Printer size={14} />
            <span className="btn-text-desktop">Print Dossier</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="btn btn-secondary btn-sm btn-icon"
            title="Export Event JSON"
          >
            <Download size={14} />
          </button>

          {/* Reset */}
          <button
            onClick={resetToDefaults}
            className="btn btn-ghost btn-sm btn-icon"
            title="Reset to default showcase blueprints"
          >
            <RotateCcw size={14} />
          </button>
        </div>

      </div>
    </header>
  );
};
