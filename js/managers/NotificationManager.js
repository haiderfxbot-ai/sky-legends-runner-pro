class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 3000;
    }

    show(config) {
        const {
            title,
            message,
            type = 'info',
            duration = this.defaultDuration,
            icon = null
        } = config;

        if (this.notifications.length >= this.maxNotifications) {
            this.dismiss(this.notifications[0]);
        }

        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${icon || this.getDefaultIcon(type)}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        this.applyStyles(notification, type);
        container.appendChild(notification);

        const notifData = { element: notification, timeout: null };
        this.notifications.push(notifData);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        notifData.timeout = setTimeout(() => {
            this.dismiss(notifData);
        }, duration);

        notification.addEventListener('click', () => {
            this.dismiss(notifData);
        });

        return notifData;
    }

    applyStyles(notification, type) {
        const colors = {
            info: '#6750A4',
            success: '#4CAF50',
            warning: '#FFC107',
            error: '#F44336',
            achievement: '#FFD700',
            reward: '#00E5FF'
        };

        notification.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: linear-gradient(135deg, #1E1E1E, #2a2a2a);
            border-radius: 12px;
            border-left: 4px solid ${colors[type] || colors.info};
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            cursor: pointer;
            transform: translateX(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
            margin-bottom: 8px;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .notification.show {
                transform: translateX(0) !important;
                opacity: 1 !important;
            }
            .notification-title {
                font-family: 'Poppins', sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: #FFFFFF;
                margin-bottom: 2px;
            }
            .notification-message {
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
            }
            .notification-icon {
                font-size: 24px;
                min-width: 32px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    getDefaultIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            achievement: '🏆',
            reward: '🎁'
        };
        return icons[type] || icons.info;
    }

    dismiss(notifData) {
        if (!notifData || !notifData.element) return;

        if (notifData.timeout) {
            clearTimeout(notifData.timeout);
        }

        notifData.element.classList.remove('show');
        notifData.element.style.transform = 'translateX(-100%)';
        notifData.element.style.opacity = '0';

        setTimeout(() => {
            if (notifData.element.parentNode) {
                notifData.element.parentNode.removeChild(notifData.element);
            }
            const index = this.notifications.indexOf(notifData);
            if (index !== -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    info(title, message, icon) {
        return this.show({ title, message, type: 'info', icon });
    }

    success(title, message, icon) {
        return this.show({ title, message, type: 'success', icon });
    }

    warning(title, message, icon) {
        return this.show({ title, message, type: 'warning', icon });
    }

    error(title, message, icon) {
        return this.show({ title, message, type: 'error', icon });
    }

    achievement(title, message) {
        return this.show({ title, message, type: 'achievement', icon: '🏆' });
    }

    reward(title, message) {
        return this.show({ title, message, type: 'reward', icon: '🎁' });
    }

    clearAll() {
        this.notifications.forEach(notif => {
            this.dismiss(notif);
        });
    }
}

const notificationManager = new NotificationManager();
