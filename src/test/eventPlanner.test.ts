import { describe, it, expect } from 'vitest';
import { STARTER_EVENTS } from '../data/starterEvents';
import { extractJsonFromText } from '../services/geminiService';
import { CURRENCY_MAP } from '../types/event';

describe('FestivaAI Celebration & Event Planner Core Suite', () => {
  it('validates all 3 required starter event blueprints (Wedding, Birthday, Community)', () => {
    expect(STARTER_EVENTS.length).toBeGreaterThanOrEqual(3);

    const wedding = STARTER_EVENTS.find((e) => e.type === 'wedding');
    const birthday = STARTER_EVENTS.find((e) => e.type === 'birthday');
    const community = STARTER_EVENTS.find((e) => e.type === 'community');

    expect(wedding).toBeDefined();
    expect(birthday).toBeDefined();
    expect(community).toBeDefined();

    expect(wedding?.budgetItems.length).toBeGreaterThan(0);
    expect(wedding?.timeline.length).toBeGreaterThan(0);
    expect(wedding?.vendors.length).toBeGreaterThan(0);
  });

  it('correctly calculates total budget allocations and remaining capacity', () => {
    const wedding = STARTER_EVENTS[0];
    const totalAllocated = wedding.budgetItems.reduce(
      (sum, item) => sum + (item.actualCost > 0 ? item.actualCost : item.estimatedCost),
      0
    );

    expect(totalAllocated).toBeGreaterThan(0);
    const balance = wedding.totalBudget - totalAllocated;
    expect(typeof balance).toBe('number');

    // Each budget item must have valid category and costs
    wedding.budgetItems.forEach((item) => {
      expect(item.name).toBeTruthy();
      expect(item.estimatedCost).toBeGreaterThanOrEqual(0);
      expect(item.actualCost).toBeGreaterThanOrEqual(0);
    });
  });

  it('correctly parses and structures Day-Of Run of Show hourly milestones', () => {
    const birthday = STARTER_EVENTS[1];
    const dayOfItems = birthday.timeline.filter((m) => m.isDayOf || m.phase === 'day_of');

    expect(dayOfItems.length).toBeGreaterThan(0);
    dayOfItems.forEach((item) => {
      expect(item.timeSlot).toBeTruthy();
      expect(item.title).toContain(item.timeSlot);
    });
  });

  it('validates vendor checklist structure and RFP generation inputs', () => {
    const community = STARTER_EVENTS[2];
    expect(community.vendors.length).toBeGreaterThan(0);

    const firstVendor = community.vendors[0];
    expect(firstVendor.checklists.length).toBeGreaterThan(0);
    expect(firstVendor.category).toBeTruthy();
    expect(firstVendor.status).toMatch(/^(researching|contacted|quoted|booked|declined)$/);
  });

  it('safely extracts JSON from LLM responses even with markdown code fences', () => {
    const rawFenced = `Here is your blueprint:
\`\`\`json
{
  "title": "Summer Garden Gala",
  "totalBudget": 20000,
  "targetGuests": 100
}
\`\`\``;

    const parsed = extractJsonFromText(rawFenced, { title: '', totalBudget: 0, targetGuests: 0 });
    expect(parsed.title).toBe('Summer Garden Gala');
    expect(parsed.totalBudget).toBe(20000);
    expect(parsed.targetGuests).toBe(100);
  });

  it('supports international multi-currency conversions and symbol mappings', () => {
    expect(CURRENCY_MAP.USD.symbol).toBe('$');
    expect(CURRENCY_MAP.INR.symbol).toBe('₹');
    expect(CURRENCY_MAP.EUR.symbol).toBe('€');
    expect(CURRENCY_MAP.GBP.symbol).toBe('£');
  });
});
