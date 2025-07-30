import type { InputHTMLAttributes } from 'react';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function TextField({ className, ...props }: IInputProps) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none ${
        className ?? ''
      }`}
      {...props}
      required
    />
  );
}
