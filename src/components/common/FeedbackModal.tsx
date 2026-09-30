import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Star, MessageSquare } from 'lucide-react';

export const FeedbackModal: React.FC = () => {
  const { feedbackModalEvent, closeFeedbackModal, handleAddReview } = useApp();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!feedbackModalEvent) return null;

  const event = feedbackModalEvent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await handleAddReview(event.id, rating, comment.trim());
      setComment('');
      closeFeedbackModal();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={!!feedbackModalEvent}
      onClose={closeFeedbackModal}
      title="Event Feedback & Review"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {event.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Share your experience to help coordinators improve future campus sessions.
          </p>
        </div>

        {/* Rating Stars */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            How would you rate this event?
          </div>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            {rating === 5 && 'Outstanding ★★★★★'}
            {rating === 4 && 'Very Good ★★★★☆'}
            {rating === 3 && 'Good / Average ★★★☆☆'}
            {rating === 2 && 'Needs Improvement ★★☆☆☆'}
            {rating === 1 && 'Poor ★☆☆☆☆'}
          </div>
        </div>

        {/* Feedback Comment */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Detailed Comments & Key Takeaways</span>
          </label>
          <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What was the most useful part of this workshop? How was the venue and speaker delivery?"
            className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={closeFeedbackModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !comment.trim()}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
