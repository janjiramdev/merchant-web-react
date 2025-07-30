import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import Modal from '../components/modals/Modal';
import { useSession } from '../contexts/sessions/SessionContext';
import GetProfileFeature from './GetProfile';

export default function NavBar() {
  const navigate = useNavigate();
  const { sessionUser, removeTokens } = useSession();

  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogout = () => {
    removeTokens();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <>
      <header className="flex items-center justify-between bg-blue-500 text-white px-6 py-4 shadow-md">
        <div className="text-xl font-bold tracking-wide">MERCHANT</div>

        <div className="flex items-center gap-4">
          <GetProfileFeature username={sessionUser?.username ?? 'Guest'} />
          <button
            onClick={() => setShowLogoutModal(true)}
            className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {showLogoutModal && (
        <Modal title="Confirm Logout" onClose={() => setShowLogoutModal(false)}>
          <p>Are you sure you want to logout?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setShowLogoutModal(false)}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={handleLogout}>Confirm</ConfirmButton>
          </div>
        </Modal>
      )}
    </>
  );
}
