type ViewButtonProps = {
  view: string;
  activeView: string;
  onClick: (view: string) => void;
};

export default function  ViewButton  ({ view, activeView, onClick }: ViewButtonProps) {
  const isActive = view === activeView;

  return (
    <button
      onClick={() => onClick(view)}
      className={`px-4 py-2 rounded-lg font-medium shadow transition ${
        isActive ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      {view.replace(/([A-Z])/g, ' $1').trim()}
    </button>
  );
};
