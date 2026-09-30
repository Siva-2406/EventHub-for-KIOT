/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { RegistrationModal } from './components/common/RegistrationModal';
import { ConflictModal } from './components/common/ConflictModal';
import { QrCodeModal } from './components/common/QrCodeModal';
import { ShareModal } from './components/common/ShareModal';
import { CertificateModal } from './components/common/CertificateModal';
import { FeedbackModal } from './components/common/FeedbackModal';
import { EventDetailModal } from './components/events/EventDetailModal';
import { EventHubAI } from './components/common/EventHubAI';

// Student Views
import { StudentHome } from './components/student/StudentHome';
import { DiscoverEvents } from './components/student/DiscoverEvents';
import { MyEvents } from './components/student/MyEvents';
import { MySchedule } from './components/student/MySchedule';
import { NotificationsView } from './components/student/NotificationsView';
import { StudentProfile } from './components/student/StudentProfile';

// Host Views
import { HostDashboard } from './components/host/HostDashboard';
import { CreateEventWizard } from './components/host/CreateEventWizard';
import { HostEventsList } from './components/host/HostEventsList';
import { ParticipantsManager } from './components/host/ParticipantsManager';
import { HostAnalytics } from './components/host/HostAnalytics';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminApprovals } from './components/admin/AdminApprovals';
import { AdminEvents } from './components/admin/AdminEvents';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminCategories } from './components/admin/AdminCategories';

import { Calendar, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, activeTab, setActiveTab } = useApp();

  const renderActiveView = () => {
    if (role === 'student') {
      switch (activeTab) {
        case 'home':
          return <StudentHome />;
        case 'discover':
          return <DiscoverEvents />;
        case 'my-events':
          return <MyEvents />;
        case 'my-schedule':
          return <MySchedule />;
        case 'notifications':
          return <NotificationsView />;
        case 'profile':
          return <StudentProfile />;
        default:
          return <StudentHome />;
      }
    }

    if (role === 'host') {
      switch (activeTab) {
        case 'dashboard':
          return <HostDashboard />;
        case 'host-events':
          return <HostEventsList />;
        case 'create-event':
          return <CreateEventWizard />;
        case 'participants':
          return <ParticipantsManager />;
        case 'host-analytics':
          return <HostAnalytics />;
        case 'profile':
          return <StudentProfile />;
        default:
          return <HostDashboard />;
      }
    }

    if (role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'admin-approvals':
          return <AdminApprovals />;
        case 'admin-events':
          return <AdminEvents />;
        case 'admin-users':
          return <AdminUsers />;
        case 'admin-categories':
          return <AdminCategories />;
        default:
          return <AdminDashboard />;
      }
    }

    return <StudentHome />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Demo Banner with Role Switcher for Judges */}
      <DemoBanner />

      {/* Global Navigation Header */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EVENTHUB
                </span>
                <p className="text-[11px] text-slate-500">
                  Every College Event. One Place. Discover. Register. Schedule. Never Miss an Event.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Phase 1 Architecture Ready for MongoDB Atlas & JWT</span>
              </span>
              <span>Knowledge Institute of Technology (KIOT)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating EventHub AI Assistant */}
      <EventHubAI />

      {/* Global Modals */}
      <EventDetailModal />
      <RegistrationModal />
      <ConflictModal />
      <QrCodeModal />
      <ShareModal />
      <CertificateModal />
      <FeedbackModal />

      {/* Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
