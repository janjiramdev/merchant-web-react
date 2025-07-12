import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  onClick: () => void;
};

export default function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
      title="Delete"
    >
      <Trash2 size={16} className="text-gray-600" />
    </button>
  );
}