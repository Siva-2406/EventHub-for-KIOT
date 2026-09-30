import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { Award, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';

export const CertificateModal: React.FC = () => {
  const { certificateModalAchievement, closeCertificateModal, currentUser, addToast } = useApp();

  if (!certificateModalAchievement) return null;

  const cert = certificateModalAchievement;

  const handleDownload = () => {
    addToast('Certificate Saved', 'PDF Certificate certificate generation simulated.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!certificateModalAchievement}
      onClose={closeCertificateModal}
      title="Verified Digital Certificate"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Certificate Canvas / Rendered Preview */}
        <div className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-indigo-50/50 border-8 border-double border-indigo-900/20 text-slate-800 shadow-xl overflow-hidden text-center">
          {/* Watermark Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-80 h-80 text-indigo-900" />
          </div>

          {/* Certificate Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-indigo-100 text-indigo-900 mb-3 border border-indigo-200">
              <Award className="w-3.5 h-3.5 text-indigo-700" />
              <span>EventHub Verified Accreditation</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 uppercase">
              Certificate of Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              This credential certifies active participation and successful completion
            </p>
          </div>

          {/* Student Recipient Name */}
          <div className="my-6 relative z-10">
            <div className="text-xs uppercase tracking-wider text-slate-400">Awarded to</div>
            <div className="text-xl sm:text-2xl font-bold font-serif text-indigo-950 underline decoration-indigo-300 underline-offset-8 mt-1">
              {currentUser.name}
            </div>
            <div className="text-xs text-slate-600 mt-2 font-medium">
              {currentUser.department} • {currentUser.college}
            </div>
          </div>

          {/* Event Context & Description */}
          <div className="relative z-10 max-w-lg mx-auto text-xs text-slate-600 leading-relaxed bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-slate-200/60 shadow-inner">
            <span className="font-semibold text-slate-900 block mb-1">
              In recognition of participation in:
            </span>
            <span className="font-bold text-indigo-700 text-sm block">
              {cert.eventName}
            </span>
            <p className="mt-1 text-[11px] text-slate-500">
              {cert.description}
            </p>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="grid grid-cols-3 items-end gap-2 mt-8 pt-4 border-t border-slate-200 relative z-10 text-left">
            <div>
              <div className="font-script text-sm text-slate-700 italic">Dr. S. Meenakshi</div>
              <div className="text-[10px] text-slate-500 border-t border-slate-400/50 pt-1 mt-1 font-semibold uppercase">
                Program Convener
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-700/80 bg-indigo-50 flex items-center justify-center text-indigo-700 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                Official Seal
              </span>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-800">{cert.date}</div>
              <div className="text-[10px] text-slate-500 border-t border-slate-400/50 pt-1 mt-1 font-semibold uppercase">
                Date Issued
              </div>
            </div>
          </div>

          {/* Certificate ID */}
          <div className="mt-4 pt-2 text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Credential ID: {cert.certificateId}</span>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={closeCertificateModal}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
