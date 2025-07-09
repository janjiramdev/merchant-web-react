import { XCircle } from 'lucide-react';

type FailedAlertProps = {
  message?: string;
};

export default function FailedAlert({
  message = 'Please try again',
}: FailedAlertProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-red-100 p-4 text-red-800 shadow-md animate-fade-in">
      <XCircle className="h-6 w-6 text-red-600" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
