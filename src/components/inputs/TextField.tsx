type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function TextField({ className, ...props }: InputProps) {
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
