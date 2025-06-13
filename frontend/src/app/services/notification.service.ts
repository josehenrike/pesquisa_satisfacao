import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() { }

  success(message: string, duration: number = 3000) {
    this.addNotification('success', message, duration);
  }

  error(message: string, duration: number = 5000) {
    this.addNotification('error', message, duration);
  }

  warning(message: string, duration: number = 4000) {
    this.addNotification('warning', message, duration);
  }

  info(message: string, duration: number = 3000) {
    this.addNotification('info', message, duration);
  }

  private addNotification(type: Notification['type'], message: string, duration: number) {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      message,
      duration
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remover notificação após duração especificada
    setTimeout(() => {
      this.removeNotification(id);
    }, duration);
  }

  removeNotification(id: string) {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
