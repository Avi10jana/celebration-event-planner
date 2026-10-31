# FestivaAI — Autonomous GenAI Celebration & Event Planner

[![Vite](https://img.shields.io/badge/Vite-8.3.5-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.5-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-8E75C2?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

> **Challenge 05:** Celebration & Event Planner  
> An autonomous GenAI-powered planning assistant that helps users organize **weddings, birthdays, and community events** with intelligent budgets, master timelines, vendor checklists, and personalized creative ideas.

---

## 🌟 Key Features & Capabilities

### 1. 💒 Weddings, 🎂 Birthdays & 🎪 Community Events
Pre-populated with rich, real-world showcase blueprints:
- **The Royal Heritage Wedding & Sangeet (Udaipur):** Multi-day destination palace celebration with lakeside mandap, Rajasthani & fusion dining, dhol ensembles, and traditional pheras.
- **Neon Horizon 30th Birthday Rooftop Bash (NYC / Mumbai):** Cyberpunk synthwave aesthetics, molecular mixology, 360 photo booths, and humorous milestone toasts.
- **Unity in Bloom Cultural Fair & Charity Gala:** Neighborhood park permits, multicultural food trucks, stage performances, charity silent auctions, and twilight lantern lighting.

### 2. 💰 Smart Budget Tracker & AI Budget Doctor
- Interactive ledger with real-time financial health meters (Projected Cost, Total Paid, Remaining Capacity).
- Visual category breakdown bar chart with percentage allocation.
- Multi-currency switcher with live symbols: **USD ($), INR (₹), EUR (€), GBP (£), CAD (CA$), AUD (AU$)**.
- **AI Budget Doctor:** Automatically analyzes expense ratios, flags budget overruns, and generates 4 high-yield cost savings tactics with projected dollar/rupee savings and 1-click ledger credits!
- 1-Click Export to CSV spreadsheet.

### 3. ⏳ Master Timeline & Day-Of Run of Show
- **Dual Mode Planning:**
  - **Master Countdown:** Phased preparation roadmap (6+ months, 3 months, 1 month, 2 weeks, 1 week, Day Before).
  - **Day-Of Run of Show:** Hour-by-hour operational cues from morning vendor load-in to midnight sparkler exit.
- Interactive status toggling with celebratory **Canvas Confetti** feedback.
- Live ticking countdown timer to the celebration moment.

### 4. 📋 Vendor Directory & GenAI RFP Assistant
- Categorized vendor tracking (Venue, Catering, Photography, DJ, Decor, Attire, Cake, Transport, A/V).
- Interactive vetting checklists per vendor with add-task controls.
- **GenAI RFP / Message Generator:** Crafts customized, polite, professional inquiry messages formatted for **WhatsApp** or **formal Email** with 1-click clipboard copy.

### 5. 💡 Creative Studio & Personalized Ideas
- **Visual Moodboards:** Curated themes with interactive hex color palette swatches, dress codes, and signature cocktail pairings.
- **AI Speech & Toast Crafter:** Generates personalized toasts (Best Man, Maid of Honor, Parents, Host Welcome) with tone controls (Emotional, Humorous, Formal, Poetic).
- **AI Invitation & WhatsApp RSVP Copywriter:** Formatted digital and card invitations ready to share.

### 6. 🤖 Interactive AI Event Concierge (Copilot)
- Multi-turn conversational planning assistant powered by **Google Gemini API**.
- Available as a dedicated full-page screen or as a **floating docked chatbot** accessible from any tab!
- Actionable commits: Suggestions like *"Add Contingency Buffer"* or *"Add Golden Hour Photo Session"* can be directly applied to the active event with a single click.

### 7. 📄 Print & Export Dossier Suite
- Formatted printable **Master Event Dossier** with print CSS preview (optimized for print or Save as PDF).
- JSON import/export for instant event backup and sharing.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+)

### Installation
```bash
# Clone the repository and navigate into the folder
cd "Celebration & Event Planner"

# Install dependencies
npm install
```

### Running Locally
```bash
npm run dev
```
The application will launch at **http://localhost:5173/**.

### Running Automated Tests
```bash
npm test
```
Executes all unit tests with Vitest, validating budget math, timeline grouping, and JSON parsing.

### Building for Production
```bash
npm run build
```
Creates an optimized, production-ready bundle in the `dist/` directory.

---

## 🔒 Security & Privacy

FestivaAI adopts a strict **Client-Side Privacy Architecture**:
- Your Google Gemini API Key is stored only in the browser's local storage (`localStorage`).
- API requests are sent directly to Google's official Gemini endpoint.
- If no API key is provided, the application seamlessly uses its high-fidelity **Built-in Intelligent Event Reasoning Engine**.

---

## 📁 Project Structure

```
├── src/
│   ├── types/
│   │   └── event.ts              # TypeScript interfaces (EventModel, BudgetItem, Vendor, etc.)
│   ├── data/
│   │   └── starterEvents.ts      # 3 Rich Starter Blueprints (Wedding, Birthday, Community)
│   ├── services/
│   │   ├── geminiService.ts      # Gemini API caller, fallback reasoning engine, JSON parser
│   │   └── exportService.ts      # CSV export, JSON backup, clipboard & print handlers
│   ├── context/
│   │   └── EventContext.tsx      # State provider, localStorage sync, CRUD actions, toasts
│   ├── components/
│   │   ├── layout/               # Navbar, TabNavigation
│   │   ├── overview/             # EventOverview, CountdownHero, KPI Cards
│   │   ├── budget/               # BudgetTracker, ExpenseLedger, AIBudgetDoctor
│   │   ├── timeline/             # MasterTimeline, DayOfRunOfShow
│   │   ├── vendors/              # VendorChecklist, VendorRfpModal
│   │   ├── ideas/                # CreativeStudio, AISpeechCrafter, AIInviteGenerator
│   │   ├── concierge/            # AIEventConcierge (Chat copilot & floating dock)
│   │   ├── modals/               # NewEventModal, ApiKeyModal, PrintDossierModal
│   │   └── common/               # ConfettiButton, ToastContainer
│   ├── styles/
│   │   ├── index.css             # Design tokens, variables, typography, reset
│   │   ├── components.css        # Cards, badges, tables, timeline track, concierge
│   │   └── App.css               # Layout and animation utilities
│   ├── test/
│   │   └── eventPlanner.test.ts  # Vitest automated test suite
│   ├── App.tsx                   # Main root application
│   └── main.tsx                  # Vite entry point
├── SUBMISSION_DOCUMENTATION.md   # Official Hackathon Evaluation Dossier & LinkedIn Post
├── package.json
└── tsconfig.json
```

---

## 🏆 Hackathon Compliance Checklist

- [x] **Problem Statement Alignment:** Deep support for Weddings, Birthdays, and Community Events with Budgets, Timelines, Vendor Checklists, and Personalized Ideas.
- [x] **Code Quality & Architecture:** Clean TypeScript 5, React 19, modular state management, zero runtime errors.
- [x] **Automated Testing:** 100% passing Vitest test suite (`npm test`).
- [x] **Security:** Safe client-side API key management with zero external leakage.
- [x] **Aesthetics:** Luxury celebration design system with dark obsidian background, gold/violet gradients, glassmorphism, and celebratory confetti.
- [x] **Submission Essentials:** Complete `SUBMISSION_DOCUMENTATION.md` including tool selection rationale, prompt evolution, human vs AI division of labor, architectural diagrams, and ready-to-share LinkedIn post.
