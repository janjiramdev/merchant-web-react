import { XCircle } from 'lucide-react';

interface IFailedAlertProps {
  message?: string;
  onClose: () => void;
}

export default function FailedAlert({
  message = 'Please try again',
  onClose,
}: IFailedAlertProps) {
  return (
    <div className="fixed top-1/2 left-1/2 z-50 flex items-center justify-center gap-4 rounded-2xl bg-red-100 p-4 text-red-800 shadow-md animate-fade-in w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-red-600 hover:text-red-800 transition"
        aria-label="Close"
      >
        <XCircle className="h-6 w-6 text-red-600" />
      </button>
    </div>
  );
}
