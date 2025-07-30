import { Pencil } from 'lucide-react';

interface IEditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: IEditButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
      title="Edit"
    >
      <Pencil size={16} className="text-gray-600" />
    </button>
  );
}
