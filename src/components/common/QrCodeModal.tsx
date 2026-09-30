import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import { QrCode, CheckCircle2, Copy } from 'lucide-react';

export const QrCodeModal: React.FC = () => {
  const { qrModalData, closeQrModal, addToast } = useApp();

  if (!qrModalData) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrModalData.code);
    addToast('Pass Code Copied', `Copied "${qrModalData.code}" to clipboard.`, 'success');
  };

  return (
    <Modal
      isOpen={!!qrModalData}
      onClose={closeQrModal}
      title={qrModalData.type === 'ticket' ? 'Digital Event Pass' : 'Event QR Code'}
      maxWidth="sm"
    >
      <div className="text-center space-y-4 py-1">
        {/* Event Header info */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
            {qrModalData.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {qrModalData.subtitle}
          </p>
        </div>

        {/* High-Fidelity Stylized QR Matrix */}
        <div className="relative mx-auto w-56 h-56 p-4 rounded-3xl bg-white shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          {/* SVG QR Code Simulation with distinctive corner markers and matrix elements */}
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-slate-900"
            fill="currentColor"
          >
            {/* Top-Left Corner Box */}
            <rect x="15" y="15" width="50" height="50" rx="10" stroke="currentColor" strokeWidth="8" fill="none" />
            <rect x="27" y="27" width="26" height="26" rx="4" fill="currentColor" />

            {/* Top-Right Corner Box */}
            <rect x="135" y="15" width="50" height="50" rx="10" stroke="currentColor" strokeWidth="8" fill="none" />
            <rect x="147" y="27" width="26" height="26" rx="4" fill="currentColor" />

            {/* Bottom-Left Corner Box */}
            <rect x="15" y="135" width="50" height="50" rx="10" stroke="currentColor" strokeWidth="8" fill="none" />
            <rect x="27" y="147" width="26" height="26" rx="4" fill="currentColor" />

            {/* Center Brand Badge */}
            <circle cx="100" cy="100" r="18" fill="#4f46e5" />
            <text x="100" y="105" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">EH</text>

            {/* Data matrix dots pattern */}
            <rect x="75" y="20" width="10" height="10" rx="2" />
            <rect x="95" y="20" width="10" height="10" rx="2" />
            <rect x="115" y="20" width="10" height="10" rx="2" />
            <rect x="75" y="40" width="10" height="10" rx="2" />
            <rect x="115" y="40" width="10" height="10" rx="2" />

            <rect x="20" y="75" width="10" height="10" rx="2" />
            <rect x="40" y="75" width="10" height="10" rx="2" />
            <rect x="60" y="75" width="10" height="10" rx="2" />
            <rect x="130" y="75" width="10" height="10" rx="2" />
            <rect x="150" y="75" width="10" height="10" rx="2" />
            <rect x="170" y="75" width="10" height="10" rx="2" />

            <rect x="20" y="95" width="10" height="10" rx="2" />
            <rect x="60" y="95" width="10" height="10" rx="2" />
            <rect x="130" y="95" width="10" height="10" rx="2" />
            <rect x="170" y="95" width="10" height="10" rx="2" />

            <rect x="20" y="115" width="10" height="10" rx="2" />
            <rect x="40" y="115" width="10" height="10" rx="2" />
            <rect x="150" y="115" width="10" height="10" rx="2" />

            <rect x="75" y="135" width="10" height="10" rx="2" />
            <rect x="95" y="135" width="10" height="10" rx="2" />
            <rect x="115" y="135" width="10" height="10" rx="2" />
            <rect x="135" y="135" width="10" height="10" rx="2" />
            <rect x="155" y="135" width="10" height="10" rx="2" />

            <rect x="75" y="155" width="10" height="10" rx="2" />
            <rect x="115" y="155" width="10" height="10" rx="2" />
            <rect x="155" y="155" width="10" height="10" rx="2" />

            <rect x="75" y="175" width="10" height="10" rx="2" />
            <rect x="95" y="175" width="10" height="10" rx="2" />
            <rect x="135" y="175" width="10" height="10" rx="2" />
            <rect x="175" y="175" width="10" height="10" rx="2" />
          </svg>

          {/* Verification Badge */}
          <div className="absolute -bottom-3 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>AUTHENTICATED PASS</span>
          </div>
        </div>

        {/* Code & Copy button */}
        <div className="pt-2">
          <div className="text-[11px] text-slate-400 font-medium">Scan to check-in at venue or share:</div>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {qrModalData.code}
            </code>
            <button
              onClick={handleCopyCode}
              title="Copy code"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={closeQrModal}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Close Pass
        </button>
      </div>
    </Modal>
  );
};
