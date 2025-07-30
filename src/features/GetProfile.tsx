import { useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import Modal from '../components/modals/Modal';
import type { IUser } from '../interfaces/features.interface';
import { getUser } from '../services/users.service';
import EditProfileFeature from './EditProfile';

interface GetProfileFeatureProps {
  username: string;
}

export default function GetProfile({ username }: GetProfileFeatureProps) {
  const [isOpenProfileModal, setIsOpenProfileModal] = useState<boolean>(false);
  const [profile, setProfile] = useState<IUser | undefined>(undefined);
  const [isOpenEditProfileModal, setIsOpenEditProfileModal] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchProfile = async () => {
    try {
      const response: IUser = await getUser(username);
      if (Array.isArray(response) && response.length > 0) {
        setProfile(response[0]);
        setIsOpenProfileModal(true);
      } else setErrorMessage('user not found');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'get profile failed',
      );
    }
  };

  return (
    <>
      <button
        onClick={fetchProfile}
        className="font-medium hover:text-black transition-colors"
      >
        {username}
      </button>

      {isOpenProfileModal && profile && (
        <Modal
          title="User Profile"
          onClose={() => setIsOpenProfileModal(false)}
        >
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="text-right font-medium text-gray-600">
              Username:
            </div>
            <div className="text-left">{profile.username}</div>

            <div className="text-right font-medium text-gray-600">
              Firstname:
            </div>
            <div className="text-left">{profile.firstName}</div>

            <div className="text-right font-medium text-gray-600">
              Lastname:
            </div>
            <div className="text-left">{profile.lastName}</div>

            <div className="text-right font-medium text-gray-600">Gender:</div>
            <div className="text-left">{profile.gender}</div>

            <div className="text-right font-medium text-gray-600">Age:</div>
            <div className="text-left">{profile.age}</div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setIsOpenProfileModal(false)}>
              Close
            </CancelButton>
            <ConfirmButton
              onClick={() => {
                setIsOpenProfileModal(false);
                setIsOpenEditProfileModal(true);
              }}
            >
              Edit
            </ConfirmButton>
          </div>
        </Modal>
      )}

      {isOpenEditProfileModal && profile && (
        <EditProfileFeature
          data={profile}
          isOpen={isOpenEditProfileModal}
          onClose={() => setIsOpenEditProfileModal(false)}
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
