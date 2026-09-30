import React from 'react';
import { useApp } from '../../context/AppContext';
import { LiveNowBanner } from '../events/LiveNowBanner';
import { EventCard } from '../events/EventCard';
import {
  Compass,
  PlusCircle,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Globe,
  CheckCircle,
} from 'lucide-react';

export const StudentHome: React.FC = () => {
  const { events, currentUser, setActiveTab, setRole, setSelectedCategory } = useApp();

  // Published events only
  const publicEvents = events.filter((e) => e.approvalStatus === 'approved');

  // Rule-based personalized recommendations based on student's interests
  // (Interests: Technology, Hackathons, AI, Workshops)
  const recommendedEvents = publicEvents.filter((e) => {
    return (
      currentUser.interests.some((interest) =>
        e.category.toLowerCase().includes(interest.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(interest.toLowerCase()))
      ) && e.status !== 'completed'
    );
  }).slice(0, 3);

  // Inter-College events (events outside KIOT)
  const interCollegeEvents = publicEvents.filter((e) => e.isExternal && e.status !== 'completed').slice(0, 3);

  // Trending / upcoming events
  const trendingEvents = publicEvents.filter((e) => e.status === 'upcoming').slice(0, 3);

  const heroCategories = [
    { label: 'Hackathons', icon: 'Code', query: 'Hackathon' },
    { label: 'Workshops', icon: 'Wrench', query: 'Workshop' },
    { label: 'Technology & AI', icon: 'Cpu', query: 'Technology' },
    { label: 'Symposiums', icon: 'Layers', query: 'Symposium' },
    { label: 'Cultural & Sports', icon: 'Trophy', query: 'Sports' },
  ];

  return (
    <div className="space-y-24 sm:space-y-28 pb-28">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-10 sm:p-16 lg:p-20 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-9">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Knowledge Institute of Technology (KIOT) • Salem, Tamil Nadu</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Every KIOT Event. <br />
            <span className="text-indigo-400">
              One Place.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            Discover workshops, symposiums, hackathons, technical paper presentations, cultural fests, sports meets, and inter-college opportunities — all unified for KIOT students.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-5 pt-3">
            <button
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore KIOT Events</span>
              <ArrowRight className="w-4 h-4 text-indigo-200" />
            </button>

            <button
              onClick={() => {
                setRole('host');
                setActiveTab('create-event');
              }}
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-slate-400" />
              <span>Host KIOT Event</span>
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-medium mr-1.5">Popular:</span>
            {heroCategories.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedCategory(c.query);
                  setActiveTab('discover');
                }}
                className="px-4 py-2 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 transition-colors"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 🔴 LIVE NOW Major Differentiator */}
      <section>
        <LiveNowBanner />
      </section>

      {/* Recommended For You (Personalized Discovery) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Personalized for {currentUser.name} based on your interests: {currentUser.interests.slice(0, 3).join(', ')}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {recommendedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* Inter-College Opportunities */}
      <section className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Inter-College Opportunities
              </h2>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Partner Campuses
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Hackathons and symposiums hosted at partner universities open for KIOT students
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {interCollegeEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* Trending & Upcoming Events */}
      <section className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Trending Upcoming Events at KIOT
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Rapidly filling workshops and events scheduled across KIOT engineering departments
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Browse All ({publicEvents.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {trendingEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>
    </div>
  );
};
