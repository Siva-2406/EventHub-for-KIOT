import { Registration, CollegeEvent, UserProfile } from '../types';
import { INITIAL_REGISTRATIONS } from '../data/mockData';
import { eventService } from './eventService';

const REG_STORAGE_KEY = 'eventhub_registrations_v1';

class RegistrationService {
  private getStoredRegistrations(): Registration[] {
    try {
      const data = localStorage.getItem(REG_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
    return INITIAL_REGISTRATIONS;
  }

  private saveRegistrations(regs: Registration[]): void {
    try {
      localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(regs));
    } catch (e) {
      console.error('Failed to save registrations', e);
    }
  }

  async getUserRegistrations(userId: string): Promise<Registration[]> {
    const regs = this.getStoredRegistrations();
    return Promise.resolve(regs.filter((r) => r.userId === userId && r.status !== 'cancelled'));
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return Promise.resolve(this.getStoredRegistrations());
  }

  /**
   * Schedule Conflict Detector
   * Checks if candidate event overlaps with any already-registered event on the same day.
   */
  async detectConflict(
    candidateEvent: CollegeEvent,
    userId: string
  ): Promise<{ hasConflict: boolean; conflictingEvent?: CollegeEvent }> {
    const userRegs = await this.getUserRegistrations(userId);
    const activeRegEventIds = userRegs.map((r) => r.eventId);
    const allEvents = await eventService.getAllEvents();

    const registeredEvents = allEvents.filter((e) =>
      activeRegEventIds.includes(e.id) && e.id !== candidateEvent.id
    );

    for (const existing of registeredEvents) {
      // Must be on the exact same date
      if (existing.date === candidateEvent.date) {
        // Check for time overlap
        const startA = candidateEvent.rawStartHour;
        const endA = candidateEvent.rawEndHour;
        const startB = existing.rawStartHour;
        const endB = existing.rawEndHour;

        const isOverlapping = startA < endB && endA > startB;
        if (isOverlapping) {
          return { hasConflict: true, conflictingEvent: existing };
        }
      }
    }

    return { hasConflict: false };
  }

  async registerUser(
    event: CollegeEvent,
    user: UserProfile
  ): Promise<{ success: boolean; registration?: Registration; message: string; isWaitlist?: boolean }> {
    const regs = this.getStoredRegistrations();

    // Check if already registered
    const existing = regs.find((r) => r.eventId === event.id && r.userId === user.id && r.status !== 'cancelled');
    if (existing) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    // Check capacity
    const isFull = event.registeredCount >= event.capacity || event.status === 'full';

    if (isFull) {
      // Add to waitlist
      const waitlistPos = (event.waitlistCount || 0) + 1;
      const newReg: Registration = {
        id: `reg-${Date.now()}`,
        eventId: event.id,
        userId: user.id,
        registrationDate: new Date().toISOString(),
        status: 'waitlisted',
        waitlistPosition: waitlistPos,
        ticketCode: `WL-${event.id.replace('evt-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        attendedStatus: 'pending',
        studentName: user.name,
        studentEmail: user.email,
        studentCollege: user.college,
      };

      regs.push(newReg);
      this.saveRegistrations(regs);

      // Increment waitlist count
      await eventService.updateEvent(event.id, {
        waitlistCount: (event.waitlistCount || 0) + 1,
      });

      return {
        success: true,
        registration: newReg,
        isWaitlist: true,
        message: `Event is at full capacity. You've been placed on the waitlist at position #${waitlistPos}.`,
      };
    }

    // Standard Registration
    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      eventId: event.id,
      userId: user.id,
      registrationDate: new Date().toISOString(),
      status: 'registered',
      ticketCode: `EH-${event.id.replace('evt-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      attendedStatus: 'pending',
      studentName: user.name,
      studentEmail: user.email,
      studentCollege: user.college,
    };

    regs.push(newReg);
    this.saveRegistrations(regs);

    // Update event registered count
    const updatedCount = event.registeredCount + 1;
    const isNowFull = updatedCount >= event.capacity;
    await eventService.updateEvent(event.id, {
      registeredCount: updatedCount,
      status: isNowFull ? 'full' : event.status,
    });

    return {
      success: true,
      registration: newReg,
      isWaitlist: false,
      message: `Successfully registered for ${event.title}!`,
    };
  }

  async cancelRegistration(eventId: string, userId: string): Promise<boolean> {
    const regs = this.getStoredRegistrations();
    const index = regs.findIndex((r) => r.eventId === eventId && r.userId === userId && r.status !== 'cancelled');
    if (index === -1) return false;

    const wasWaitlist = regs[index].status === 'waitlisted';
    regs[index].status = 'cancelled';
    this.saveRegistrations(regs);

    const event = await eventService.getEventById(eventId);
    if (event) {
      if (wasWaitlist) {
        await eventService.updateEvent(eventId, {
          waitlistCount: Math.max(0, (event.waitlistCount || 1) - 1),
        });
      } else {
        const newCount = Math.max(0, event.registeredCount - 1);
        await eventService.updateEvent(eventId, {
          registeredCount: newCount,
          status: event.status === 'full' && newCount < event.capacity ? 'upcoming' : event.status,
        });
      }
    }

    return true;
  }

  async updateAttendance(registrationId: string, status: 'present' | 'absent'): Promise<boolean> {
    const regs = this.getStoredRegistrations();
    const index = regs.findIndex((r) => r.id === registrationId);
    if (index === -1) return false;

    regs[index].attendedStatus = status;
    if (status === 'present') {
      regs[index].status = 'attended';
    }
    this.saveRegistrations(regs);
    return true;
  }
}

export const registrationService = new RegistrationService();
