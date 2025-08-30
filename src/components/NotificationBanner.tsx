import { motion, AnimatePresence } from 'motion/react';
import { X, Bell } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

export const NotificationBanner = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: '🎉 Nouvelle fonctionnalité !',
      message: 'Découvrez les communautés thématiques pour mieux organiser vos projets',
      action: {
        text: 'Explorer',
        onClick: () => window.location.href = '/communities'
      }
    }
  ]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10';
      default:
        return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-30 max-w-md mx-auto">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`card-base border p-4 mb-3 ${getNotificationStyle(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white text-sm">{notification.title}</h4>
                <p className="text-slate-300 text-sm mt-1">{notification.message}</p>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="text-blue-400 hover:text-blue-300 font-medium text-sm mt-2 transition-colors"
                  >
                    {notification.action.text} →
                  </button>
                )}
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
