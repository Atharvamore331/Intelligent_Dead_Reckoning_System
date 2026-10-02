import { useToastStore } from '../../store/toastStore';

const typeStyles = {
  info: 'bg-[#1d2027] border-primary/30 text-primary',
  success: 'bg-[#1d2027] border-secondary/30 text-secondary',
  warning: 'bg-[#1d2027] border-tertiary/30 text-tertiary',
  error: 'bg-error-container border-error/30 text-on-error-container',
};

const typeIcons = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${typeStyles[toast.type]}`}
          role="alert"
        >
          <span className="material-symbols-outlined text-[20px]">
            {toast.icon || typeIcons[toast.type]}
          </span>
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
