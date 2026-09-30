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
    <div className="space-y-8 pb-16">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Student</span>
                </span>
              </div>

              <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Building className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{currentUser.college}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{currentUser.department}</span>
                </div>
                <div className="text-slate-400">{currentUser.email}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors border border-indigo-200 dark:border-indigo-900"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Preferences'}</span>
          </button>
        </div>

        {/* Statistics Grid (Requirement 23) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {currentUser.stats.eventsRegistered}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Events Registered
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {currentUser.stats.eventsAttended}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Events Attended
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {currentUser.stats.certificates}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Certificates Earned
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="text-2xl font-black text-amber-500">
              {currentUser.stats.feedbackGiven}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Feedback Reviews
            </div>
          </div>
        </div>

        {/* Interests & Recommendation Tags */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Interests & Topic Preferences (Powers Smart Recommendations)
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
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
              <form onSubmit={handleAddInterest} className="inline-flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Add interest..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 text-xs rounded-full font-bold bg-indigo-600 text-white"
                >
                  Add
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Verified Achievements & Certificates (Requirement 24) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Achievements & Verified Certificates
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any certificate card below to view, verify, or download your authenticated digital campus credential.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => openCertificateModal(ach)}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    ✓ Verified
                  </span>
                </div>

                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                  {ach.category}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors leading-snug">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {ach.eventName}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{ach.date}</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1">
                  <span>View PDF</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
