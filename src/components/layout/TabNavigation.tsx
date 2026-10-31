import React from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  LayoutDashboard, 
  Wallet, 
  Clock, 
  CheckSquare, 
  Sparkles, 
  BotMessageSquare 
} from 'lucide-react';

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab, activeEvent } = useEvent();

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'budget',
      label: 'Budget & Expenses',
      icon: Wallet,
      badge: activeEvent.budgetItems.length || null
    },
    {
      id: 'timeline',
      label: 'Timeline & Day-Of',
      icon: Clock,
      badge: activeEvent.timeline.length || null
    },
    {
      id: 'vendors',
      label: 'Vendor Checklists',
      icon: CheckSquare,
      badge: activeEvent.vendors.length || null
    },
    {
      id: 'ideas',
      label: 'Creative Studio',
      icon: Sparkles,
      badge: activeEvent.ideas.length || null
    },
    {
      id: 'concierge',
      label: 'AI Concierge',
      icon: BotMessageSquare,
      badge: 'Copilot',
      isCopilot: true
    }
  ];

  return (
    <nav className="tabs-bar no-print" aria-label="Event sections">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-btn-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn${isActive ? ' active' : ''}`}
            aria-selected={isActive}
            role="tab"
          >
            <Icon size={15} />
            <span>{tab.label}</span>
            {tab.badge !== null && (
              (tab as any).isCopilot ? (
                <span className="tab-badge-copilot">{tab.badge}</span>
              ) : (
                <span className="tab-badge">{tab.badge}</span>
              )
            )}
          </button>
        );
      })}
    </nav>
  );
};
