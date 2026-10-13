import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGym();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto rounded-2xl p-4 shadow-xl border backdrop-blur-md flex items-start gap-3.5 bg-white/95 ${
                isSuccess
                  ? 'border-emerald-200 text-slate-800'
                  : isWarning
                  ? 'border-amber-200 text-slate-800'
                  : isError
                  ? 'border-rose-200 text-slate-800'
                  : 'border-sky-200 text-slate-800'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
                {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-sky-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
