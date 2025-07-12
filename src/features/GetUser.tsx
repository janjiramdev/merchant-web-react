import { useState } from 'react';
import Modal from '../components/Modal';
import CancelButton from '../components/buttons/CancelButton';
import { getUser } from '../services/userService';
import ConfirmButton from '../components/buttons/ConfirmButton';
import EditProfileFeature from './EditUser';

type User = {
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
};
type GetProfileFeatureProps = {
  username: string | null;
};

export default function GetProfileFeature({
  username,
}: GetProfileFeatureProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const usernameFromLogin = username ?? '';
  const [showEditProfile, setShowEditProfile] = useState(false); // <-- เพิ่มตรงนี้
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Missing token or objectId');
      console.log('token:', token);

      const response = await getUser(token, usernameFromLogin);
      console.log('data from API:', response);

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setUser(response.data[0]);
      } else {
        alert('ไม่พบข้อมูลผู้ใช้');
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to get user', error);
      alert('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    }
  };

  return (
    <>
      {usernameFromLogin && (
        <button
          onClick={fetchUser}
          className="font-medium hover:text-black transition-colors"
        >
          {usernameFromLogin}
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
              First Name:
            </div>
            <div className="text-left">{user.firstName}</div>

            <div className="text-right font-medium text-gray-600">
              Last Name:
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

      {showEditProfile && (
        <EditProfileFeature
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setShowEditProfile(false);
          }}
        />
      )}
    </>
  );
}
