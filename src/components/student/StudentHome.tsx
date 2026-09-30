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
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-indigo-800/50 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Discover. Register. Schedule. Never Miss an Event.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Every College Event. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              One Place.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Discover workshops, hackathons, symposiums, cultural events, sports, career opportunities, and inter-college summits — all unified under one verified platform.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('discover')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white text-indigo-950 hover:bg-slate-100 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setRole('host');
                setActiveTab('create-event');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-indigo-300" />
              <span>Host / Create Event</span>
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400 font-medium mr-1">Popular:</span>
            {heroCategories.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedCategory(c.query);
                  setActiveTab('discover');
                }}
                className="px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-colors"
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Recommended For You
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personalized for {currentUser.name} based on your interests: {currentUser.interests.slice(0, 3).join(', ')}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* Inter-College Opportunities */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Inter-College Opportunities
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Partner Campuses
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Hackathons and symposiums hosted at partner universities open for KIOT students
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interCollegeEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>

      {/* Trending & Upcoming Events */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Trending Upcoming Events
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rapidly filling workshops and events scheduled this month
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>Browse All ({publicEvents.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </section>
    </div>
  );
};
