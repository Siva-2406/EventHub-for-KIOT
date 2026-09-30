import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventCard } from '../events/EventCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Building,
  GraduationCap,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const DiscoverEvents: React.FC = () => {
  const { events, categories, selectedCategory, setSelectedCategory, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [collegeFilter, setCollegeFilter] = useState<'all' | 'my-college' | 'other'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'online' | 'offline' | 'hybrid'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'free'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'popular' | 'seats'>('date');

  // Filter pipeline
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Must be approved for public student discovery
      if (e.approvalStatus !== 'approved') return false;

      // Search text match
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesCollege = e.college.toLowerCase().includes(q);
        const matchesCat = e.category.toLowerCase().includes(q);
        const matchesOrg = e.organizerName.toLowerCase().includes(q);
        const matchesDesc = e.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCollege && !matchesCat && !matchesOrg && !matchesDesc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (e.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // College filter
      if (collegeFilter === 'my-college') {
        if (e.isExternal || !e.college.includes('KIOT')) return false;
      } else if (collegeFilter === 'other') {
        if (!e.isExternal && e.college.includes('KIOT')) return false;
      }

      // Mode filter
      if (modeFilter !== 'all' && e.mode !== modeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'live') {
        if (e.status !== 'live') return false;
      } else if (statusFilter === 'upcoming') {
        if (e.status !== 'upcoming') return false;
      } else if (statusFilter === 'free') {
        if (e.fee !== 0) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return b.registeredCount - a.registeredCount;
      } else if (sortBy === 'seats') {
        return (a.capacity - a.registeredCount) - (b.capacity - b.registeredCount);
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  }, [events, search, selectedCategory, collegeFilter, modeFilter, statusFilter, sortBy]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setCollegeFilter('all');
    setModeFilter('all');
    setStatusFilter('all');
    setSortBy('date');
  };

  const hasActiveFilters =
    search || selectedCategory !== 'all' || collegeFilter !== 'all' || modeFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover Campus & Inter-College Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse through hundreds of workshops, technical symposiums, hackathons, and cultural fests.
          </p>
        </div>

        {/* College Scope Filter Tabs (Requirement 16) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/80 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setCollegeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              collegeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Colleges
          </button>
          <button
            onClick={() => setCollegeFilter('my-college')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              collegeFilter === 'my-college'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>My College (KIOT)</span>
          </button>
          <button
            onClick={() => setCollegeFilter('other')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              collegeFilter === 'other'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Inter-College</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search events, workshops, hackathons, colleges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mode Dropdown */}
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as typeof modeFilter)}
            className="px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Modes</option>
            <option value="offline">Offline (On-Campus)</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">🔴 Live Now</option>
            <option value="free">Free Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">Sort: By Date</option>
            <option value="popular">Sort: Most Popular</option>
            <option value="seats">Sort: Seats Remaining</option>
          </select>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Indicators & Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Showing <strong className="text-slate-900 dark:text-white">{filteredEvents.length}</strong> events
          {collegeFilter === 'my-college' && ' at Knowledge Institute of Technology'}
          {collegeFilter === 'other' && ' at Partner Colleges'}
          {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No events match your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms, changing the category, or selecting &quot;All Colleges&quot;.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
