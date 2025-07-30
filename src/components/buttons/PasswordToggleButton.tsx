import EyeCloseIcon from '../../assets/icons/EyeCloseIcon';
import EyeOpenIcon from '../../assets/icons/EyeOpenIcon';

interface IShowPasswordToggleButtonProps {
  isShow: boolean;
  onClick: () => void;
}

export default function ShowPasswordToggleButton({
  isShow,
  onClick,
}: IShowPasswordToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
      aria-label={isShow ? 'Show password' : 'Hide password'}
    >
      {isShow ? <EyeCloseIcon /> : <EyeOpenIcon />}
    </button>
  );
}
