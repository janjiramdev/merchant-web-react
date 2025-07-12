import * as React from 'react';

type CancelButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function CancelButton({
  children,
  type = 'button',
  className = '',
  disabled = false,
  onClick,
}: CancelButtonProps) {
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
