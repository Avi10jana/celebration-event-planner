import React, { useState, useEffect } from 'react';
import { useEvent } from '../../context/EventContext';
import { ConfettiButton } from '../common/ConfettiButton';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Sparkles, 
  Building2, 
  ArrowRight,
  TrendingUp,
  FileText,
  Mic
} from 'lucide-react';

export const EventOverview: React.FC = () => {
  const { activeEvent, updateEvent, currencySymbol, setActiveTab } = useEvent();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Live countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const target = new Date(`${activeEvent.date}T${activeEvent.time || '18:00'}:00`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeEvent.date, activeEvent.time]);

  // Budget
  const totalBudget   = activeEvent.totalBudget || 1;
  const totalSpent    = activeEvent.budgetItems.reduce(
    (sum, item) => sum + (item.actualCost > 0 ? item.actualCost : item.estimatedCost), 0
  );
  const budgetPercent = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);
  const isOverBudget  = totalSpent > totalBudget;

  // Timeline
  const totalMilestones     = activeEvent.timeline.length;
  const completedMilestones = activeEvent.timeline.filter(m => m.status === 'completed').length;
  const timelinePercent     = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // Vendors
  const totalVendors  = activeEvent.vendors.length;
  const bookedVendors = activeEvent.vendors.filter(v => v.status === 'booked').length;
  const vendorPercent = totalVendors > 0 ? Math.round((bookedVendors / totalVendors) * 100) : 0;

  const [notesText, setNotesText] = useState(activeEvent.notes || '');

  const handleNotesBlur = () => {
    if (notesText !== activeEvent.notes) {
      updateEvent({ ...activeEvent, notes: notesText });
    }
  };

  const getBadgeClass = (type: string) => {
    switch (type) {
      case 'wedding':   return 'badge-wedding';
      case 'birthday':  return 'badge-birthday';
      case 'cultural':  return 'badge-cultural';
      case 'corporate': return 'badge-corporate';
      default:          return 'badge-community';
    }
  };

  const isEventPast = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="overview-container">

      {/* ── Hero Card ── */}
      <div className="glass-panel hero-card">
        <div className="hero-bg-gradient" />
        <div className="hero-content">

          <div className="hero-main">
            {/* Badge row */}
            <div className="hero-badge-row">
              <span className={`badge ${getBadgeClass(activeEvent.type)}`}>
                {activeEvent.type.toUpperCase()}
              </span>
              <span className="hero-theme-text">
                ✨ {activeEvent.theme}
              </span>
            </div>

            <h1>{activeEvent.title}</h1>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <Calendar size={16} color="#fbbf24" />
                <span>
                  {new Date(activeEvent.date).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="hero-meta-item">
                <Clock size={16} color="#f59e0b" />
                <span>{activeEvent.time || '17:00'}</span>
              </div>
              <div className="hero-meta-item">
                <MapPin size={16} color="#d97706" />
                <span>{activeEvent.location}</span>
              </div>
              <div className="hero-meta-item">
                <Users size={16} color="#fef08a" />
                <span>{activeEvent.targetGuests} Guests</span>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="countdown-box">
            <span className="countdown-label">
              {isEventPast ? '🎉 Event Day!' : 'Counting Down'}
            </span>
            <div className="countdown-digits">
              <div className="digit-block">
                <span className="digit-value">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="digit-label">Days</span>
              </div>
              <span className="digit-separator">:</span>
              <div className="digit-block">
                <span className="digit-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="digit-label">Hrs</span>
              </div>
              <span className="digit-separator">:</span>
              <div className="digit-block">
                <span className="digit-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="digit-label">Min</span>
              </div>
              <span className="digit-separator">:</span>
              <div className="digit-block">
                <span className="digit-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="digit-label">Sec</span>
              </div>
            </div>
            <ConfettiButton label="🎊 Celebrate!" variant="gold" />
          </div>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="kpi-grid">

        {/* Budget */}
        <div
          className="glass-panel kpi-card"
          onClick={() => setActiveTab('budget')}
          title="Go to Budget & Expenses"
        >
          <div className="kpi-info">
            <h3>Budget Allocation</h3>
            <div className="kpi-value">
              {currencySymbol}{totalSpent.toLocaleString()}
            </div>
            <div className="kpi-sub">
              of {currencySymbol}{totalBudget.toLocaleString()} •{' '}
              <span style={{ color: isOverBudget ? '#f87171' : '#34d399', fontWeight: 700 }}>
                {budgetPercent}% used
              </span>
            </div>
            <div className="kpi-progress">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${budgetPercent}%`,
                    background: isOverBudget
                      ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                      : 'linear-gradient(90deg, #10b981, #06b6d4)'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16,185,129,0.14)', color: '#34d399' }}>
            <DollarSign size={22} />
          </div>
        </div>

        {/* Milestones */}
        <div
          className="glass-panel kpi-card"
          onClick={() => setActiveTab('timeline')}
          title="Go to Timeline"
        >
          <div className="kpi-info">
            <h3>Milestones Completed</h3>
            <div className="kpi-value">
              {completedMilestones}
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {' '}/ {totalMilestones}
              </span>
            </div>
            <div className="kpi-sub">{timelinePercent}% of master checklist done</div>
            <div className="kpi-progress">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${timelinePercent}%`,
                    background: 'linear-gradient(90deg, #8b5cf6, #ec4899)'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.14)', color: '#c084fc' }}>
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Vendors */}
        <div
          className="glass-panel kpi-card"
          onClick={() => setActiveTab('vendors')}
          title="Go to Vendor Checklists"
        >
          <div className="kpi-info">
            <h3>Confirmed Vendors</h3>
            <div className="kpi-value">
              {bookedVendors}
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {' '}/ {totalVendors}
              </span>
            </div>
            <div className="kpi-sub">
              {totalVendors - bookedVendors > 0
                ? `${totalVendors - bookedVendors} vendor${totalVendors - bookedVendors > 1 ? 's' : ''} in negotiation`
                : 'All vendors confirmed! 🎉'}
            </div>
            <div className="kpi-progress">
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${vendorPercent}%`,
                    background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.14)', color: '#fbbf24' }}>
            <Building2 size={22} />
          </div>
        </div>

        {/* Creative Assets */}
        <div
          className="glass-panel kpi-card"
          onClick={() => setActiveTab('ideas')}
          title="Go to Creative Studio"
        >
          <div className="kpi-info">
            <h3>Creative Studio</h3>
            <div className="kpi-value">
              {activeEvent.ideas.length + activeEvent.speeches.length + activeEvent.invitations.length}
            </div>
            <div className="kpi-sub">
              {activeEvent.ideas.length} ideas · {activeEvent.speeches.length} speeches · {activeEvent.invitations.length} invites
            </div>
            <div className="kpi-progress" style={{ marginTop: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
              {activeEvent.ideas.slice(0, 6).map((idea, i) => (
                <span
                  key={i}
                  style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: idea.colorPalette?.[0] || '#8b5cf6',
                    display: 'inline-block',
                    boxShadow: `0 0 6px ${idea.colorPalette?.[0] || '#8b5cf6'}60`,
                    flexShrink: 0
                  }}
                  title={idea.title}
                />
              ))}
            </div>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(236,72,153,0.14)', color: '#f472b6' }}>
            <Sparkles size={22} />
          </div>
        </div>

      </div>

      {/* ── GenAI Accelerators ── */}
      <div style={{ marginBottom: 26 }}>
        <div className="section-header">
          <div className="section-header-left">
            <Sparkles size={18} color="#8b5cf6" />
            <h2 style={{ fontSize: '1.1rem' }}>GenAI Celebration Accelerators</h2>
          </div>
        </div>

        <div className="accelerator-grid">
          <div
            className="glass-panel accelerator-card"
            onClick={() => setActiveTab('budget')}
          >
            <div className="accelerator-icon" style={{ background: 'rgba(245,158,11,0.14)', color: '#fbbf24' }}>
              <TrendingUp size={20} />
            </div>
            <div className="accelerator-info">
              <h4>AI Budget Doctor</h4>
              <p>Identify overspending &amp; reallocate funds with smart savings recommendations.</p>
            </div>
            <ArrowRight size={16} className="accelerator-arrow" />
          </div>

          <div
            className="glass-panel accelerator-card"
            onClick={() => setActiveTab('timeline')}
          >
            <div className="accelerator-icon" style={{ background: 'rgba(139,92,246,0.14)', color: '#c084fc' }}>
              <Clock size={20} />
            </div>
            <div className="accelerator-info">
              <h4>Day-Of Run of Show</h4>
              <p>Hour-by-hour schedule from vendor load-in to grand exit.</p>
            </div>
            <ArrowRight size={16} className="accelerator-arrow" />
          </div>

          <div
            className="glass-panel accelerator-card"
            onClick={() => setActiveTab('ideas')}
          >
            <div className="accelerator-icon" style={{ background: 'rgba(236,72,153,0.14)', color: '#f472b6' }}>
              <Mic size={20} />
            </div>
            <div className="accelerator-info">
              <h4>Craft Speeches &amp; Invites</h4>
              <p>Generate personalized toasts, WhatsApp RSVPs, and themed invitations.</p>
            </div>
            <ArrowRight size={16} className="accelerator-arrow" />
          </div>
        </div>
      </div>

      {/* ── Event Vision Notes ── */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div className="section-header-left">
            <FileText size={17} color="#8b5cf6" />
            <h3 style={{ fontSize: '1rem' }}>Event Vision &amp; Organizing Notes</h3>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Auto-saves on edit</span>
        </div>
        <textarea
          className="textarea"
          rows={5}
          value={notesText}
          onChange={e => setNotesText(e.target.value)}
          onBlur={handleNotesBlur}
          placeholder="Jot down guest preferences, aesthetic priorities, cultural rituals, special notes for vendors, or anything you don't want to forget…"
          style={{ resize: 'vertical' }}
        />
      </div>

    </div>
  );
};
