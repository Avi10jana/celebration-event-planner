import type { EventModel } from '../types/event';

export const STARTER_EVENTS: EventModel[] = [
  {
    id: 'evt-wedding-01',
    title: 'The Royal Heritage Wedding & Sangeet',
    type: 'wedding',
    theme: 'Marigold & Regal Emerald Palace Dream',
    date: '2026-11-28',
    time: '16:30',
    location: 'The Oberoi Udaivilas & Jagmandir Island, Udaipur',
    targetGuests: 220,
    currency: 'INR',
    totalBudget: 4500000,
    notes: 'A 3-day royal celebration blending traditional Rajasthani grandeur with contemporary elegance. Emphasize sustainable floral decor and personalized guest hospitality.',
    budgetItems: [
      {
        id: 'b-1',
        category: 'venue',
        name: 'Palace Courtyard & Lake View Lawns',
        estimatedCost: 1500000,
        actualCost: 1450000,
        paid: 725000,
        status: 'partially-paid',
        vendorName: 'Udaivilas Heritage Team',
        notes: 'Includes lakeside mandap setup and heritage lighting.'
      },
      {
        id: 'b-2',
        category: 'catering',
        name: 'Royal Feast & Global Fusion Buffet (220 pax)',
        estimatedCost: 1200000,
        actualCost: 1250000,
        paid: 600000,
        status: 'partially-paid',
        vendorName: 'Maharaja Culinary Arts',
        notes: 'Includes live chaat street, Rajasthani thali, Italian artisanal station, and vegan desserts.'
      },
      {
        id: 'b-3',
        category: 'photography',
        name: 'Cinematic 4K Films & Candid Photography',
        estimatedCost: 450000,
        actualCost: 420000,
        paid: 200000,
        status: 'partially-paid',
        vendorName: 'Stories by Joseph & Radhika',
        notes: 'Includes drone footage, teaser trailer, and 2 hardcover photobooks.'
      },
      {
        id: 'b-4',
        category: 'entertainment',
        name: 'Sangeet DJ, Dhol Tasha Troupe & Folk Dancers',
        estimatedCost: 350000,
        actualCost: 320000,
        paid: 150000,
        status: 'partially-paid',
        vendorName: 'SoundWave Productions',
        notes: 'Acoustic setup for pheras and high-energy EDM/Bhangra DJ set for reception.'
      },
      {
        id: 'b-5',
        category: 'decor',
        name: 'Floral Mandap, Fairy Light Forest & Royal Aisles',
        estimatedCost: 550000,
        actualCost: 580000,
        paid: 300000,
        status: 'partially-paid',
        vendorName: 'Bloom & Petals Couture',
        notes: 'Eco-conscious marigold garlands, brass lamps, and blush rose backdrop.'
      },
      {
        id: 'b-6',
        category: 'attire',
        name: 'Bridal Lehenga & Groom Sherwani Styling',
        estimatedCost: 250000,
        actualCost: 260000,
        paid: 260000,
        status: 'paid',
        vendorName: 'Sabyasachi Heritage & Studio',
        notes: 'Final fitting completed; accessories matched.'
      },
      {
        id: 'b-7',
        category: 'stationery',
        name: 'Luxury Boxed Invites & WhatsApp Digital Portal',
        estimatedCost: 80000,
        actualCost: 75000,
        paid: 75000,
        status: 'paid',
        vendorName: 'PaperLuxe Atelier',
        notes: 'Custom wax seal and QR code RSVP portal.'
      },
      {
        id: 'b-8',
        category: 'contingency',
        name: 'Emergency Fund & Weather Buffer',
        estimatedCost: 120000,
        actualCost: 50000,
        paid: 0,
        status: 'pending',
        notes: 'Reserved for unexpected guest additions or boat transit charges.'
      }
    ],
    timeline: [
      {
        id: 'tm-1',
        title: 'Lock Venue & Pay Advance Deposit',
        description: 'Finalize dates, check lake transit permissions, sign contract.',
        phase: '6_months',
        dueDate: '2026-05-28',
        category: 'logistics',
        status: 'completed',
        assignedTo: 'Family Lead'
      },
      {
        id: 'tm-2',
        title: 'Book Photographer & Cinematographer',
        description: 'Review portfolio, confirm drone clearances, book pre-wedding shoot.',
        phase: '3_months',
        dueDate: '2026-08-28',
        category: 'vendor',
        status: 'completed',
        assignedTo: 'Couple'
      },
      {
        id: 'tm-3',
        title: 'Food Tasting & Final Menu Sign-off',
        description: 'Sample 15 appetizers, 6 main courses, dessert bar, and signature mocktails.',
        phase: '1_month',
        dueDate: '2026-10-25',
        category: 'vendor',
        status: 'in_progress',
        assignedTo: 'Catering Committee'
      },
      {
        id: 'tm-4',
        title: 'Dispatch WhatsApp Digital Itinerary & RSVP Follow-up',
        description: 'Collect hotel arrival times, airport shuttle requests, dietary flags.',
        phase: '2_weeks',
        dueDate: '2026-11-14',
        category: 'guest',
        status: 'pending',
        assignedTo: 'Hospitality Desk'
      },
      {
        id: 'tm-5',
        title: 'Sangeet Choreography Final Rehearsal',
        description: 'Full run-through of family dances and bride/groom grand entrance.',
        phase: 'day_before',
        dueDate: '2026-11-27',
        category: 'creative',
        status: 'pending',
        assignedTo: 'Choreographer'
      },
      {
        id: 'tm-6',
        title: '09:00 AM - Haldi & Sunshine Floral Rituals',
        description: 'Intimate poolside yellow-themed ceremony with dholak rhythms.',
        phase: 'day_of',
        dueDate: '2026-11-28',
        timeSlot: '09:00 AM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'tm-7',
        title: '02:00 PM - Bridal & Groom Makeup Session',
        description: 'Hair, makeup, and royal dupatta draping in presidential suite.',
        phase: 'day_of',
        dueDate: '2026-11-28',
        timeSlot: '02:00 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'tm-8',
        title: '04:30 PM - Royal Baraat Procession Across Lakeside',
        description: 'Vintage car entry, live percussion, safa tie-in for guests.',
        phase: 'day_of',
        dueDate: '2026-11-28',
        timeSlot: '04:30 PM',
        isDayOf: true,
        category: 'logistics',
        status: 'pending'
      },
      {
        id: 'tm-9',
        title: '06:30 PM - Varmala Exchange & Sacred Pheras',
        description: 'Cold pyrotechnics on lake deck followed by Vedic hymns.',
        phase: 'day_of',
        dueDate: '2026-11-28',
        timeSlot: '06:30 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'tm-10',
        title: '08:30 PM - Royal Banquet, Speeches & Dance Night',
        description: 'Gourmet dinner, emotional father toast, sparkler celebration.',
        phase: 'day_of',
        dueDate: '2026-11-28',
        timeSlot: '08:30 PM',
        isDayOf: true,
        category: 'logistics',
        status: 'pending'
      }
    ],
    vendors: [
      {
        id: 'v-1',
        name: 'The Oberoi Heritage Events Team',
        category: 'venue',
        contactPerson: 'Vikramaditya Rathore',
        email: 'events@udaivilas.example.com',
        phone: '+91 98290 12345',
        status: 'booked',
        quoteAmount: 1450000,
        depositPaid: 725000,
        rating: 4.9,
        notes: 'Includes lakeside pontoon setup and backup indoor ballroom in case of weather.',
        checklists: [
          { id: 'vc-1', text: 'Obtain sound permit for open-air lawn past 10 PM', done: true },
          { id: 'vc-2', text: 'Confirm boat transfer schedule for guests', done: true },
          { id: 'vc-3', text: 'Review power generator backup specs', done: false }
        ]
      },
      {
        id: 'v-2',
        name: 'Maharaja Culinary Arts',
        category: 'catering',
        contactPerson: 'Chef Devang Vyas',
        email: 'devang@maharajacatering.example.com',
        phone: '+91 99820 54321',
        status: 'booked',
        quoteAmount: 1250000,
        depositPaid: 600000,
        rating: 4.8,
        notes: 'Specialize in royal Marwari, Awadhi, and modern Mediterranean live stations.',
        checklists: [
          { id: 'vc-4', text: 'Finalize dietary requirements (Jain, Gluten-free, Nut allergy)', done: false },
          { id: 'vc-5', text: 'Arrange midnight snack counter (sliders & chai)', done: true },
          { id: 'vc-6', text: 'Confirm waitstaff ratio (1 server per 8 guests)', done: false }
        ]
      },
      {
        id: 'v-3',
        name: 'Stories by Joseph & Radhika',
        category: 'photography',
        contactPerson: 'Joseph Mathew',
        email: 'contact@storiesfilm.example.com',
        phone: '+91 98110 77654',
        status: 'booked',
        quoteAmount: 420000,
        depositPaid: 200000,
        rating: 5.0,
        notes: 'Lead team of 4 (2 candid photographers, 2 cinematographers) + drone operator.',
        checklists: [
          { id: 'vc-7', text: 'Send VIP family shot list & priority portraits', done: false },
          { id: 'vc-8', text: 'Agree on 48-hour teaser film timeline', done: true },
          { id: 'vc-9', text: 'Provide lighting schedule for sunset golden hour', done: true }
        ]
      },
      {
        id: 'v-4',
        name: 'Bloom & Petals Couture',
        category: 'decor',
        contactPerson: 'Sunaina Singhania',
        email: 'sunaina@bloomcouture.example.com',
        phone: '+91 97110 33221',
        status: 'booked',
        quoteAmount: 580000,
        depositPaid: 300000,
        rating: 4.7,
        notes: 'Marigold ombre installations, brass urlis with floating lotus and mogra.',
        checklists: [
          { id: 'vc-10', text: 'Source fresh local tuberose and marigolds', done: true },
          { id: 'vc-11', text: 'Safety check on candle fixtures & fire-retardant canopies', done: false }
        ]
      }
    ],
    ideas: [
      {
        id: 'id-1',
        category: 'theme',
        title: 'Regal Saffron & Emerald Heritage',
        description: 'Rich royal emerald green paired with auspicious saffron, warm gold leaf accents, and fresh fragrant jasmine blossoms.',
        tags: ['Heritage', 'Royal', 'Marigold', 'Lake View'],
        colorPalette: ['#047857', '#d97706', '#f59e0b', '#78350f', '#fef3c7'],
        accentHighlight: 'Emerald Green & Saffron Gold'
      },
      {
        id: 'id-2',
        category: 'cocktail',
        title: 'Udaipur Sunset Elixir & Gulab Spritz',
        description: 'Cardamom-infused gin with rose petal cordial and sparkling soda; plus a non-alcoholic Spiced Alphonso Mango Fizz.',
        tags: ['Signature Drink', 'Floral', 'Refreshing'],
        colorPalette: ['#f43f5e', '#fbbf24', '#fbcfe8']
      },
      {
        id: 'id-3',
        category: 'activity',
        title: 'The Royal Shoe & Nostalgia Quiz',
        description: 'Interactive newlywed shoe game with bilingual host questions, plus a vintage instant Polaroid photo guestbook where guests paste memories and write advice.',
        tags: ['Interactive', 'Memories', 'Guest Favorite']
      },
      {
        id: 'id-4',
        category: 'favor',
        title: 'Artisanal Ittar Perfume & Rajasthani Mojaris',
        description: 'Handcrafted glass vials of organic sandalwood ittar and custom embroidered velvet juttis gifted in handloom silk pouches.',
        tags: ['Keepsake', 'Eco-Friendly', 'Luxury']
      }
    ],
    speeches: [
      {
        id: 'sp-1',
        type: 'parent',
        title: 'Father of the Bride — A Lifetime of Blessings',
        content: `Standing here looking across this enchanted lake, my heart is overflowing. When Aarav and Meera first introduced each other to us, I saw in Aarav's eyes the exact promise every father prays for: a love that protects, respects, and unconditionally cherishes. 

Meera, from taking your first wobbly steps in our living room to walking down this aisle tonight looking like an empress, you have been our guiding star. Aarav, you are not a son-in-law to us; you are the son our family was waiting for.

May your bond be as timeless as these palace walls, and your journey filled with laughter, patience, and boundless joy. To Aarav and Meera!`,
        tone: 'emotional',
        estimatedDuration: '3.5 mins'
      }
    ],
    invitations: [
      {
        id: 'inv-1',
        channel: 'whatsapp',
        title: 'Royal WhatsApp Invite with Travel Itinerary',
        themeStyle: 'Regal Heritage',
        rsvpDeadline: '2026-11-10',
        content: `✨ *Two Souls, One Timeless Celebration* ✨

With immense joy and the blessings of our elders, the Rathore and Sharma families warmly invite you to celebrate the wedding of

🌿 *Meera & Aarav* 🌿

🗓 *Date:* November 28, 2026
📍 *Venue:* The Oberoi Udaivilas, Udaipur
⏰ *Baraat & Ceremony:* 4:30 PM onwards

Dress Code: Traditional Festive / Royal Pastels
Kindly RSVP by Nov 10 for airport shuttle & palace stay arrangements.

We cannot wait to celebrate this milestone together with you! 🥂`
      }
    ]
  },
  {
    id: 'evt-birthday-02',
    title: 'Neon Horizon: 30th Birthday Rooftop Bash',
    type: 'birthday',
    theme: 'Synthwave Neon Glow & Molecular Mixology',
    date: '2026-11-15',
    time: '19:00',
    location: 'Skyline Terrace & Penthouse Lounge, Brooklyn / Bandra',
    targetGuests: 65,
    currency: 'USD',
    totalBudget: 8500,
    notes: 'An electric milestone celebration celebrating the turn of the decade with immersive neon visuals, craft cocktails, vinyl DJ sets, and a late-night slider bar.',
    budgetItems: [
      {
        id: 'bb-1',
        category: 'venue',
        name: 'Panoramic Skyline Glasshouse Terrace',
        estimatedCost: 3200,
        actualCost: 3000,
        paid: 1500,
        status: 'partially-paid',
        vendorName: 'Skyline Events Loft',
        notes: 'Covers 6 hours rental, patio heaters, bar counter, sound system.'
      },
      {
        id: 'bb-2',
        category: 'catering',
        name: 'Gourmet Sliders, Bao Buns & Molecular Dessert Bar',
        estimatedCost: 2400,
        actualCost: 2550,
        paid: 1200,
        status: 'partially-paid',
        vendorName: 'Urban Bite Collective',
        notes: 'Truffle smash burgers, pork belly & tofu bao, liquid nitrogen ice cream.'
      },
      {
        id: 'bb-3',
        category: 'entertainment',
        name: 'Vinyl Indie-Pop / Deep House DJ & Saxophone Duo',
        estimatedCost: 1200,
        actualCost: 1100,
        paid: 550,
        status: 'partially-paid',
        vendorName: 'DJ KINETIC',
        notes: 'Live saxophone accompaniment during golden hour.'
      },
      {
        id: 'bb-4',
        category: 'decor',
        name: 'Custom LED Neon Name Sign & Holographic Balloon Arch',
        estimatedCost: 650,
        actualCost: 620,
        paid: 620,
        status: 'paid',
        vendorName: 'GlowCraft Studio',
        notes: 'Neon sign reads "THIRTY & THRIVING" in electric cyan.'
      },
      {
        id: 'bb-5',
        category: 'photography',
        name: 'Retro 360 Video Booth & Disposable Cameras',
        estimatedCost: 750,
        actualCost: 700,
        paid: 350,
        status: 'partially-paid',
        vendorName: 'SpinSnap 360',
        notes: 'Instant AirDrop video clips for guests with branded overlay.'
      },
      {
        id: 'bb-6',
        category: 'contingency',
        name: 'Late Night Uber Credits & Extra Bar Tab',
        estimatedCost: 300,
        actualCost: 0,
        paid: 0,
        status: 'pending',
        notes: 'Reserved for guest safety rides home.'
      }
    ],
    timeline: [
      {
        id: 'btm-1',
        title: 'Finalize DJ Tracklist & "Do Not Play" List',
        description: 'Send favorite 90s/2000s throwback anthems and dance tracks.',
        phase: '1_month',
        dueDate: '2026-10-15',
        category: 'creative',
        status: 'completed'
      },
      {
        id: 'btm-2',
        title: 'Order Custom 3-Tier Geode Birthday Cake',
        description: 'Dark chocolate salted caramel with edible amethyst rock sugar crystals.',
        phase: '2_weeks',
        dueDate: '2026-11-01',
        category: 'vendor',
        status: 'completed'
      },
      {
        id: 'btm-3',
        title: 'Send WhatsApp Countdown Teaser with Dress Code',
        description: 'Remind guests: "All Black with Neon Cyberpunk Accents".',
        phase: '1_week',
        dueDate: '2026-11-08',
        category: 'guest',
        status: 'pending'
      },
      {
        id: 'btm-4',
        title: '05:00 PM - Vendor Load-in & Neon Lighting Rig',
        description: 'Ensure neon tubes, photo booth ring, and bar ice are installed.',
        phase: 'day_of',
        dueDate: '2026-11-15',
        timeSlot: '05:00 PM',
        isDayOf: true,
        category: 'logistics',
        status: 'pending'
      },
      {
        id: 'btm-5',
        title: '07:00 PM - Doors Open & Smoked Welcome Cocktails',
        description: 'Guests arrive, grab signature drinks, 360 video booth goes live.',
        phase: 'day_of',
        dueDate: '2026-11-15',
        timeSlot: '07:00 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'btm-6',
        title: '09:00 PM - Surprise Toast & Cake Cutting Ceremony',
        description: 'Best friend toast, sparkler candles, confetti drop!',
        phase: 'day_of',
        dueDate: '2026-11-15',
        timeSlot: '09:00 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'btm-7',
        title: '09:30 PM - High-BPM Dance Party & DJ Set',
        description: 'Saxophone soloist joins DJ on the illuminated dance floor.',
        phase: 'day_of',
        dueDate: '2026-11-15',
        timeSlot: '09:30 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      }
    ],
    vendors: [
      {
        id: 'bv-1',
        name: 'Skyline Events Loft',
        category: 'venue',
        contactPerson: 'Elena Rossi',
        email: 'elena@skylineloft.example.com',
        phone: '+1 555-019-2831',
        status: 'booked',
        quoteAmount: 3000,
        depositPaid: 1500,
        rating: 4.9,
        notes: 'Security guard provided at elevator. Music volume must taper at 1:00 AM.',
        checklists: [
          { id: 'bvc-1', text: 'Confirm elevator freight access for sound gear', done: true },
          { id: 'bvc-2', text: 'Verify liability insurance certificate submitted', done: true }
        ]
      },
      {
        id: 'bv-2',
        name: 'Urban Bite Collective',
        category: 'catering',
        contactPerson: 'Marcus Chen',
        email: 'catering@urbanbite.example.com',
        phone: '+1 555-014-9988',
        status: 'booked',
        quoteAmount: 2550,
        depositPaid: 1200,
        rating: 4.8,
        notes: 'Bringing portable induction stations and eco-friendly bamboo plates.',
        checklists: [
          { id: 'bvc-3', text: 'Confirm gluten-free slider bun inventory', done: false },
          { id: 'bvc-4', text: 'Setup dry ice bar for smoking signature cocktails', done: false }
        ]
      }
    ],
    ideas: [
      {
        id: 'bid-1',
        category: 'theme',
        title: 'Cyberpunk Synthwave & Holographic Noir',
        description: 'Deep obsidian black backdrop accented with shocking electric magenta, cyan laser beams, and UV body paint stations.',
        tags: ['Futuristic', 'High Energy', 'Rooftop Vibe'],
        colorPalette: ['#0f172a', '#ec4899', '#06b6d4', '#8b5cf6', '#10b981'],
        accentHighlight: 'Cyber Cyan & Electric Magenta'
      },
      {
        id: 'bid-2',
        category: 'cocktail',
        title: 'The Electric 30 & Midnight Neon Paloma',
        description: 'Smoky Mezcal with butterfly pea flower infused tequila that changes from violet to pink with lime juice, served in glow-rimmed coupes.',
        tags: ['Color-Changing', 'Interactive Bar']
      },
      {
        id: 'bid-3',
        category: 'activity',
        title: 'Roast & Toast: "30 Years in 30 Seconds" Lightning Rounds',
        description: 'Microphone passed around for 30-second rapid-fire funny childhood stories, with a retro buzzer for anyone exceeding the time limit.',
        tags: ['Hilarious', 'Unforgettable', 'High Energy']
      }
    ],
    speeches: [
      {
        id: 'bsp-1',
        type: 'toast',
        title: 'Best Friend 30th Birthday Roast & Toast',
        content: `Ladies, gentlemen, and anyone who remembers when we still burned mixtapes on physical CDs: welcome to Leo's 30th!

They say your 20s are for making mistakes, and your 30s are for complaining about your lower back while making slightly more expensive mistakes. Look at Leo tonight — officially entering the decade of having a favorite grocery store and being emotionally attached to an air fryer!

In all seriousness, Leo, you have been the anchor, the mastermind, and the heartbeat of every adventure we've ever survived. You make growing older look like an upgrade. Here's to leaving 20s in the rearview and conquering your 30s! Cheers! 🥂`,
        tone: 'humorous',
        estimatedDuration: '2 mins'
      }
    ],
    invitations: [
      {
        id: 'binv-1',
        channel: 'whatsapp',
        title: 'Cyberpunk Neon WhatsApp Invite',
        themeStyle: 'Neon Noir',
        rsvpDeadline: '2026-11-05',
        content: `⚡ LEVEL 30 UNLOCKED: LEO'S ROOFTOP BASH ⚡

The 20s had a good run, but it's time to upgrade the firmware. Join us for a high-altitude night of synthwave beats, craft cocktails, and rooftop views.

📅 *When:* Saturday, Nov 15 | 7:00 PM till late
📍 *Where:* Skyline Terrace Penthouse (Brooklyn)
🕶 *Dress Code:* Dark Chic with Neon Accents

Tap the RSVP link below before Nov 5 so we can get your name on the door list! 🍸🍾`
      }
    ]
  },
  {
    id: 'evt-community-03',
    title: 'Unity in Bloom: Community Cultural Autumn Fair',
    type: 'community',
    theme: 'Harvest Lanterns, Food Trucks & Global Arts',
    date: '2026-10-18',
    time: '11:00',
    location: 'Central Community Commons & Amphitheater',
    targetGuests: 500,
    currency: 'USD',
    totalBudget: 12000,
    notes: 'An all-inclusive neighborhood celebration bringing together local families, craft artisans, multicultural food stalls, interactive youth workshops, and charity fundraising for the local animal shelter.',
    budgetItems: [
      {
        id: 'cb-1',
        category: 'venue',
        name: 'Municipal Park Grounds & Canopy Permit',
        estimatedCost: 1500,
        actualCost: 1400,
        paid: 1400,
        status: 'paid',
        vendorName: 'City Parks & Recreation Department',
        notes: 'Includes access to restrooms, amphitheater stage, and electrical mains.'
      },
      {
        id: 'cb-2',
        category: 'logistics',
        name: 'Portable Restrooms, Trash/Recycling Stations & Generators',
        estimatedCost: 2200,
        actualCost: 2100,
        paid: 1050,
        status: 'partially-paid',
        vendorName: 'GreenClean Sanitation Co.',
        notes: 'Eco-sorting stations with volunteer guides.'
      },
      {
        id: 'cb-3',
        category: 'entertainment',
        name: 'Acoustic Folk Stage, Multicultural Dance Troupe & Youth Choir',
        estimatedCost: 2500,
        actualCost: 2300,
        paid: 1150,
        status: 'partially-paid',
        vendorName: 'Community Arts Alliance',
        notes: 'Honorariums for 6 local performing groups.'
      },
      {
        id: 'cb-4',
        category: 'catering',
        name: 'Volunteer Hospitality, Water Stations & Apple Cider Stand',
        estimatedCost: 1800,
        actualCost: 1650,
        paid: 800,
        status: 'partially-paid',
        vendorName: 'Harvest Valley Orchard',
        notes: 'Free warm cider for all attendees; food trucks pay booth fee to cover costs.'
      },
      {
        id: 'cb-5',
        category: 'stationery',
        name: 'Street Banners, Program Booklets & Directional Signage',
        estimatedCost: 900,
        actualCost: 850,
        paid: 850,
        status: 'paid',
        vendorName: 'Local Print Cooperative',
        notes: 'Weatherproof recyclable yard signs and map boards.'
      },
      {
        id: 'cb-6',
        category: 'decor',
        name: 'Harvest Pumpkin Installations, Fairy Light Canopies & Hay Bales',
        estimatedCost: 1600,
        actualCost: 1750,
        paid: 800,
        status: 'partially-paid',
        vendorName: 'Willow Brook Farms',
        notes: 'Hay bales will be donated to the local farm sanctuary after the event.'
      },
      {
        id: 'cb-7',
        category: 'contingency',
        name: 'First Aid Tent, Volunteer Badges & Weather Covers',
        estimatedCost: 1500,
        actualCost: 800,
        paid: 400,
        status: 'partially-paid',
        vendorName: 'Red Cross Community Chapter',
        notes: 'Onsite certified EMTs and emergency AED kits.'
      }
    ],
    timeline: [
      {
        id: 'ctm-1',
        title: 'Submit City Event & Sound Permits',
        description: 'Complete park authority clearance, street closure, and fire marshal check.',
        phase: '6_months',
        dueDate: '2026-05-01',
        category: 'legal',
        status: 'completed'
      },
      {
        id: 'ctm-2',
        title: 'Recruit 35 Neighborhood Volunteers',
        description: 'Assign leads for info tent, waste sorting, kids craft zone, and parking.',
        phase: '1_month',
        dueDate: '2026-09-15',
        category: 'logistics',
        status: 'completed'
      },
      {
        id: 'ctm-3',
        title: 'Confirm 8 Food Trucks & Artisan Booths',
        description: 'Review health dept licenses, food safety certs, electrical wattage needs.',
        phase: '2_weeks',
        dueDate: '2026-10-01',
        category: 'vendor',
        status: 'in_progress'
      },
      {
        id: 'ctm-4',
        title: '07:30 AM - Park Setup & Soundcheck',
        description: 'Set up tables, stage audio, volunteer registration desk.',
        phase: 'day_of',
        dueDate: '2026-10-18',
        timeSlot: '07:30 AM',
        isDayOf: true,
        category: 'logistics',
        status: 'pending'
      },
      {
        id: 'ctm-5',
        title: '11:00 AM - Grand Opening & Community Parade',
        description: 'Opening welcome by Community President, marching band, ribbon cutting.',
        phase: 'day_of',
        dueDate: '2026-10-18',
        timeSlot: '11:00 AM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'ctm-6',
        title: '02:00 PM - Charity Raffle & Pie-Eating Contest',
        description: 'Announce silent auction bids; proceed with family fun competition.',
        phase: 'day_of',
        dueDate: '2026-10-18',
        timeSlot: '02:00 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      },
      {
        id: 'ctm-7',
        title: '06:00 PM - Twilight Lantern Lighting & Acoustic Concert',
        description: 'Solar lanterns illuminated across lake perimeter, closing community song.',
        phase: 'day_of',
        dueDate: '2026-10-18',
        timeSlot: '06:00 PM',
        isDayOf: true,
        category: 'creative',
        status: 'pending'
      }
    ],
    vendors: [
      {
        id: 'cv-1',
        name: 'City Parks & Recreation Department',
        category: 'venue',
        contactPerson: 'David Miller',
        email: 'parks@cityhall.example.gov',
        phone: '+1 555-PARK-001',
        status: 'booked',
        quoteAmount: 1400,
        depositPaid: 1400,
        rating: 4.8,
        notes: 'Permit #CP-2026-881 approved. Parking lots A and B reserved for attendees.',
        checklists: [
          { id: 'cvc-1', text: 'Confirm key access to pavilion restrooms', done: true },
          { id: 'cvc-2', text: 'Obtain temporary amplified sound permit', done: true }
        ]
      },
      {
        id: 'cv-2',
        name: 'Community Arts Alliance',
        category: 'entertainment',
        contactPerson: 'Priya Narayanan',
        email: 'priya@artsalliance.example.org',
        phone: '+1 555-829-1920',
        status: 'booked',
        quoteAmount: 2300,
        depositPaid: 1150,
        rating: 4.9,
        notes: 'Coordinating sound technician, 4 wireless mics, stage monitors.',
        checklists: [
          { id: 'cvc-3', text: 'Collect audio tracks from youth dance troupes', done: false },
          { id: 'cvc-4', text: 'Conduct stage safety check for dance flooring', done: false }
        ]
      }
    ],
    ideas: [
      {
        id: 'cid-1',
        category: 'theme',
        title: 'Harvest Glow & Cultural Tapestry',
        description: 'Warm amber tones, wooden harvest crates, glowing paper lanterns, and colorful cultural tapestries representing the diversity of our neighborhood.',
        tags: ['Inclusive', 'Family-Friendly', 'Eco-Conscious'],
        colorPalette: ['#f59e0b', '#d97706', '#10b981', '#b45309', '#fef3c7'],
        accentHighlight: 'Harvest Amber & Forest Green'
      },
      {
        id: 'cid-2',
        category: 'activity',
        title: 'The Great Community Unity Mural & Recipe Swap',
        description: 'A 20-foot canvas where children and adults paint their hopes for the neighborhood, alongside an index-card recipe exchange box of ancestral family dishes.',
        tags: ['Collaborative', 'Community Pride', 'All Ages']
      },
      {
        id: 'cid-3',
        category: 'activity',
        title: 'Pet Costume Parade & Adoption Drive',
        description: 'A cheerful afternoon walk around the park perimeter with prizes for best owner-pet matching costumes, partnering with the animal shelter.',
        tags: ['Charity', 'Crowd Puller', 'Adorable']
      }
    ],
    speeches: [
      {
        id: 'csp-1',
        type: 'host_welcome',
        title: 'Community President Opening Address',
        content: `Welcome neighbors, friends, and honored guests! 

Look around you today. We have people from three dozen distinct backgrounds, speaking different languages, yet united under the same warm autumn sky. What makes this community truly extraordinary isn't the brick and mortar of our homes — it's the compassion in our hands and the warmth at our tables.

Today is about celebrating each other: our artists, our local culinary champions, our hardworking volunteers, and our children. Please visit the charity booths, taste something you've never tried before, introduce yourself to someone new, and let's make today unforgettable. The fair is officially open!`,
        tone: 'formal',
        estimatedDuration: '3 mins'
      }
    ],
    invitations: [
      {
        id: 'cinv-1',
        channel: 'formal_card',
        title: 'Community Fair Poster & Digital Flyer',
        themeStyle: 'Warm Autumn Harvest',
        rsvpDeadline: '2026-10-10',
        content: `🍁 CELEBRATING TOGETHER: 2026 COMMUNITY CULTURAL FAIR 🍁

Bring the whole family for an unforgettable day in Central Commons!
• 8 Multicultural Food Trucks & Warm Apple Cider
• Live Amphitheater Music & Folk Dances
• Hands-On Kids Craft Village & Silent Charity Auction
• Pet Costume Parade & Twilight Lantern Lighting

📅 Date: Saturday, October 18 | 11:00 AM – 7:00 PM
Admission is completely free. All proceeds from the auction benefit our local shelter.

Come as neighbors, leave as family!`
      }
    ]
  }
];
