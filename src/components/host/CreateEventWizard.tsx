import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Sparkles,
  Layers,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { CollegeEvent } from '../../types';

export const CreateEventWizard: React.FC = () => {
  const { currentUser, handleCreateEvent, setActiveTab, categories } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Technology',
    college: currentUser.college,
    date: '2026-11-10',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    rawStartHour: 10.0,
    rawEndHour: 13.0,
    registrationDeadline: '2026-11-08',
    mode: 'offline' as 'online' | 'offline' | 'hybrid',
    venue: 'KIOT Seminar Hall B (Block 1)',
    meetingLink: '',
    capacity: 150,
    fee: 0,
    eligibility: 'Open to all Engineering & Arts students across batches.',
    rules: [
      'College ID card mandatory for gate entry.',
      'Active participation required for attendance certificate.',
    ],
    bannerUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Student Event', 'Innovation', 'Campus Session'],
  });

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.title.trim()) {
      alert('Please enter an event title.');
      return;
    }
    setCurrentStep((prev) => Math.min(6, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (isDraft = false) => {
    setSubmitting(true);
    try {
      const payload: Omit<CollegeEvent, 'id' | 'createdAt' | 'registeredCount' | 'waitlistCount'> = {
        title: formData.title || 'Untitled Campus Event',
        shortDescription: formData.shortDescription || 'Exciting college event hosted on campus.',
        description: formData.description || 'Comprehensive hands-on event and workshop for students.',
        category: formData.category,
        college: formData.college,
        mode: formData.mode,
        status: 'upcoming',
        approvalStatus: isDraft ? 'draft' : 'pending',
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        rawStartHour: formData.rawStartHour,
        rawEndHour: formData.rawEndHour,
        registrationDeadline: formData.registrationDeadline,
        venue: formData.venue,
        meetingLink: formData.meetingLink,
        bannerUrl: formData.bannerUrl,
        capacity: Number(formData.capacity) || 100,
        organizerName: currentUser.name,
        organizerCollege: currentUser.college,
        organizerEmail: currentUser.email,
        verificationStatus: 'pending',
        isExternal: false,
        fee: Number(formData.fee) || 0,
        eligibility: formData.eligibility,
        rules: formData.rules,
        speakers: [
          {
            id: 'spk-new-1',
            name: currentUser.name,
            role: 'Event Host & Convener',
            organization: currentUser.college,
            avatar: currentUser.avatar,
          },
        ],
        schedule: [
          { time: formData.startTime, title: 'Inauguration & Keynote', description: 'Welcome address' },
          { time: '11:30 AM', title: 'Main Session & Hands-on', description: 'Core topic breakdown' },
          { time: formData.endTime, title: 'Conclusion & Certificates', description: 'Closing remarks' },
        ],
        tags: formData.tags,
      };

      await handleCreateEvent(payload);
      setActiveTab('host-events');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    'Basic Info',
    'Date & Time',
    'Location',
    'Capacity',
    'Additional',
    'Preview & Submit',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          Create & Host New College Event
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Follow the 6-step guided wizard to draft, configure, and submit your event for institutional verification.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between">
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center relative">
                {/* Connecting Line */}
                {idx > 0 && (
                  <div
                    className={`absolute top-4 -left-1/2 w-full h-0.5 transition-colors -z-0 ${
                      currentStep >= stepNum ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}

                <button
                  onClick={() => setCurrentStep(stepNum)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 ${
                    isDone
                      ? 'bg-indigo-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 dark:ring-indigo-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                </button>
                <span
                  className={`text-xs mt-2 font-semibold hidden md:block ${
                    isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Form Containers */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 p-8 sm:p-10 shadow-xs">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 1: Basic Information
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next-Gen Robotics & Autonomous Systems Bootcamp"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Hosting College *
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.college}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Short Catchy Summary (1 sentence)
              </label>
              <input
                type="text"
                placeholder="Deep dive into ROS2, lidar mapping, and embedded motor control."
                value={formData.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Description & Syllabus
              </label>
              <textarea
                rows={4}
                placeholder="Describe what students will learn, hands-on takeaways, prerequisites, and delegate benefits."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 2: Date, Timing & Deadline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Registration Deadline *
                </label>
                <input
                  type="date"
                  value={formData.registrationDeadline}
                  onChange={(e) => updateField('registrationDeadline', e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Start Time *
                </label>
                <input
                  type="text"
                  placeholder="10:00 AM"
                  value={formData.startTime}
                  onChange={(e) => updateField('startTime', e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  End Time *
                </label>
                <input
                  type="text"
                  placeholder="01:00 PM"
                  value={formData.endTime}
                  onChange={(e) => updateField('endTime', e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 3: Venue & Delivery Mode
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Event Mode *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['offline', 'online', 'hybrid'] as const).map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => updateField('mode', m)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase transition-all ${
                      formData.mode === m
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Physical Campus Venue / Hall *
              </label>
              <input
                type="text"
                placeholder="e.g. KIOT Innovation Lab (Hall 3B, 2nd Floor)"
                value={formData.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {(formData.mode === 'online' || formData.mode === 'hybrid') && (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Virtual Meeting / Live Stream Link
                </label>
                <input
                  type="text"
                  placeholder="https://meet.google.com/xyz-abc-def"
                  value={formData.meetingLink}
                  onChange={(e) => updateField('meetingLink', e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Capacity */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 4: Participant Capacity & Registration Fee
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Maximum Seating Capacity *
                </label>
                <input
                  type="number"
                  min="10"
                  max="2000"
                  value={formData.capacity}
                  onChange={(e) => updateField('capacity', Number(e.target.value))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Once capacity is reached, students will automatically be placed on the waitlist.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Registration Fee (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.fee}
                  onChange={(e) => updateField('fee', Number(e.target.value))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Enter 0 for free student admission.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Additional Info */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step 5: Eligibility, Rules & Banner
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Eligibility
              </label>
              <input
                type="text"
                value={formData.eligibility}
                onChange={(e) => updateField('eligibility', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Banner Image URL
              </label>
              <input
                type="text"
                value={formData.bannerUrl}
                onChange={(e) => updateField('bannerUrl', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={formData.bannerUrl}
                  alt="Banner Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Preview & Submit */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Step 6: Final Review
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Ready to submit for Institutional Verification?
              </h3>
              <p className="text-xs text-slate-500">
                Once submitted, this event will be queued for Admin approval before becoming publicly discoverable.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={formData.bannerUrl}
                  alt={formData.title}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                    {formData.category} • {formData.mode.toUpperCase()}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {formData.title || 'Untitled Event'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {formData.college} • {formData.date} ({formData.startTime})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <div>Venue: <strong className="text-slate-800 dark:text-slate-200">{formData.venue}</strong></div>
                <div>Capacity: <strong className="text-slate-800 dark:text-slate-200">{formData.capacity} seats</strong></div>
                <div>Host: <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong></div>
                <div>Fee: <strong className="text-slate-800 dark:text-slate-200">{formData.fee === 0 ? 'FREE' : `₹${formData.fee}`}</strong></div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep === 6 ? (
              <>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSubmit(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSubmit(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit For Approval'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
