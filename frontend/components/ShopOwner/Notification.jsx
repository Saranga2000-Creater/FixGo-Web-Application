// Notification.jsx
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faStar, faClipboard, faComment } from '@fortawesome/free-solid-svg-icons';

function Notification() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New service request from Sanduni J.',
            subtitle: 'Toyota Prius · Engine Overheating',
            timestamp: '10 min ago',
            icon: faWrench,
            iconBg: 'bg-orange-300',
            isUnread: true,
        },
        {
            id: 2,
            title: 'Repair completed for Kavindu P.',
            subtitle: 'Honda Fit · Oil Change',
            timestamp: '1 hr ago',
            icon: faWrench,
            iconBg: 'bg-orange-300',
            isUnread: true,
        },
        {
            id: 3,
            title: 'New 5-star review from Sanduni Jayawardhana',
            subtitle: '"Excellent service!"',
            timestamp: '2 hrs ago',
            icon: faStar,
            iconBg: 'bg-yellow-300',
            isUnread: false,
        },
        {
            id: 4,
            title: 'New service request from Nimal C.',
            subtitle: 'Suzuki Alto · Brake Pad Replacement',
            timestamp: '3 hrs ago',
            icon: faClipboard,
            iconBg: 'bg-pink-200',
            isUnread: false,
        },
        {
            id: 5,
            title: 'Message from Madushan G.',
            subtitle: 'Query about clutch repair estimate.',
            timestamp: '5 hrs ago',
            icon: faComment,
            iconBg: 'bg-purple-200',
            isUnread: false,
        },
    ]);

    const markAsRead = (id) => {
        setNotifications(
            notifications.map((notif) =>
                notif.id === id ? { ...notif, isUnread: false } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(
            notifications.map((notif) => ({ ...notif, isUnread: false }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter((notif) => notif.id !== id));
    };

    const unreadCount = notifications.filter((n) => n.isUnread).length;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-500">Stay updated with your shop activity.</p>
            </div>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
                <button
                    onClick={markAllAsRead}
                    className="mb-6 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                    Mark all as read ({unreadCount})
                </button>
            )}

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No notifications</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`p-4 rounded-lg flex items-start gap-4 cursor-pointer transition-all ${
    notification.isUnread
        ? 'bg-green-50 hover:bg-green-100'
        : 'bg-white hover:bg-gray-50'
} border border-gray-200 hover:border-gray-300`}
                        >
                            {/* Icon */}
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0 ${notification.iconBg}`}
                            >
                                <FontAwesomeIcon
                                    icon={notification.icon}
                                    className="text-lg text-white"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-base">
                                    {notification.title}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {notification.subtitle}
                                </p>
                            </div>

                            {/* Timestamp and Unread Indicator */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-gray-400 text-xs whitespace-nowrap">
                                    {notification.timestamp}
                                </span>
                                {notification.isUnread && (
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full flex-shrink-0"></div>
                                )}
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                }}
                                className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 ml-2"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Notification;

