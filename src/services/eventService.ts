import { CollegeEvent } from '../types';
import { INITIAL_EVENTS } from '../data/mockData';

const STORAGE_KEY = 'eventhub_events_v1';

class EventService {
  private getStoredEvents(): CollegeEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    // Initialize
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }

  private saveEvents(events: CollegeEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events to local storage', e);
    }
  }

  async getAllEvents(): Promise<CollegeEvent[]> {
    return new Promise((resolve) => {
      // In Phase 2: return fetch('/api/events').then(res => res.json())
      setTimeout(() => {
        resolve(this.getStoredEvents());
      }, 50);
    });
  }

  async getEventById(id: string): Promise<CollegeEvent | null> {
    const events = this.getStoredEvents();
    const event = events.find((e) => e.id === id) || null;
    return Promise.resolve(event);
  }

  async createEvent(eventData: Omit<CollegeEvent, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'>): Promise<CollegeEvent> {
    const events = this.getStoredEvents();
    const newEvent: CollegeEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      waitlistCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      feedbackStats: {
        averageRating: 5.0,
        totalReviews: 0,
        reviews: [],
      },
    };

    events.unshift(newEvent);
    this.saveEvents(events);
    return Promise.resolve(newEvent);
  }

  async updateEvent(id: string, updates: Partial<CollegeEvent>): Promise<CollegeEvent | null> {
    const events = this.getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    events[index] = { ...events[index], ...updates };
    this.saveEvents(events);
    return Promise.resolve(events[index]);
  }

  async setApprovalStatus(id: string, approvalStatus: 'approved' | 'rejected'): Promise<CollegeEvent | null> {
    const events = this.getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    events[index].approvalStatus = approvalStatus;
    if (approvalStatus === 'approved') {
      events[index].verificationStatus = 'verified';
    } else {
      events[index].verificationStatus = 'rejected';
    }
    this.saveEvents(events);
    return Promise.resolve(events[index]);
  }

  async resetToDefault(): Promise<CollegeEvent[]> {
    localStorage.removeItem(STORAGE_KEY);
    return this.getAllEvents();
  }
}

export const eventService = new EventService();
