import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-navy-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xl leading-none">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
        {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;