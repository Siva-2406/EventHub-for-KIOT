import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Building,
  GraduationCap,
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  CalendarCheck,
  MessageSquare,
  Edit3,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser, achievements, openCertificateModal, addToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [interests, setInterests] = useState(currentUser.interests);
  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    if (!interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      addToast('Interests Updated', `Added "${newInterest.trim()}" to your preferences.`, 'info');
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-24">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 p-8 sm:p-12 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6 sm:gap-8">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-xs shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Student</span>
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Building className="w-4 h-4 text-indigo-500" />
                  <span>{currentUser.college}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>{currentUser.department}</span>
                </div>
                <div className="text-slate-400">{currentUser.email}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Done Editing' : 'Edit Preferences'}</span>
          </button>
        </div>

        {/* Statistics Grid (Requirement 23) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {currentUser.stats.eventsRegistered}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5">
              Events Registered
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {currentUser.stats.eventsAttended}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5">
              Events Attended
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">
              {currentUser.stats.certificates}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5">
              Certificates Earned
            </div>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500">
              {currentUser.stats.feedbackGiven}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5">
              Feedback Reviews
            </div>
          </div>
        </div>

        {/* Interests & Recommendation Tags */}
        <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Interests & Topic Preferences (Powers Smart Recommendations)
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
              >
                <span>{tag}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveInterest(tag)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}

            {isEditing && (
              <form onSubmit={handleAddInterest} className="inline-flex items-center gap-2.5">
                <input
                  type="text"
                  placeholder="Add interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="px-4 py-2 text-xs sm:text-sm rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs sm:text-sm rounded-full font-semibold bg-indigo-600 text-white"
                >
                  Add
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Verified Achievements & Certificates (Requirement 24) */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                My Achievements & Verified Certificates
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click any certificate card below to view, verify, or download your authenticated digital campus credential.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => openCertificateModal(ach)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 p-8 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all duration-300 flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    ✓ Verified
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">
                  {ach.category}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                  {ach.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {ach.eventName}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <span>{ach.date}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1.5">
                  <span>View PDF</span>
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
