import { AppNotification } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

const NOTIF_STORAGE_KEY = 'eventhub_notifications_v1';

class NotificationService {
  private getStoredNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }

  private saveNotifications(notifs: AppNotification[]): void {
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  }

  async getNotifications(userId: string): Promise<AppNotification[]> {
    const list = this.getStoredNotifications();
    return Promise.resolve(list.filter((n) => n.userId === userId));
  }

  async markAsRead(id: string): Promise<void> {
    const list = this.getStoredNotifications();
    const item = list.find((n) => n.id === id);
    if (item) {
      item.read = true;
      this.saveNotifications(list);
    }
    return Promise.resolve();
  }

  async markAllAsRead(userId: string): Promise<void> {
    const list = this.getStoredNotifications();
    list.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.saveNotifications(list);
    return Promise.resolve();
  }

  async addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): Promise<AppNotification> {
    const list = this.getStoredNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    list.unshift(newNotif);
    this.saveNotifications(list);
    return Promise.resolve(newNotif);
  }
}

export const notificationService = new NotificationService();
