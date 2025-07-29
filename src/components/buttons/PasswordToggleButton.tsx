import EyeIcon from '../../assets/EyeIcon';
import EyeOffIcon from '../../assets/EyeOffIcon';

type ToggleProps = {
  show: boolean;
  toggle: () => void;
};

export default function PasswordToggleButton({ show, toggle }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
      aria-label={show ? 'Show password' : 'Hide password'}
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}
