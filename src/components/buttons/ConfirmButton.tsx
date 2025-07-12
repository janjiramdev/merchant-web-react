import * as React from 'react';

type ConfirmButtonProps = {
  onClick?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
};

export default function ConfirmButton({
  onClick,
  isLoading,
  children,
  type = 'button',
  className = '',
  disabled = false,
}: ConfirmButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`w-full rounded-lg px-5 py-2 text-white transition bg-blue-500 hover:bg-blue-700 disabled:opacity-60  ${className}`}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
