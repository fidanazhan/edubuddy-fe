import React, { useState } from "react";
import { Bell, CheckCircle, XCircle, X } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    title: "New Message",
    description: "You have received a new message from John.",
    timestamp: "2 mins ago",
    type: "info",
  },
  {
    id: 2,
    title: "Payment Successful",
    description: "Your payment of $120 was successful.",
    timestamp: "10 mins ago",
    type: "success",
  },
  {
    id: 3,
    title: "System Error",
    description: "An error occurred in the system. Please try again.",
    timestamp: "1 hour ago",
    type: "error",
  },
];

const NotificationTab = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "info":
        return <Bell className="text-blue-500" />;
      case "success":
        return <CheckCircle className="text-green-500" />;
      case "error":
        return <XCircle className="text-red-500" />;
      default:
        return <Bell />;
    }
  };

  return (
    <div className="max-w-screen-lg mx-0 lg:mx-10 mt-5 lg:mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start px-4 py-3 border-b last:border-none hover:bg-gray-50 transition"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                {getIcon(notification.type)}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-semibold text-gray-800">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600">{notification.description}</p>
              <span className="text-xs text-gray-400">{notification.timestamp}</span>
            </div>
            <button
              className="text-gray-400 hover:text-red-500 transition ml-2"
              onClick={() => deleteNotification(notification.id)}
              aria-label="Delete notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-4 text-gray-600">No notifications available.</div>
        )}
      </div>
    </div>
  );
};

export default NotificationTab;
