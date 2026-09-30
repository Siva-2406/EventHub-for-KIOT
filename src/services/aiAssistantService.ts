import { CollegeEvent, Registration, UserProfile } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; actionId: string; payload?: unknown }[];
  eventCards?: CollegeEvent[];
}

export class AIAssistantService {
  /**
   * Generates a context-aware intelligent response using current platform state
   * without calling external AI APIs (Phase 1 rule-based engine ready for Phase 2 LLM plugin)
   */
  processQuery(
    query: string,
    events: CollegeEvent[],
    registrations: Registration[],
    currentUser: UserProfile
  ): ChatMessage {
    const q = query.toLowerCase().trim();
    const registeredEventIds = registrations.map((r) => r.eventId);
    const registeredEvents = events.filter((e) => registeredEventIds.includes(e.id));
    const nowTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Live Now
    if (q.includes('live') || q.includes('live now') || q.includes('happening right now')) {
      const liveEvents = events.filter((e) => e.status === 'live');
      if (liveEvents.length > 0) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `🔴 Currently, there ${liveEvents.length === 1 ? 'is 1 event' : `are ${liveEvents.length} events`} LIVE on campus:\n\n• **${liveEvents[0].title}** at ${liveEvents[0].venue} with ${liveEvents[0].registeredCount} participants.`,
          timestamp: nowTimestamp,
          eventCards: liveEvents,
          suggestedActions: [
            { label: 'Join Live Session', actionId: 'view_event', payload: liveEvents[0].id },
            { label: 'Check my schedule', actionId: 'goto_schedule' },
          ],
        };
      } else {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'There are no events streaming live right now. Would you like to check upcoming events today?',
          timestamp: nowTimestamp,
          suggestedActions: [{ label: 'What is happening today?', actionId: 'query_today' }],
        };
      }
    }

    // 2. Schedule conflicts
    if (q.includes('conflict') || q.includes('overlap') || q.includes('clash')) {
      // Check for overlap among registered events
      const conflicts: { eventA: CollegeEvent; eventB: CollegeEvent }[] = [];
      for (let i = 0; i < registeredEvents.length; i++) {
        for (let j = i + 1; j < registeredEvents.length; j++) {
          const a = registeredEvents[i];
          const b = registeredEvents[j];
          if (a.date === b.date && a.rawStartHour < b.rawEndHour && a.rawEndHour > b.rawStartHour) {
            conflicts.push({ eventA: a, eventB: b });
          }
        }
      }

      if (conflicts.length > 0) {
        const pair = conflicts[0];
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ **Schedule Conflict Detected!**\nYou have overlapping registered events on ${pair.eventA.date}:\n\n1. **${pair.eventA.title}** (${pair.eventA.startTime} - ${pair.eventA.endTime})\n2. **${pair.eventB.title}** (${pair.eventB.startTime} - ${pair.eventB.endTime})\n\nWe recommend visiting your schedule to review and manage registrations.`,
          timestamp: nowTimestamp,
          eventCards: [pair.eventA, pair.eventB],
          suggestedActions: [{ label: 'Open My Schedule', actionId: 'goto_schedule' }],
        };
      } else {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: '✅ Great news! Your current schedule has zero conflicts. All your registered sessions have distinct time slots.',
          timestamp: nowTimestamp,
          suggestedActions: [{ label: 'View My Schedule', actionId: 'goto_schedule' }],
        };
      }
    }

    // 3. Registered events / What am I registered for?
    if (q.includes('registered') || q.includes('my events') || q.includes('what am i signed up for') || q.includes('enrolled')) {
      if (registeredEvents.length === 0) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `You haven't registered for any events yet, ${currentUser.name.split(' ')[0]}. Discover workshops, hackathons, and symposiums happening across colleges right now!`,
          timestamp: nowTimestamp,
          suggestedActions: [{ label: 'Explore Events', actionId: 'goto_discover' }],
        };
      }

      const listStr = registeredEvents.map((e, idx) => `${idx + 1}. **${e.title}** (${e.date}, ${e.startTime})`).join('\n');
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `You are currently registered for **${registeredEvents.length} events**:\n\n${listStr}`,
        timestamp: nowTimestamp,
        eventCards: registeredEvents.slice(0, 2),
        suggestedActions: [
          { label: 'View All Registered Events', actionId: 'goto_my_events' },
          { label: 'Check Schedule Timeline', actionId: 'goto_schedule' },
        ],
      };
    }

    // 4. Next event / What is my next event?
    if (q.includes('next event') || q.includes('upcoming event') || q.includes('when is my next')) {
      const live = registeredEvents.find((e) => e.status === 'live');
      if (live) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `Your current event **${live.title}** is LIVE NOW at ${live.venue}!`,
          timestamp: nowTimestamp,
          eventCards: [live],
          suggestedActions: [{ label: 'Join Live Now', actionId: 'view_event', payload: live.id }],
        };
      }

      const upcoming = registeredEvents.find((e) => e.status === 'upcoming');
      if (upcoming) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `Your next upcoming event is **${upcoming.title}** on ${upcoming.date} at ${upcoming.startTime} in ${upcoming.venue}.`,
          timestamp: nowTimestamp,
          eventCards: [upcoming],
          suggestedActions: [{ label: 'View Event Details', actionId: 'view_event', payload: upcoming.id }],
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'You do not have any upcoming registered events scheduled. Check the Discover tab to find events matching your interests!',
        timestamp: nowTimestamp,
        suggestedActions: [{ label: 'Discover Events', actionId: 'goto_discover' }],
      };
    }

    // 5. Hackathons
    if (q.includes('hackathon') || q.includes('coding') || q.includes('hack')) {
      const hackathons = events.filter((e) => e.category.toLowerCase().includes('hackathon') || e.tags.some((t) => t.toLowerCase().includes('hackathon')));
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Found **${hackathons.length} hackathon opportunities** across partnered colleges:`,
        timestamp: nowTimestamp,
        eventCards: hackathons,
        suggestedActions: [{ label: 'Explore Hackathons', actionId: 'filter_hackathon' }],
      };
    }

    // 6. Workshops
    if (q.includes('workshop') || q.includes('training') || q.includes('hands-on')) {
      const workshops = events.filter((e) => e.category.toLowerCase().includes('workshop'));
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here are ${workshops.length} hands-on workshops available on EventHub:`,
        timestamp: nowTimestamp,
        eventCards: workshops.slice(0, 3),
        suggestedActions: [{ label: 'View All Workshops', actionId: 'filter_workshop' }],
      };
    }

    // 7. Today's events
    if (q.includes('today') || q.includes('what’s happening today') || q.includes('happening today')) {
      // In our mock, '2026-09-30' is simulated as current active day
      const todayEvents = events.filter((e) => e.date === '2026-09-30' || e.status === 'live');
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here are the active campus events today (Sept 30, 2026):\n\n• **${todayEvents[0]?.title || 'MongoDB Tech Odyssey'}** (Status: LIVE NOW) at KIOT Innovation Lab.`,
        timestamp: nowTimestamp,
        eventCards: todayEvents,
        suggestedActions: [{ label: 'Join MongoDB Session', actionId: 'view_event', payload: 'evt-101' }],
      };
    }

    // 8. KIOT specific
    if (q.includes('kiot') || q.includes('my college') || q.includes('knowledge institute')) {
      const kiotEvents = events.filter((e) => e.college.includes('KIOT') || e.college.includes('Knowledge'));
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here are **${kiotEvents.length} events** hosted on-campus at Knowledge Institute of Technology (KIOT):`,
        timestamp: nowTimestamp,
        eventCards: kiotEvents.slice(0, 3),
        suggestedActions: [{ label: 'Filter My College', actionId: 'filter_my_college' }],
      };
    }

    // 9. Technology events
    if (q.includes('tech') || q.includes('technology') || q.includes('software') || q.includes('ai')) {
      const techEvents = events.filter((e) => e.category === 'Technology' || e.tags.includes('AI') || e.tags.includes('Cloud'));
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Here are top trending Technology & AI sessions on EventHub:`,
        timestamp: nowTimestamp,
        eventCards: techEvents.slice(0, 3),
        suggestedActions: [{ label: 'Browse Tech Category', actionId: 'filter_tech' }],
      };
    }

    // 10. How to register?
    if (q.includes('how do i register') || q.includes('how to register') || q.includes('registration process')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Registering for any college event is quick and seamless on EventHub:\n\n1. Browse events on the **Discover** tab.\n2. Click any card to open the complete details, syllabus, rules, and speakers.\n3. Click the **Register Now** button.\n4. A confirmation modal displays venue, timing, and instantly checks for any schedule clashes.\n5. Confirm to receive your digital ticket QR code and automatic calendar reminder!`,
        timestamp: nowTimestamp,
        suggestedActions: [{ label: 'Start Exploring Events', actionId: 'goto_discover' }],
      };
    }

    // Default Fallback
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `I'm EventHub AI, your campus event companion! You can ask me about live events, hackathons, workshops, checking your schedule, finding schedule conflicts, or events at KIOT and partner colleges.`,
      timestamp: nowTimestamp,
      suggestedActions: [
        { label: 'What is live now?', actionId: 'query_live' },
        { label: 'Check my schedule', actionId: 'goto_schedule' },
        { label: 'Any hackathons?', actionId: 'filter_hackathon' },
        { label: 'Do I have conflicts?', actionId: 'check_conflicts' },
      ],
    };
  }
}

export const aiAssistantService = new AIAssistantService();
