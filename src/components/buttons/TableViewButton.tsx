interface ITableViewButtonProps {
  nextView: string;
  currentView: string;
  onClick: (input: string) => void;
}

export default function TableViewButton({
  nextView,
  currentView,
  onClick,
}: ITableViewButtonProps) {
  const isActive = nextView === currentView;

  return (
    <button
      onClick={() => onClick(nextView)}
      className={`px-4 py-2 rounded-lg font-medium shadow transition ${
        isActive ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      {nextView.replace(/([A-Z])/g, ' $1').trim()}
    </button>
  );
}
