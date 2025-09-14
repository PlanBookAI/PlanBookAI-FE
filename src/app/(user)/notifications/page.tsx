'use client';

import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Thông báo</h1>
      <div className="bg-white rounded-lg shadow">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Bạn chưa có thông báo nào
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification: any, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                {/* Notification content will go here */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}