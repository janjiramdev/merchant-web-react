import { useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import Modal from '../components/modals/Modal';
import type { IUser } from '../interfaces/features.interface';
import { getUser } from '../services/usersService';
import EditProfileFeature from './EditProfile';

interface GetProfileFeatureProps {
  username: string | undefined;
}

export default function GetProfile({ username }: GetProfileFeatureProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchUser = async () => {
    if (!username) return;

    try {
      const data = await getUser(username);
      if (Array.isArray(data) && data.length > 0) {
        setUser(data[0]);
        setIsModalOpen(true);
      } else setErrorMessage('User not found');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Get user failed',
      );
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
                setIsEditModalOpen(true);
              }}
            >
              Edit
            </ConfirmButton>
          </div>
        </Modal>
      )}

      {isEditModalOpen && user && (
        <EditProfileFeature
          data={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
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
