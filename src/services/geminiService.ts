import type { EventModel, EventType, GeneratedInvite, GeneratedSpeech } from '../types/event';

// Storage key for user Gemini API key
const GEMINI_API_KEY_STORAGE = 'festiva_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
}

export function saveApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(GEMINI_API_KEY_STORAGE);
  } else {
    localStorage.setItem(GEMINI_API_KEY_STORAGE, key.trim());
  }
}

/**
 * Robust caller to Google Gemini API (gemini-2.5-flash or gemini-1.5-flash)
 */
export async function callGeminiRaw(prompt: string, systemInstruction?: string): Promise<string> {
  const apiKey = getStoredApiKey();

  // If user provided their Gemini API key, make live network call
  if (apiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      
      const payload: any = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API error (Status ${response.status})`);
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        return candidateText;
      }
    } catch (err: any) {
      console.warn('Gemini live call error, falling back to built-in intelligent engine:', err);
      // Fall through to offline reasoning engine if API call fails
    }
  }

  // Simulated AI delay to mimic natural generation experience
  await new Promise((resolve) => setTimeout(resolve, 600));
  return '';
}

/**
 * Helper to safely extract JSON from an LLM response even if wrapped in markdown codeblocks
 */
export function extractJsonFromText<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    // Try regex to find outermost JSON object or array
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}

/**
 * 1. AI Event Blueprint Generator: Generates an entire structured event from natural language prompt
 */
export async function generateEventBlueprint(userPrompt: string, eventType: EventType): Promise<Partial<EventModel>> {
  const systemPrompt = `You are FestivaAI, an elite event planner and celebration architect.
Generate a comprehensive, luxury-grade event blueprint based on the user's requirements.
Output strictly valid JSON matching this schema:
{
  "title": string,
  "theme": string,
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": string,
  "targetGuests": number,
  "currency": "USD" | "INR" | "EUR" | "GBP",
  "totalBudget": number,
  "notes": string,
  "budgetItems": [
    { "id": string, "category": string, "name": string, "estimatedCost": number, "actualCost": number, "paid": number, "status": "pending"|"partially-paid"|"paid", "notes": string }
  ],
  "timeline": [
    { "id": string, "title": string, "description": string, "phase": "6_months"|"3_months"|"1_month"|"2_weeks"|"1_week"|"day_before"|"day_of", "dueDate": "YYYY-MM-DD", "category": string, "status": "pending", "isDayOf": boolean, "timeSlot": string }
  ],
  "vendors": [
    { "id": string, "name": string, "category": string, "contactPerson": string, "email": string, "phone": string, "status": "researching", "quoteAmount": number, "depositPaid": number, "rating": number, "notes": string, "checklists": [{"id": string, "text": string, "done": false}] }
  ],
  "ideas": [
    { "id": string, "category": "theme"|"activity"|"cocktail"|"decor"|"favor", "title": string, "description": string, "tags": string[], "colorPalette": string[], "accentHighlight": string }
  ]
}`;

  const raw = await callGeminiRaw(`Event Type: ${eventType}\nUser Requirements: ${userPrompt}`, systemPrompt);
  if (raw) {
    const parsed = extractJsonFromText<Partial<EventModel> | null>(raw, null);
    if (parsed && parsed.title && parsed.budgetItems) {
      return parsed;
    }
  }

  // Built-in Intelligent Fallback Generator
  const cleanPrompt = userPrompt.toLowerCase();
  const isBudgetLow = cleanPrompt.includes('budget') || cleanPrompt.includes('cheap') || cleanPrompt.includes('affordable');
  const guestCountMatch = userPrompt.match(/(\d+)\s*(guests?|people|attendees|pax)/i);
  const targetGuests = guestCountMatch ? parseInt(guestCountMatch[1], 10) : (eventType === 'wedding' ? 180 : eventType === 'birthday' ? 45 : 300);
  const baseBudget = isBudgetLow 
    ? (eventType === 'wedding' ? 12000 : eventType === 'birthday' ? 2500 : 5000)
    : (eventType === 'wedding' ? 35000 : eventType === 'birthday' ? 6500 : 15000);

  return {
    title: userPrompt.length > 5 && userPrompt.length < 50 ? userPrompt : `Custom ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Extravaganza`,
    theme: cleanPrompt.includes('beach') ? 'Coastal Sunset & Driftwood Elegance' :
           cleanPrompt.includes('vintage') ? 'Vintage Velvet & Golden Age Romance' :
           cleanPrompt.includes('garden') ? 'Secret Botanical Garden & Twilight Blooms' :
           'Modern Sophistication & Joyful Luminescence',
    date: '2026-12-12',
    time: '17:00',
    location: cleanPrompt.includes('destination') ? 'Cliffside Villa, Amalfi Coast' : 'Grand Pavilion & Private Gardens',
    targetGuests,
    currency: 'USD',
    totalBudget: baseBudget,
    notes: `AI-generated blueprint synthesized from prompt: "${userPrompt}". Optimized for guest engagement, visual aesthetics, and disciplined financial pacing.`,
    budgetItems: [
      {
        id: `gen-b-1`,
        category: 'venue',
        name: 'Main Reception Venue & Private Grounds Rental',
        estimatedCost: Math.round(baseBudget * 0.35),
        actualCost: Math.round(baseBudget * 0.33),
        paid: Math.round(baseBudget * 0.15),
        status: 'partially-paid',
        notes: 'Includes tables, chairs, staging, and climate control.'
      },
      {
        id: `gen-b-2`,
        category: 'catering',
        name: `Artisanal Dining & Beverage Service (${targetGuests} guests)`,
        estimatedCost: Math.round(baseBudget * 0.32),
        actualCost: Math.round(baseBudget * 0.34),
        paid: 0,
        status: 'pending',
        notes: 'Covers 3-course plated meal, passed hors d’oeuvres, and signature cocktails.'
      },
      {
        id: `gen-b-3`,
        category: 'photography',
        name: 'Photography & Cinematic Video Reel Coverage',
        estimatedCost: Math.round(baseBudget * 0.12),
        actualCost: Math.round(baseBudget * 0.11),
        paid: Math.round(baseBudget * 0.05),
        status: 'partially-paid',
        notes: '8 hours coverage, drone footage, high-resolution digital gallery.'
      },
      {
        id: `gen-b-4`,
        category: 'decor',
        name: 'Floral Installations, Ambient Lighting & Centerpieces',
        estimatedCost: Math.round(baseBudget * 0.10),
        actualCost: Math.round(baseBudget * 0.10),
        paid: 0,
        status: 'pending',
        notes: 'Cohesive color palette with fairy light ceiling wash.'
      },
      {
        id: `gen-b-5`,
        category: 'entertainment',
        name: 'Live Band / DJ & Professional Sound Rig',
        estimatedCost: Math.round(baseBudget * 0.07),
        actualCost: Math.round(baseBudget * 0.07),
        paid: 0,
        status: 'pending',
        notes: 'Includes wireless microphones for toasts and dance floor lighting.'
      },
      {
        id: `gen-b-6`,
        category: 'contingency',
        name: 'Contingency & Incidentals Buffer (5%)',
        estimatedCost: Math.round(baseBudget * 0.04),
        actualCost: 0,
        paid: 0,
        status: 'pending',
        notes: 'Reserved for unexpected additions or last-minute permits.'
      }
    ],
    timeline: [
      {
        id: 'gen-tm-1',
        title: 'Lock Venue & Deposit',
        description: 'Tour site, sign rental agreement, pay first installment.',
        phase: '6_months',
        dueDate: '2026-06-12',
        category: 'logistics',
        status: 'completed'
      },
      {
        id: 'gen-tm-2',
        title: 'Book Catering & Bar Service',
        description: 'Approve tasting menu and beverage package.',
        phase: '3_months',
        dueDate: '2026-09-12',
        category: 'vendor',
        status: 'in_progress'
      },
      {
        id: 'gen-tm-3',
        title: 'Send Digital Invitations & RSVP Tracker',
        description: 'Collect dietary restrictions, song requests, plus-ones.',
        phase: '1_month',
        dueDate: '2026-11-12',
        category: 'guest',
        status: 'pending'
      },
      {
        id: 'gen-tm-4',
        title: 'Final Vendor Confirmation & Day-Of Run of Show',
        description: 'Distribute hourly load-in schedule to all vendors.',
        phase: '1_week',
        dueDate: '2026-12-05',
        category: 'vendor',
        status: 'pending'
      },
      {
        id: 'gen-tm-5',
        title: '02:00 PM - Vendor Arrival & Staging Setup',
        description: 'Floral drop-off, soundcheck, catering prep.',
        phase: 'day_of',
        dueDate: '2026-12-12',
        timeSlot: '02:00 PM',
        isDayOf: true,
        category: 'logistics',
        status: 'pending'
      },
      {
        id: 'gen-tm-6',
        title: '05:00 PM - Guest Arrival & Welcome Refreshments',
        description: 'Ambient music, welcome drinks, guest seating.',
        phase: 'day_of',
        dueDate: '2026-12-12',
        timeSlot: '05:00 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'gen-tm-7',
        title: '07:30 PM - Celebratory Dinner & Inspiring Toasts',
        description: 'Main course service, speeches, cake/milestone moment.',
        phase: 'day_of',
        dueDate: '2026-12-12',
        timeSlot: '07:30 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      }
    ],
    vendors: [
      {
        id: 'gen-v-1',
        name: 'The Grand Pavilion Estates',
        category: 'venue',
        contactPerson: 'Sarah Jenkins',
        email: 'info@grandpavilion.example.com',
        phone: '+1 555-234-5678',
        status: 'contacted',
        quoteAmount: Math.round(baseBudget * 0.35),
        depositPaid: Math.round(baseBudget * 0.15),
        rating: 4.8,
        notes: 'Covers main hall, outdoor garden lawn, and bridal suite.',
        checklists: [
          { id: 'gvc-1', text: 'Confirm setup load-in time slot', done: true },
          { id: 'gvc-2', text: 'Submit vendor COI (Certificate of Insurance)', done: false }
        ]
      },
      {
        id: 'gen-v-2',
        name: 'Culinary Masterpieces Catering',
        category: 'catering',
        contactPerson: 'Chef Laurent',
        email: 'events@culinarymaster.example.com',
        phone: '+1 555-876-5432',
        status: 'quoted',
        quoteAmount: Math.round(baseBudget * 0.32),
        depositPaid: 0,
        rating: 4.9,
        notes: 'Seasonal farm-to-table menu with vegan and allergen accommodations.',
        checklists: [
          { id: 'gvc-3', text: 'Schedule menu tasting session', done: true },
          { id: 'gvc-4', text: 'Confirm beverage package & glassware count', done: false }
        ]
      }
    ],
    ideas: [
      {
        id: 'gen-id-1',
        category: 'theme',
        title: 'Modern Luminescence & Botanical Gold',
        description: 'Warm champagne tones with matte black, emerald foliage, and floating warm candlelight accents.',
        tags: ['Elegant', 'Photogenic', 'Contemporary'],
        colorPalette: ['#1e293b', '#059669', '#d97706', '#fef3c7', '#f8fafc'],
        accentHighlight: 'Champagne Gold & Forest Emerald'
      },
      {
        id: 'gen-id-2',
        category: 'cocktail',
        title: 'The Golden Hour Sparkler',
        description: 'Elderflower liqueur, sparkling prosecco, squeeze of fresh lemon, and a sprig of fresh rosemary.',
        tags: ['Refreshing', 'Crowd Pleaser']
      },
      {
        id: 'gen-id-3',
        category: 'activity',
        title: 'Audio Guestbook & Vintage Phone Booth',
        description: 'Guests pick up a retro rotary telephone to record heartwarming, hilarious voice messages that are mastered into a lifetime audio vinyl.',
        tags: ['Keepsake', 'Viral Trend', 'High Engagement']
      }
    ]
  };
}

/**
 * 2. AI Budget Doctor: Analyzes expenses and proposes intelligent savings strategies
 */
export interface BudgetOptimizationSuggestion {
  category: string;
  title: string;
  estimatedSavings: number;
  explanation: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
}

export async function analyzeBudgetWithAI(event: EventModel): Promise<BudgetOptimizationSuggestion[]> {
  const currencySymbol = event.currency === 'INR' ? '₹' : '$';
  const totalActual = event.budgetItems.reduce((acc, i) => acc + (i.actualCost || i.estimatedCost), 0);
  const diff = totalActual - event.totalBudget;

  const prompt = `Act as an expert event financial consultant.
Event Type: ${event.type}
Total Budget: ${currencySymbol}${event.totalBudget}
Current Forecast: ${currencySymbol}${totalActual} (${diff > 0 ? `OVER by ${currencySymbol}${diff}` : `Within budget`})
Expenses: ${JSON.stringify(event.budgetItems.map(b => ({ name: b.name, category: b.category, cost: b.actualCost || b.estimatedCost })))}

Generate 4 practical, specific cost-saving recommendations with realistic numerical savings.
Return strictly valid JSON:
[
  {
    "category": string,
    "title": string,
    "estimatedSavings": number,
    "explanation": string,
    "difficulty": "easy" | "moderate" | "advanced"
  }
]`;

  const raw = await callGeminiRaw(prompt);
  if (raw) {
    const parsed = extractJsonFromText<BudgetOptimizationSuggestion[] | null>(raw, null);
    if (parsed && Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  }

  // Built-in intelligent budget recommendations
  const suggestions: BudgetOptimizationSuggestion[] = [
    {
      category: 'catering',
      title: 'Switch from Full Open Bar to "Signature Cocktail + Wine & Beer"',
      estimatedSavings: Math.round(event.totalBudget * 0.06),
      explanation: 'Rather than stocking top-shelf liquor for the entire duration, curating 2 distinctive signature cocktails alongside craft beer and quality wine cuts liquor costs by 25-30% while actually feeling more bespoke.',
      difficulty: 'easy'
    },
    {
      category: 'decor',
      title: 'Repurpose Ceremony Florals for the Reception Dinner',
      estimatedSavings: Math.round(event.totalBudget * 0.04),
      explanation: 'Design aisle florals and altar arrangements on transportable pedestals so your event crew can migrate them to the head table and gift station during cocktail hour.',
      difficulty: 'easy'
    },
    {
      category: 'stationery',
      title: 'Adopt Modern Digital Invites & QR Code Web Portal',
      estimatedSavings: Math.round(event.totalBudget * 0.025),
      explanation: 'Save printing, foil stamping, calligraphy, and postage by sending interactive WhatsApp / web invitations with real-time digital RSVP tracking and SMS reminders.',
      difficulty: 'easy'
    },
    {
      category: 'venue',
      title: 'Negotiate Non-Peak Arrival or Included Audio/Visual Gear',
      estimatedSavings: Math.round(event.totalBudget * 0.05),
      explanation: 'Many venues charge separate fees for wireless microphones, projectors, and lounge furniture. Ask for these line items to be bundled into the base rental fee before contract signing.',
      difficulty: 'moderate'
    }
  ];

  return suggestions;
}

/**
 * 3. AI Vendor RFP & Inquiry Generator: Drafts customizable, professional messages for vendors
 */
export async function generateVendorInquiry(
  event: EventModel,
  vendorCategory: string,
  vendorName: string,
  specialRequests: string,
  channel: 'email' | 'whatsapp'
): Promise<{ subject?: string; message: string }> {
  const prompt = `Draft a professional, warm vendor inquiry for:
Vendor Name: ${vendorName}
Category: ${vendorCategory}
Event: ${event.title} (${event.type})
Date: ${event.date}
Location: ${event.location}
Guest Count: ${event.targetGuests}
Special Requests: ${specialRequests || 'Standard package pricing and date availability'}
Channel: ${channel} (format accordingly with appropriate brevity or structure)

Return JSON: { "subject": string, "message": string }`;

  const raw = await callGeminiRaw(prompt);
  if (raw) {
    const parsed = extractJsonFromText<{ subject?: string; message: string } | null>(raw, null);
    if (parsed && parsed.message) {
      return parsed;
    }
  }

  // Fallback high-impact templates
  if (channel === 'whatsapp') {
    return {
      message: `Hello ${vendorName} team! 👋

I hope you are having a wonderful week! We are organizing ${event.title} on *${event.date}* in *${event.location}* for approximately *${event.targetGuests} guests*.

We love your work and would love to check your availability for this date. We are looking for ${vendorCategory} services${specialRequests ? ` with specific interest in: ${specialRequests}` : ''}.

Could you please share your service brochure, package pricing, and next steps to set up a quick 10-minute call?

Warm regards,
Event Planning Team`
    };
  }

  return {
    subject: `Vendor Inquiry: ${vendorCategory.toUpperCase()} for ${event.title} on ${event.date}`,
    message: `Dear ${vendorName} Team,

I hope this email finds you well.

We are currently planning "${event.title}" scheduled to take place on ${event.date} in ${event.location}, with an anticipated attendance of ${event.targetGuests} guests. Having admired your reputation in the ${vendorCategory} space, we would love to inquire about your availability for our event date.

Key Event Details:
• Event Name: ${event.title} (${event.type.toUpperCase()})
• Date & Time: ${event.date} at ${event.time || 'TBD'}
• Location: ${event.location}
• Expected Guests: ${event.targetGuests}
• Specific Requirements: ${specialRequests || 'Standard tier offerings, sample menus/portfolios, and load-in specifications'}

Could you kindly share your available packages, pricing guide, and deposit/cancellation terms? If you have time this week, we would also be delighted to schedule a brief consultation call.

Thank you very much for your time, and we look forward to hearing from you.

Warmest regards,
The Event Organizing Committee`
  };
}

/**
 * 4. AI Speech & Toast Crafter
 */
export async function generateSpeechWithAI(
  event: EventModel,
  speechType: string,
  speakerName: string,
  honoreeName: string,
  tone: 'emotional' | 'humorous' | 'formal' | 'poetic',
  memoriesOrNotes: string
): Promise<GeneratedSpeech> {
  const prompt = `Write an inspiring, memorable ${speechType} speech for an event:
Event: ${event.title} (${event.type})
Speaker: ${speakerName || 'Speaker'}
Honoree / Focus: ${honoreeName || 'Honoree / Guests'}
Tone: ${tone}
Key stories/memories: ${memoriesOrNotes || 'Lifelong memories, gratitude, laughter, and warm hopes for the future'}

Output JSON:
{
  "title": string,
  "content": string,
  "tone": "${tone}",
  "estimatedDuration": "X mins"
}`;

  const raw = await callGeminiRaw(prompt);
  if (raw) {
    const parsed = extractJsonFromText<GeneratedSpeech | null>(raw, null);
    if (parsed && parsed.content) {
      return { ...parsed, id: `sp-${Date.now()}`, type: speechType as any };
    }
  }

  // Fallback high-touch speech
  const titles: Record<string, string> = {
    best_man: `Best Man Toast to ${honoreeName || 'the Happy Couple'}`,
    maid_of_honor: `Maid of Honor Speech: A Bond Unbreakable`,
    parent: `A Parent's Heartfelt Blessing for ${honoreeName || 'Our Children'}`,
    host_welcome: `Welcome Address: Celebrating Together`,
    toast: `A Joyous Celebration Toast`,
    keynote: `Inspiring Milestone Keynote`
  };

  return {
    id: `sp-${Date.now()}`,
    type: speechType as any,
    title: titles[speechType] || `${speechType} Speech`,
    tone,
    estimatedDuration: '3 - 4 mins',
    content: `Good evening everyone!

Looking around this room tonight at ${event.location}, with all of you gathered to celebrate ${event.title}, my heart is simply full. 

${memoriesOrNotes ? `Thinking back on our journey together — ${memoriesOrNotes} — it reminds me why moments like this are so profoundly precious.` : `They say that true joy is something that only multiplies when shared, and looking at ${honoreeName || 'our wonderful guests'}, that could not be more true.`}

${tone === 'humorous' 
  ? `Now, I was given strict instructions to keep this speech under three minutes and to leave out at least 80% of our most embarrassing college stories. So to the groom/guest of honor: you're welcome! But in all honesty, you make laughter effortless and loyalty look second nature.` 
  : `What strikes me most about ${honoreeName || 'this celebration'} is the genuine generosity of spirit present in every single room you walk into. You have a rare gift for making everyone around you feel seen, valued, and loved.`}

May this day mark the start of your happiest chapter yet — filled with great adventures, resilient love, and spontaneous laughter.

Let us all raise our glasses: To ${honoreeName || 'our celebration'}, to health, happiness, and unforgettable memories! Cheers! 🥂`
  };
}

/**
 * 5. AI Invitation Copywriter
 */
export async function generateInvitationWithAI(
  event: EventModel,
  channel: 'whatsapp' | 'formal_card' | 'sms' | 'email',
  themeStyle: string
): Promise<GeneratedInvite> {
  const prompt = `Write a creative, compelling invitation for:
Channel: ${channel}
Event: ${event.title} (${event.type})
Date: ${event.date}
Time: ${event.time}
Location: ${event.location}
Theme/Style: ${themeStyle}

Return JSON:
{
  "title": string,
  "content": string,
  "rsvpDeadline": "YYYY-MM-DD",
  "themeStyle": "${themeStyle}"
}`;

  const raw = await callGeminiRaw(prompt);
  if (raw) {
    const parsed = extractJsonFromText<GeneratedInvite | null>(raw, null);
    if (parsed && parsed.content) {
      return { ...parsed, id: `inv-${Date.now()}`, channel };
    }
  }

  // Fallback high quality invites
  if (channel === 'whatsapp') {
    return {
      id: `inv-${Date.now()}`,
      channel,
      title: `${themeStyle} WhatsApp Invite`,
      themeStyle,
      rsvpDeadline: '2026-11-20',
      content: `🎉 *You're Invited to ${event.title}!* 🎉

Join us as we celebrate this joyous milestone together in style!

📅 *Date:* ${event.date}
⏰ *Time:* ${event.time || 'Evening'}
📍 *Location:* ${event.location}
✨ *Theme:* ${themeStyle || event.theme}

Please confirm your attendance by Nov 20 so we can finalize dinner & seating arrangements!

Looking forward to creating unforgettable memories with you! 🥂`
    };
  }

  return {
    id: `inv-${Date.now()}`,
    channel,
    title: `${themeStyle} Formal Invitation Card`,
    themeStyle,
    rsvpDeadline: '2026-11-20',
    content: `Together with their families

Cordially invite you to share in the joy of

"${event.title}"

On the evening of ${event.date}
At ${event.time || 'five o\'clock in the evening'}

${event.location}

Theme & Dress: ${themeStyle || event.theme}

The favor of a reply is requested by November 20th.`
  };
}

/**
 * 6. Interactive Concierge AI Chat Assistant
 */
export async function askConcierge(
  userQuery: string,
  event: EventModel,
  chatHistory: { role: 'user' | 'assistant'; text: string }[]
): Promise<{ text: string; actionablePayload?: any }> {
  const historyText = chatHistory.slice(-4).map(h => `${h.role}: ${h.text}`).join('\n');
  const systemPrompt = `You are FestivaAI Concierge, an elite, highly knowledgeable event planner.
Current Event Context:
- Name: ${event.title}
- Type: ${event.type}
- Budget: ${event.currency} ${event.totalBudget} (Spent: ${event.budgetItems.reduce((acc, b) => acc + (b.actualCost || b.estimatedCost), 0)})
- Date: ${event.date} (${event.targetGuests} guests at ${event.location})

Provide warm, structured, actionable advice. If the user asks you to add an expense, milestone, or vendor, you can include an actionablePayload in JSON.
Format output:
{
  "text": "Your helpful response here in markdown formatting",
  "actionablePayload": null | { "type": "add_expense" | "add_milestone" | "add_vendor" | "add_idea", "title": string, "data": object }
}`;

  const prompt = `Chat History:\n${historyText}\n\nUser Question: ${userQuery}\n\nRespond with helpful advice and suggestions:`;
  const raw = await callGeminiRaw(prompt, systemPrompt);

  if (raw) {
    const parsed = extractJsonFromText<{ text: string; actionablePayload?: any } | null>(raw, null);
    if (parsed && parsed.text) {
      return parsed;
    }
  }

  // Fallback intelligent responder based on keywords
  const q = userQuery.toLowerCase();
  
  if (q.includes('budget') || q.includes('save') || q.includes('cost') || q.includes('money')) {
    return {
      text: `💡 **Budget Optimization Strategy for ${event.title}**:

1. **Leverage Dual-Use Assets**: Repurpose ceremony flowers, backdrop arches, and mood lighting into the dining hall during cocktail hour. This routinely saves **$400 – $800** on duplicate floral rentals.
2. **Curated Bar Menu**: Instead of an open top-shelf liquor bar, offer 2 signature cocktails plus local wines and craft beer. This reduces beverage waste by **25%** while feeling more personal!
3. **Digital RSVP Portal**: Ditch printed reply cards and postage in favor of digital QR-code RSVP management.
4. **Buffer Contingency**: Keep 5-8% unallocated for last-minute guest additions and tips.

Would you like me to analyze a specific vendor quote or re-allocate funds between categories?`,
      actionablePayload: {
        type: 'add_expense',
        title: 'Add Suggested Contingency Buffer',
        data: {
          category: 'contingency',
          name: 'AI Recommended Contingency Buffer',
          estimatedCost: Math.round(event.totalBudget * 0.05),
          actualCost: 0,
          paid: 0,
          status: 'pending',
          notes: 'Added via FestivaAI Concierge recommendation'
        }
      }
    };
  }

  if (q.includes('timeline') || q.includes('schedule') || q.includes('run of show') || q.includes('day of')) {
    return {
      text: `⏱️ **Day-Of Run of Show Golden Rules for ${event.title}**:

- **The 15-Minute Cushion**: Always pad 15 extra minutes between the ceremony/speeches and meal service. Buffets and plated services virtually always start 10-15 minutes behind schedule.
- **Vendor Load-in Buffer**: Ensure sound, lighting, and florist vendors arrive at least **3.5 hours** prior to guest arrival.
- **Golden Hour Photography**: Schedule couple/VIP portraits 45 minutes before sunset for the most breathtaking natural lighting.
- **Sparkler / Grand Exit**: Announce the send-off 20 minutes before the venue rental concludes to allow safe guest departure.

Would you like me to inject a specific milestone into your Day-Of schedule?`,
      actionablePayload: {
        type: 'add_milestone',
        title: 'Add Golden Hour Portrait Session to Timeline',
        data: {
          title: '05:30 PM - Golden Hour Sunset Portraits',
          description: 'Candid photo session during optimal natural outdoor lighting.',
          phase: 'day_of',
          dueDate: event.date,
          timeSlot: '05:30 PM',
          isDayOf: true,
          category: 'creative',
          status: 'pending'
        }
      }
    };
  }

  if (q.includes('game') || q.includes('activity') || q.includes('icebreaker') || q.includes('idea')) {
    return {
      text: `🎉 **Top 3 High-Engagement Ideas for ${event.type === 'wedding' ? 'Weddings' : event.type === 'birthday' ? 'Birthdays' : 'Community Events'}**:

1. **The Audio Guestbook (Viral Hit)**: A vintage rotary telephone where guests leave uncensored, heartfelt voicemail memories after a cocktail or two!
2. **Interactive Photo Scavenger Hunt**: Provide a QR code linked to a shared album with a list of 10 fun photo quests (e.g., "Selfie with the funniest dancer", "The best dessert moment").
3. **Custom Signature Cocktail & Mocktail Duo**: Name the drinks after inside jokes, pets, or milestone dates!

I've crafted an idea card for you below if you'd like to pin it directly to your Creative Studio!`,
      actionablePayload: {
        type: 'add_idea',
        title: 'Pin "Vintage Audio Guestbook" to Ideas',
        data: {
          category: 'activity',
          title: 'Vintage Audio Guestbook & Photo Quest',
          description: 'Guests dial a vintage rotary phone to record audio messages, paired with a live QR-code shared photo album challenge.',
          tags: ['Guest Favorite', 'High Engagement', 'Keepsake']
        }
      }
    };
  }

  return {
    text: `✨ I'm here to assist with every phase of **${event.title}**!

Here are some popular things I can help you with right now:
• **Budget**: Calculate per-guest costs, identify overspending, or simulate vendor quotes.
• **Timeline**: Build a minute-by-minute Day-Of Run of Show or milestone countdown.
• **Vendors**: Generate a polite Request for Proposal (RFP) message ready for Email or WhatsApp.
• **Creative Studio**: Write custom speeches, generate theme palettes, or draft invitation copy.

What would you like to explore next?`
  };
}
