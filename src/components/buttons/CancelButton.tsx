import type { ReactNode } from 'react';

interface ICancelButtonProps {
  children: ReactNode;
  onClick: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export default function CancelButton({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ICancelButtonProps) {
  return (
    <button
      type={type}
      className={`w-full rounded-lg px-5 py-2 text-white transition bg-gray-500 hover:bg-gray-700 disabled:opacity-60 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
