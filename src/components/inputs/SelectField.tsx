type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function SelectField({
  className,
  children,
  ...props
}: SelectProps) {
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
