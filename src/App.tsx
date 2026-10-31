import React, { useState } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import { Navbar } from './components/layout/Navbar';
import { TabNavigation } from './components/layout/TabNavigation';
import { EventOverview } from './components/overview/EventOverview';
import { BudgetTracker } from './components/budget/BudgetTracker';
import { MasterTimeline } from './components/timeline/MasterTimeline';
import { VendorChecklist } from './components/vendors/VendorChecklist';
import { CreativeStudio } from './components/ideas/CreativeStudio';
import { AIEventConcierge } from './components/concierge/AIEventConcierge';
import { NewEventModal } from './components/modals/NewEventModal';
import { ApiKeyModal } from './components/modals/ApiKeyModal';
import { PrintDossierModal } from './components/modals/PrintDossierModal';
import { ToastContainer } from './components/common/ToastContainer';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { Sparkles } from 'lucide-react';
import './App.css';
import './styles/components.css';

const MainAppContent: React.FC = () => {
  const { activeTab } = useEvent();
  const [isDockOpen, setIsDockOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Animated ambient luxury canvas background */}
      <AnimatedBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-wrapper">
          {/* Navigation Tabs Bar */}
          <div style={{ marginBottom: 24 }}>
            <TabNavigation />
          </div>

          {/* Active Tab Screen */}
          {activeTab === 'overview' && <EventOverview />}
          {activeTab === 'budget' && <BudgetTracker />}
          {activeTab === 'timeline' && <MasterTimeline />}
          {activeTab === 'vendors' && <VendorChecklist />}
          {activeTab === 'ideas' && <CreativeStudio />}
          {activeTab === 'concierge' && <AIEventConcierge />}
        </div>
      </main>

      {/* Floating Concierge Chatbot Dock (accessible from any tab except concierge tab) */}
      {activeTab !== 'concierge' && (
        <div className="concierge-floating-dock no-print">
          {isDockOpen ? (
            <AIEventConcierge isDocked={true} onCloseDock={() => setIsDockOpen(false)} />
          ) : (
            <button
              onClick={() => setIsDockOpen(true)}
              className="concierge-toggle-btn"
              title="Open AI Concierge Copilot"
              aria-label="Open AI Concierge Copilot"
            >
              <Sparkles size={24} />
            </button>
          )}
        </div>
      )}

      {/* Global Modals */}
      <NewEventModal />
      <ApiKeyModal />
      <PrintDossierModal />

      {/* Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <EventProvider>
      <MainAppContent />
    </EventProvider>
  );
}

export default App;
