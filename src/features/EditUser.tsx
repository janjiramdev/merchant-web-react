import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import EditProfileModal from '../components/modals/EditProfile';
import Modal from '../components/modals/Modal';
import { updateUser } from '../services/userService';

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

export default function EditProfileFeature({ isOpen, onClose }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>('');

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setFirstName(localStorage.getItem('firstName') ?? '');
      setLastName(localStorage.getItem('lastName') ?? '');
      setGender(localStorage.getItem('gender') ?? '');
      const storedAge = localStorage.getItem('age');
      setAge(storedAge ? Number(storedAge) : '');
    }
  }, [isOpen]);

  const closeModal = () => {
    if (onClose) onClose();
  };

  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirmSave = async () => {
    closeConfirm();

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('token not found');

      const objectId = localStorage.getItem('objectId');
      if (!objectId) throw new Error('user id not found');

      const oldFirstName = localStorage.getItem('firstName') || '';
      const oldLastName = localStorage.getItem('lastName') || '';
      const oldGender = localStorage.getItem('gender') || '';
      const oldAgeStr = localStorage.getItem('age') || '';
      const oldAge = oldAgeStr !== '' ? Number(oldAgeStr) : undefined;

      const profileUpdate: Partial<{
        password: string;
        firstName: string;
        lastName: string;
        gender: string;
        age: number;
      }> = {};

      if (password.trim() !== '') profileUpdate.password = password;
      if (firstName.trim() !== '' && firstName !== oldFirstName)
        profileUpdate.firstName = firstName.trim();
      if (lastName.trim() !== '' && lastName !== oldLastName)
        profileUpdate.lastName = lastName.trim();
      if (
        gender.trim() !== '' &&
        ['male', 'female', 'others'].includes(gender.trim().toLowerCase()) &&
        gender !== oldGender
      )
        profileUpdate.gender = gender.trim().toLowerCase();
      if (age !== '' && !isNaN(Number(age)) && Number(age) !== oldAge)
        profileUpdate.age = Number(age);

      await updateUser(token, objectId, profileUpdate);
      closeModal();
    } catch (err) {
      console.error(err);
      setErrorMessage('failed to update profile');
    }
  };
  const onSaveClicked = () => {
    openConfirm();
  };

  return (
    <>
      <EditProfileModal
        isOpen={isOpen}
        onClose={closeModal}
        password={password}
        firstName={firstName}
        lastName={lastName}
        gender={gender}
        age={age}
        onChangePassword={setPassword}
        onChangeFirstName={setFirstName}
        onChangeLastName={setLastName}
        onChangeGender={setGender}
        onChangeAge={setAge}
        onSave={onSaveClicked}
      />

      {isConfirmOpen && (
        <Modal title="Confirm Save" onClose={closeConfirm}>
          <p>Are you sure you want to save the changes?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={closeConfirm}>Cancel</CancelButton>
            <ConfirmButton onClick={handleConfirmSave}>Confirm</ConfirmButton>
          </div>
        </Modal>
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
