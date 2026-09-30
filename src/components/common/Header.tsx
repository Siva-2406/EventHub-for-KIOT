import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Search,
  Bell,
  Compass,
  LayoutDashboard,
  CalendarCheck,
  CheckCircle2,
  Users,
  BarChart3,
  PlusCircle,
  Menu,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
}

export const Header: React.FC = () => {
  const {
    role,
    currentUser,
    activeTab,
    setActiveTab,
    notifications,
    unreadNotifsCount,
    events,
    openEventModal,
    handleMarkNotificationRead,
    handleMarkAllNotificationsRead,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered events for header instant autocomplete
  const searchResults = searchQuery.trim()
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.organizerName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectSearchResult = (event: typeof events[0]) => {
    openEventModal(event);
    setSearchQuery('');
    setSearchFocused(false);
  };

  const navItemsMap: Record<'student' | 'host' | 'admin', NavItem[]> = {
    student: [
      { id: 'home', label: 'Home', icon: Calendar },
      { id: 'discover', label: 'Discover', icon: Compass },
      { id: 'my-events', label: 'My Events', icon: CalendarCheck },
      { id: 'my-schedule', label: 'My Schedule', icon: Layers },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount },
      { id: 'profile', label: 'Profile', icon: Users },
    ],
    host: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'host-events', label: 'My Events', icon: Calendar },
      { id: 'create-event', label: 'Create Event', icon: PlusCircle, highlight: true },
      { id: 'participants', label: 'Participants', icon: Users },
      { id: 'host-analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'profile', label: 'Profile', icon: Users },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'admin-approvals', label: 'Approvals', icon: CheckCircle2, badge: events.filter((e) => e.approvalStatus === 'pending').length },
      { id: 'admin-events', label: 'Events', icon: Calendar },
      { id: 'admin-users', label: 'Users', icon: Users },
      { id: 'admin-categories', label: 'Categories', icon: Layers },
    ],
  };
  const navItems = navItemsMap[role];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-20 sm:h-22 gap-8 lg:gap-10">
          {/* Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setActiveTab(role === 'student' ? 'home' : 'dashboard')}
              className="flex items-center gap-3.5 text-left group"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    KIOT EventHub
                  </span>
                  <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                    KIOT Campus
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal hidden sm:block">
                  Knowledge Institute of Technology
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="hidden lg:block flex-1 max-w-md relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search KIOT events, workshops, symposiums, hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
              />
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {searchFocused && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-700/60">
                <div className="px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/40">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => handleSelectSearchResult(evt)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="min-w-0 pr-4">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {evt.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                          <span>{evt.college}</span>
                          <span>•</span>
                          <span>{evt.date}</span>
                        </div>
                      </div>
                      <span className="text-[11px] px-3 py-1 rounded-full font-medium bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shrink-0">
                        {evt.category}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    No matching events found for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    item.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-semibold'
                      : isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header Area: Notifications & User Avatar */}
          <div className="flex items-center gap-4">
            {/* Notifications Popover */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                      {unreadNotifsCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
                          {unreadNotifsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={handleMarkAllNotificationsRead}
                        className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            handleMarkNotificationRead(n.id);
                            if (n.eventId) {
                              const target = events.find((e) => e.id === n.eventId);
                              if (target) openEventModal(target);
                            }
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-4 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                            !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-400">
                        You&apos;re all caught up! No notifications.
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setNotifDropdownOpen(false);
                      }}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 p-1.5 pl-2 pr-3.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-medium text-slate-900 dark:text-white leading-none">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                  <span>{currentUser.role}</span>
                  <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <div className="px-2 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events, workshops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      item.highlight
                        ? 'bg-indigo-600 text-white col-span-2 justify-center font-semibold'
                        : isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
