export type EventType = 'wedding' | 'birthday' | 'community' | 'cultural' | 'corporate';

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  label: string;
}

export const CURRENCY_MAP: Record<Currency, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'USD ($)' },
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'CAD ($)' },
  AUD: { code: 'AUD', symbol: 'AU$', label: 'AUD ($)' },
};

export type BudgetCategory = 
  | 'venue' 
  | 'catering' 
  | 'photography' 
  | 'entertainment' 
  | 'decor' 
  | 'attire' 
  | 'stationery' 
  | 'logistics' 
  | 'contingency'
  | 'other';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paid: number;
  status: 'pending' | 'partially-paid' | 'paid';
  vendorName?: string;
  notes?: string;
}

export type TimelinePhase = 
  | '6_months' 
  | '3_months' 
  | '1_month' 
  | '2_weeks' 
  | '1_week' 
  | 'day_before' 
  | 'day_of';

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  phase: TimelinePhase;
  dueDate: string; // YYYY-MM-DD or time for day-of
  category: 'logistics' | 'vendor' | 'guest' | 'creative' | 'legal';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  isDayOf?: boolean;
  timeSlot?: string; // e.g., "10:30 AM" for Day-Of Run of Show
}

export type VendorCategory = 
  | 'venue' 
  | 'catering' 
  | 'photography' 
  | 'entertainment' 
  | 'decor' 
  | 'attire' 
  | 'cake' 
  | 'transport' 
  | 'audio_visual'
  | 'other';

export interface VendorChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactPerson?: string;
  email?: string;
  phone?: string;
  status: 'researching' | 'contacted' | 'quoted' | 'booked' | 'declined';
  quoteAmount: number;
  depositPaid: number;
  rating?: number;
  notes: string;
  checklists: VendorChecklistItem[];
}

export interface PersonalizedIdea {
  id: string;
  category: 'theme' | 'activity' | 'cocktail' | 'menu' | 'decor' | 'favor';
  title: string;
  description: string;
  tags: string[];
  colorPalette?: string[]; // hex codes for moodboard
  accentHighlight?: string;
}

export type SpeechType = 
  | 'best_man' 
  | 'maid_of_honor' 
  | 'parent' 
  | 'host_welcome' 
  | 'toast' 
  | 'keynote' 
  | 'thank_you';

export interface GeneratedSpeech {
  id: string;
  type: SpeechType;
  title: string;
  content: string;
  tone: 'emotional' | 'humorous' | 'formal' | 'poetic';
  estimatedDuration: string;
}

export type InviteChannel = 'whatsapp' | 'formal_card' | 'sms' | 'email';

export interface GeneratedInvite {
  id: string;
  channel: InviteChannel;
  title: string;
  content: string;
  rsvpDeadline: string;
  themeStyle: string;
}

export interface EventModel {
  id: string;
  title: string;
  type: EventType;
  theme: string;
  date: string; // ISO date YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  targetGuests: number;
  currency: Currency;
  totalBudget: number;
  budgetItems: BudgetItem[];
  timeline: TimelineMilestone[];
  vendors: Vendor[];
  ideas: PersonalizedIdea[];
  speeches: GeneratedSpeech[];
  invitations: GeneratedInvite[];
  notes: string;
}

export interface ConciergeMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionablePayload?: {
    type: 'add_expense' | 'add_milestone' | 'add_vendor' | 'add_idea';
    title: string;
    data: any;
  };
}
