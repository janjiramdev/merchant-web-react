import { useEffect, useState } from 'react';
import FailedAlert from '../components/alerts/FailedAlert';
import CancelButton from '../components/buttons/CancelButton';
import ConfirmButton from '../components/buttons/ConfirmButton';
import EditProfileModal from '../components/modals/EditProfileModal';
import Modal from '../components/modals/Modal';
import type { IUser } from '../interfaces/features.interface';
import type { IUpdateUserRequestBody } from '../interfaces/services.interface';
import { updateUser } from '../services/users.service';

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
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [currentFormData, setCurrentFormData] =
    useState<IUpdateUserRequestBody>({
      password: '',
      firstName: '',
      lastName: '',
      gender: undefined,
      age: 0,
    });
  const [formData, setFormData] = useState<IUpdateUserRequestBody>({
    password: '',
    firstName: '',
    lastName: '',
    gender: undefined,
    age: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async () => {
    setIsOpenConfirmModal(false);

    try {
      const prepareData: IUpdateUserRequestBody = {
        password: formData?.password?.trim(),
        firstName: formData?.firstName?.trim(),
        lastName: formData?.lastName?.trim(),
        gender: formData?.gender,
        age: formData?.age,
      };

      const updateProfileBody: Partial<IUpdateUserRequestBody> = {};
      if (
        prepareData.password !== '' &&
        prepareData.password !== currentFormData.password
      )
        updateProfileBody.password = prepareData.password;
      if (
        prepareData.firstName !== '' &&
        prepareData.firstName !== currentFormData.firstName
      )
        updateProfileBody.firstName = prepareData.firstName;
      if (
        prepareData.lastName !== '' &&
        prepareData.lastName !== currentFormData.lastName
      )
        updateProfileBody.lastName = prepareData.lastName;
      if (
        prepareData.gender &&
        ['male', 'female', 'others'].includes(prepareData.gender) &&
        prepareData.gender !== currentFormData.gender
      )
        updateProfileBody.gender = prepareData.gender;
      if (prepareData.age && prepareData.age !== currentFormData.age)
        updateProfileBody.age = prepareData.age;

      await updateUser(data._id, updateProfileBody);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Update profile failed',
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentFormData({
        password: '',
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        age: data.age,
      });
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
        onSubmit={() => setIsOpenConfirmModal(true)}
        onClose={onClose}
      />

      {isOpenConfirmModal && (
        <Modal
          title="Confirm Save"
          onClose={() => setIsOpenConfirmModal(false)}
        >
          <p>Are you sure you want to save the changes?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CancelButton onClick={() => setIsOpenConfirmModal(false)}>
              Cancel
            </CancelButton>
            <ConfirmButton onClick={handleSubmit}>Confirm</ConfirmButton>
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
