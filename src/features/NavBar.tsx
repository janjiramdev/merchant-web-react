import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between bg-blue-500 text-white px-6 py-4 shadow-md">
      <div className="text-xl font-bold tracking-wide"> MERCHANT</div>

      <div className="flex items-center gap-4">
        {username && <span className="font-medium">{username}</span>}

        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
