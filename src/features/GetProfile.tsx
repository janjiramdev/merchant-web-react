import { getUser } from '../services/usersService';
import { useState } from 'react';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import EditProfileFeature from './EditProfile';
import FailedAlert from '../components/alerts/FailedAlert';
import Modal from '../components/modals/Modal';

type GetProfileFeatureProps = {
  username: string | null;
};

export default function GetProfileFeature({
  username,
}: GetProfileFeatureProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setShowEditProfile(false);
  };

  const fetchUser = async () => {
    if (!username) {
      setErrorMessage('invalid username');
      return;
    }
    try {
      const data = await getUser(username);
      if (Array.isArray(data) && data.length > 0) {
        setUser(data[0]);
        setIsModalOpen(true);
      } else {
        setErrorMessage('user not found');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('failed to get user');
    }
  };

  return (
    <>
      {username && (
        <button
          onClick={fetchUser}
          className="font-medium hover:text-black transition-colors"
        >
          {username}
        </button>
      )}

      {isModalOpen && user && (
        <Modal title="User Profile" onClose={() => setIsModalOpen(false)}>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="text-right font-medium text-gray-600">
              Username:
            </div>
            <div className="text-left">{user.username}</div>

            <div className="text-right font-medium text-gray-600">
              Firstname:
            </div>
            <div className="text-left">{user.firstName}</div>

            <div className="text-right font-medium text-gray-600">
              Lastname:
            </div>
            <div className="text-left">{user.lastName}</div>

            <div className="text-right font-medium text-gray-600">Gender:</div>
            <div className="text-left">{user.gender}</div>

            <div className="text-right font-medium text-gray-600">Age:</div>
            <div className="text-left">{user.age}</div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setIsModalOpen(false)}>
              Close
            </CancelButton>

            <ConfirmButton
              onClick={() => {
                setIsModalOpen(false);
                setShowEditProfile(true);
                setIsEditModalOpen(true);
              }}
            >
              Edit
            </ConfirmButton>
          </div>
        </Modal>
      )}

      {showEditProfile && user && (
        <EditProfileFeature
          user={user}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}

      {errorMessage && (
        <FailedAlert
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}
    </>
  );
}
