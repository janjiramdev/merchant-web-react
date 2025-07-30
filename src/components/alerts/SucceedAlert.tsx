import { CheckCircle } from 'lucide-react';

interface ISucceedAlertProps {
  message?: string;
}

export default function SucceedAlert({
  message = 'Account created successfully!',
}: ISucceedAlertProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-green-100 p-4 text-green-800 shadow-md animate-fade-in">
      <CheckCircle className="h-6 w-6 text-green-600" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
