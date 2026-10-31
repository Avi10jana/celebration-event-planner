import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  EventModel, 
  BudgetItem, 
  TimelineMilestone, 
  Vendor, 
  PersonalizedIdea, 
  GeneratedSpeech, 
  GeneratedInvite, 
  Currency
} from '../types/event';
import { CURRENCY_MAP } from '../types/event';
import { STARTER_EVENTS } from '../data/starterEvents';

const STORAGE_KEY = 'festiva_events_v1';
const ACTIVE_EVENT_KEY = 'festiva_active_event_id';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface EventContextType {
  events: EventModel[];
  activeEvent: EventModel;
  activeEventId: string;
  setActiveEventId: (id: string) => void;
  currencySymbol: string;
  setCurrency: (c: Currency) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Event Actions
  createEvent: (data: Partial<EventModel>) => EventModel;
  updateEvent: (updated: EventModel) => void;
  deleteEvent: (id: string) => void;
  resetToDefaults: () => void;
  
  // Budget Actions
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (item: BudgetItem) => void;
  deleteBudgetItem: (id: string) => void;
  
  // Timeline Actions
  addTimelineItem: (item: Omit<TimelineMilestone, 'id'>) => void;
  updateTimelineItem: (item: TimelineMilestone) => void;
  toggleTimelineStatus: (id: string) => void;
  deleteTimelineItem: (id: string) => void;

  // Vendor Actions
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (vendor: Vendor) => void;
  deleteVendor: (id: string) => void;
  toggleVendorChecklist: (vendorId: string, checklistId: string) => void;

  // Creative Studio Actions
  addIdea: (idea: Omit<PersonalizedIdea, 'id'>) => void;
  deleteIdea: (id: string) => void;
  addSpeech: (speech: GeneratedSpeech) => void;
  deleteSpeech: (id: string) => void;
  addInvite: (invite: GeneratedInvite) => void;
  deleteInvite: (id: string) => void;

  // Modals
  isNewEventModalOpen: boolean;
  setIsNewEventModalOpen: (open: boolean) => void;
  isApiKeyModalOpen: boolean;
  setIsApiKeyModalOpen: (open: boolean) => void;
  isPrintModalOpen: boolean;
  setIsPrintModalOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventModel[]>(() => {
    if (typeof window === 'undefined') return STARTER_EVENTS;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed to parse local stored events, using defaults', e);
      }
    }
    return STARTER_EVENTS;
  });

  const [activeEventId, setActiveEventIdState] = useState<string>(() => {
    if (typeof window === 'undefined') return STARTER_EVENTS[0].id;
    const stored = localStorage.getItem(ACTIVE_EVENT_KEY);
    return stored || STARTER_EVENTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync events to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [events]);

  const setActiveEventId = (id: string) => {
    setActiveEventIdState(id);
    localStorage.setItem(ACTIVE_EVENT_KEY, id);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeEvent: EventModel = events.find((e) => e.id === activeEventId) || events[0] || STARTER_EVENTS[0];
  const currencySymbol = CURRENCY_MAP[activeEvent.currency]?.symbol || '$';

  const updateActiveEventDirectly = (modifier: (current: EventModel) => EventModel) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === activeEvent.id ? modifier(evt) : evt))
    );
  };

  const setCurrency = (c: Currency) => {
    updateActiveEventDirectly((current) => ({ ...current, currency: c }));
    showToast(`Currency changed to ${CURRENCY_MAP[c]?.label || c}`, 'info');
  };

  const createEvent = (data: Partial<EventModel>): EventModel => {
    const newId = `evt-${Date.now()}`;
    const newEvent: EventModel = {
      id: newId,
      title: data.title || 'Untitled Celebration',
      type: data.type || 'wedding',
      theme: data.theme || 'Timeless Elegance',
      date: data.date || '2026-12-31',
      time: data.time || '17:00',
      location: data.location || 'Private Venue',
      targetGuests: data.targetGuests || 100,
      currency: data.currency || 'USD',
      totalBudget: data.totalBudget || 10000,
      budgetItems: data.budgetItems || [],
      timeline: data.timeline || [],
      vendors: data.vendors || [],
      ideas: data.ideas || [],
      speeches: data.speeches || [],
      invitations: data.invitations || [],
      notes: data.notes || ''
    };

    setEvents((prev) => [newEvent, ...prev]);
    setActiveEventId(newId);
    showToast(`Created new celebration: "${newEvent.title}"! 🎉`, 'success');
    return newEvent;
  };

  const updateEvent = (updated: EventModel) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    showToast('Event settings saved', 'success');
  };

  const deleteEvent = (id: string) => {
    if (events.length <= 1) {
      showToast('Cannot delete the last remaining event.', 'warning');
      return;
    }
    const filtered = events.filter((e) => e.id !== id);
    setEvents(filtered);
    if (activeEventId === id) {
      setActiveEventId(filtered[0].id);
    }
    showToast('Event deleted', 'info');
  };

  const resetToDefaults = () => {
    setEvents(STARTER_EVENTS);
    setActiveEventId(STARTER_EVENTS[0].id);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_EVENT_KEY);
    showToast('Reset all events to default showcase blueprints', 'info');
  };

  // Budget
  const addBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = { ...item, id: `b-${Date.now()}` };
    updateActiveEventDirectly((evt) => ({
      ...evt,
      budgetItems: [...evt.budgetItems, newItem]
    }));
    showToast(`Added expense: "${newItem.name}"`, 'success');
  };

  const updateBudgetItem = (item: BudgetItem) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      budgetItems: evt.budgetItems.map((b) => (b.id === item.id ? item : b))
    }));
    showToast(`Updated expense "${item.name}"`, 'success');
  };

  const deleteBudgetItem = (id: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      budgetItems: evt.budgetItems.filter((b) => b.id !== id)
    }));
    showToast('Budget item removed', 'info');
  };

  // Timeline
  const addTimelineItem = (item: Omit<TimelineMilestone, 'id'>) => {
    const newItem: TimelineMilestone = { ...item, id: `tm-${Date.now()}` };
    updateActiveEventDirectly((evt) => ({
      ...evt,
      timeline: [...evt.timeline, newItem]
    }));
    showToast(`Added milestone: "${newItem.title}"`, 'success');
  };

  const updateTimelineItem = (item: TimelineMilestone) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      timeline: evt.timeline.map((t) => (t.id === item.id ? item : t))
    }));
    showToast(`Milestone updated`, 'success');
  };

  const toggleTimelineStatus = (id: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      timeline: evt.timeline.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    }));
  };

  const deleteTimelineItem = (id: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      timeline: evt.timeline.filter((t) => t.id !== id)
    }));
    showToast('Milestone removed', 'info');
  };

  // Vendors
  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = { ...vendor, id: `v-${Date.now()}` };
    updateActiveEventDirectly((evt) => ({
      ...evt,
      vendors: [...evt.vendors, newVendor]
    }));
    showToast(`Added vendor: "${newVendor.name}"`, 'success');
  };

  const updateVendor = (vendor: Vendor) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      vendors: evt.vendors.map((v) => (v.id === vendor.id ? vendor : v))
    }));
    showToast(`Updated vendor: "${vendor.name}"`, 'success');
  };

  const deleteVendor = (id: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      vendors: evt.vendors.filter((v) => v.id !== id)
    }));
    showToast('Vendor removed', 'info');
  };

  const toggleVendorChecklist = (vendorId: string, checklistId: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      vendors: evt.vendors.map((v) => {
        if (v.id === vendorId) {
          return {
            ...v,
            checklists: v.checklists.map((c) =>
              c.id === checklistId ? { ...c, done: !c.done } : c
            )
          };
        }
        return v;
      })
    }));
  };

  // Creative Studio
  const addIdea = (idea: Omit<PersonalizedIdea, 'id'>) => {
    const newIdea: PersonalizedIdea = { ...idea, id: `id-${Date.now()}` };
    updateActiveEventDirectly((evt) => ({
      ...evt,
      ideas: [newIdea, ...evt.ideas]
    }));
    showToast(`Pinned new idea: "${newIdea.title}"`, 'success');
  };

  const deleteIdea = (id: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      ideas: evt.ideas.filter((i) => i.id !== id)
    }));
    showToast('Idea card removed', 'info');
  };

  const addSpeech = (speech: GeneratedSpeech) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      speeches: [speech, ...evt.speeches]
    }));
    showToast(`Saved speech: "${speech.title}"`, 'success');
  };

  const deleteSpeech = (id: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      speeches: evt.speeches.filter((s) => s.id !== id)
    }));
    showToast('Speech deleted', 'info');
  };

  const addInvite = (invite: GeneratedInvite) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      invitations: [invite, ...evt.invitations]
    }));
    showToast(`Saved invitation template: "${invite.title}"`, 'success');
  };

  const deleteInvite = (id: string) => {
    updateActiveEventDirectly((evt) => ({
      ...evt,
      invitations: evt.invitations.filter((i) => i.id !== id)
    }));
    showToast('Invite removed', 'info');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        activeEvent,
        activeEventId,
        setActiveEventId,
        currencySymbol,
        setCurrency,
        activeTab,
        setActiveTab,
        createEvent,
        updateEvent,
        deleteEvent,
        resetToDefaults,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        addTimelineItem,
        updateTimelineItem,
        toggleTimelineStatus,
        deleteTimelineItem,
        addVendor,
        updateVendor,
        deleteVendor,
        toggleVendorChecklist,
        addIdea,
        deleteIdea,
        addSpeech,
        deleteSpeech,
        addInvite,
        deleteInvite,
        isNewEventModalOpen,
        setIsNewEventModalOpen,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
        isPrintModalOpen,
        setIsPrintModalOpen,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
