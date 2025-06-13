import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications"
           class="notification"
           [ngClass]="'notification-' + notification.type"
           (click)="removeNotification(notification.id)">
        <div class="notification-icon">
          {{ getIcon(notification.type) }}
        </div>
        <div class="notification-content">
          <span>{{ notification.message }}</span>
        </div>
        <button class="notification-close"
                (click)="removeNotification(notification.id)">
          ✕
        </button>
      </div>
    </div>
  `,
    styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit, OnDestroy {
    notifications: Notification[] = [];
    private subscription?: Subscription;

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.subscription = this.notificationService.notifications$.subscribe(
            notifications => this.notifications = notifications
        );
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    removeNotification(id: string) {
        this.notificationService.removeNotification(id);
    }

    getIcon(type: string): string {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return 'ℹ️';
        }
    }
}
