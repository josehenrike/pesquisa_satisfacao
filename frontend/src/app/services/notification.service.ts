import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4000) {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, notification]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }
  }

  removeNotification(id: string) {
    const currentNotifications = this.notifications.value;
    const filteredNotifications = currentNotifications.filter(notification => notification.id !== id);
    this.notifications.next(filteredNotifications);
  }

  clearAllNotifications() {
    this.notifications.next([]);
  }

  success(message: string, duration?: number) {
    this.showNotification(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.showNotification(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.showNotification(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    this.showNotification(message, 'info', duration);
  }
}
