import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import EditProfileModal from '../components/modals/EditProfileModal';
import Modal from '../components/modals/Modal';
import type { IUser } from '../interfaces/features.interface';
import type { IUpdateUserData } from '../interfaces/services.interface';
import { updateUser } from '../services/usersService';

interface IEditProfileFeatureProps {
  data: IUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileFeature({
  data,
  isOpen,
  onClose,
}: IEditProfileFeatureProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [formData, setFormData] = useState<IUpdateUserData>({
    password: '',
    firstName: '',
    lastName: '',
    gender: undefined,
    age: 0,
  });

  const handleConfirmSave = async () => {
    setIsConfirmOpen(false);

    try {
      const profileUpdate: Partial<IUpdateUserData> = {};
      const trimmed = {
        password: formData?.password?.trim(),
        firstName: formData?.firstName?.trim(),
        lastName: formData?.lastName?.trim(),
        gender: formData.gender,
        age: formData.age,
      };

      if (trimmed.password) profileUpdate.password = trimmed.password;
      if (trimmed.firstName) profileUpdate.firstName = trimmed.firstName;
      if (trimmed.lastName) profileUpdate.lastName = trimmed.lastName;
      if (
        trimmed.gender &&
        ['male', 'female', 'others'].includes(trimmed.gender)
      )
        profileUpdate.gender = trimmed.gender;
      if (trimmed.age) profileUpdate.age = trimmed.age;

      await updateUser(data._id, profileUpdate);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Update profile failed',
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        password: '',
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        age: data.age,
      });
    }
  }, [data, isOpen]);

  return (
    <>
      <EditProfileModal
        isOpen={isOpen}
        data={formData}
        onChange={setFormData}
        onSave={() => setIsConfirmOpen(true)}
        onClose={onClose}
      />

      {isConfirmOpen && (
        <Modal title="Confirm Save" onClose={() => setIsConfirmOpen(false)}>
          <p>Are you sure you want to save the changes?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </CancelButton>
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
