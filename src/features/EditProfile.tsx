
import { useEffect, useState } from 'react';
import { updateUser } from '../services/usersService';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import EditProfileModal from '../components/modals/EditProfile';
import FailedAlert from '../components/alerts/FailedAlert';
import Modal from '../components/modals/Modal';


export default function EditProfileFeature({ user, isOpen, onClose }: Props) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number | ''>('');

  useEffect(() => {
    if (isOpen) {
      setId(user._id);
      setPassword('');
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setGender(user.gender);
      setAge(user.age);
    }
  }, [user, isOpen]);

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
      const objectId = id;

      const profileUpdate: Partial<{
        password: string;
        firstName: string;
        lastName: string;
        gender: string;
        age: number;
      }> = {};

      if (password.trim() !== '') profileUpdate.password = password;
      if (firstName.trim() !== '') profileUpdate.firstName = firstName.trim();
      if (lastName.trim() !== '') profileUpdate.lastName = lastName.trim();
      if (
        gender.trim() !== '' &&
        ['male', 'female', 'others'].includes(gender.trim().toLowerCase())
      )
        profileUpdate.gender = gender.trim().toLowerCase();
      if (age !== '' && !isNaN(Number(age))) profileUpdate.age = Number(age);

      await updateUser(objectId, profileUpdate);
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
