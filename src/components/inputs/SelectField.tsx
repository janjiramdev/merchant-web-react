import type { InputHTMLAttributes, ReactNode } from 'react';

interface ISelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  className?: string;
}

export default function SelectField({
  className,
  children,
  ...props
}: ISelectProps) {
  return (
    <select
      className={`w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none ${className ?? ''}`}
      {...props}
      required
    >
      {children}
    </select>
  );
}
