// Notifications.jsx
import React from 'react';
import NotificationPanel from '../../reusable_components/NotificationPanel'; // Adjust path as needed

const Notifications = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100 text-gray-800 font-sans">


      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
          <NotificationPanel 
            allowDismiss={true}
            maxItems={4}
          />
        </div>
      </main>

   
    </div>
  );
};

export default Notifications;
