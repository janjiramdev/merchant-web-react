import type { IUpdateUserRequestBody } from '../../interfaces/services.interface';
import CancelButton from '../buttons/CancelButton';
import ConfirmButton from '../buttons/ConfirmButton';
import SelectField from '../inputs/SelectField';
import TextField from '../inputs/TextField';
import Modal from './Modal';

interface IEditProfileModalProps {
  isOpen: boolean;
  data: IUpdateUserRequestBody;
  onChange: (value: IUpdateUserRequestBody) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  data,
  onChange,
  onSubmit,
  onClose,
}: IEditProfileModalProps) {
  return (
    <>
      {isOpen ? (
        <Modal title="Edit Profile" onClose={onClose}>
          <div className="grid gap-2 mb-4 text-black">
            <label className="text-sm">Password</label>
            <TextField
              type="password"
              value={data.password}
              onChange={(e) => onChange({ ...data, password: e.target.value })}
            />

            <label className="text-sm">Firstname</label>
            <TextField
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
            />

            <label className="text-sm">Lastname</label>
            <TextField
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
            />

            <label className="text-sm">Gender</label>
            <SelectField
              value={data.gender}
              onChange={(e) =>
                onChange({ ...data, gender: e.target.value as TUserGender })
              }
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </SelectField>

            <label className="text-sm">Age</label>
            <TextField
              type="number"
              value={data.age}
              onChange={(e) =>
                onChange({ ...data, age: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <CancelButton onClick={onClose}>Cancel</CancelButton>
            <ConfirmButton onClick={onSubmit}>Save</ConfirmButton>
          </div>
        </Modal>
      ) : undefined}
    </>
  );
}
