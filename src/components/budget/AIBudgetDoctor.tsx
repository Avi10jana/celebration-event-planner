import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { analyzeBudgetWithAI } from '../../services/geminiService';
import type { BudgetOptimizationSuggestion } from '../../services/geminiService';
import { Sparkles, TrendingDown, Check, ArrowRight, Loader2 } from 'lucide-react';

export const AIBudgetDoctor: React.FC = () => {
  const { activeEvent, currencySymbol, addBudgetItem, showToast } = useEvent();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<BudgetOptimizationSuggestion[]>([]);
  const [appliedIndices, setAppliedIndices] = useState<Record<number, boolean>>({});

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const results = await analyzeBudgetWithAI(activeEvent);
      setSuggestions(results);
      showToast('AI Budget Doctor generated 4 tailored savings recommendations!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Unable to complete budget analysis', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = (s: BudgetOptimizationSuggestion, idx: number) => {
    // Add as a savings credit item or adjust budget
    addBudgetItem({
      category: (s.category as any) || 'contingency',
      name: `Savings: ${s.title.slice(0, 40)}`,
      estimatedCost: -Math.abs(s.estimatedSavings),
      actualCost: -Math.abs(s.estimatedSavings),
      paid: -Math.abs(s.estimatedSavings),
      status: 'paid',
      notes: `Applied via AI Budget Doctor: ${s.explanation}`
    });
    setAppliedIndices((prev) => ({ ...prev, [idx]: true }));
    showToast(`Applied savings of ${currencySymbol}${s.estimatedSavings.toLocaleString()} to budget!`, 'success');
  };

  return (
    <div className="glass-panel" style={{ padding: 24, marginBottom: 28, border: '1px solid var(--border-gold)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-warning">AI Budget Doctor</span>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>Gemini Financial Intelligence</span>
          </div>
          <h3 style={{ fontSize: '1.25rem' }}>Automated Cost Optimization & Negotiation Tactics</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Detect budget overruns, compare vendor benchmarks, and unlock high-impact savings without sacrificing guest luxury.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={loading}
          className="btn btn-gold"
          style={{ minWidth: 180 }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Analyzing Budget...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Analyze & Save</span>
            </>
          )}
        </button>
      </div>

      {/* Results grid */}
      {suggestions.length > 0 && (
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {suggestions.map((s, idx) => {
            const isApplied = appliedIndices[idx];
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#e2e8f0' }}>
                      {s.category.toUpperCase()}
                    </span>
                    <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TrendingDown size={14} />
                      Save ~{currencySymbol}{s.estimatedSavings.toLocaleString()}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', marginBottom: 6, color: '#f8fafc' }}>{s.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{s.explanation}</p>
                </div>

                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Difficulty: <strong style={{ color: '#fbbf24' }}>{s.difficulty}</strong>
                  </span>
                  <button
                    onClick={() => handleApplySuggestion(s, idx)}
                    disabled={isApplied}
                    className={`btn btn-sm ${isApplied ? 'btn-ghost' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', gap: 4 }}
                  >
                    {isApplied ? (
                      <>
                        <Check size={13} color="#10b981" />
                        <span style={{ color: '#34d399' }}>Applied</span>
                      </>
                    ) : (
                      <>
                        <span>Apply Credit</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
