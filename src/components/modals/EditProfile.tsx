import CancelButton from '../buttons/CancelButton';
import ConfirmButton from '../buttons/ConfirmButton';
import Modal from './Modal';
import SelectField from '../inputs/SelectField';
import TextField from '../inputs/TextField';

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number | '';
  onChangePassword: (value: string) => void;
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onChangeGender: (value: string) => void;
  onChangeAge: (value: number) => void;
  onSave: () => void;
};

export default function EditProfileModal({
  isOpen,
  onClose,
  password,
  firstName,
  lastName,
  gender,
  age,
  onChangePassword,
  onChangeFirstName,
  onChangeLastName,
  onChangeGender,
  onChangeAge,
  onSave,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <div className="grid gap-2 mb-4 text-black">
        <label className="text-sm">Password</label>
        <TextField
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          type="password"
        />

        <label className="text-sm">Firstname</label>
        <TextField
          value={firstName}
          onChange={(e) => onChangeFirstName(e.target.value)}
        />

        <label className="text-sm">Lastname</label>
        <TextField
          value={lastName}
          onChange={(e) => onChangeLastName(e.target.value)}
        />

        <label className="text-sm">Gender</label>
        <SelectField
          value={gender}
          onChange={(e) => onChangeGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </SelectField>

        <label className="text-sm">Age</label>
        <TextField
          value={age}
          onChange={(e) => onChangeAge(Number(e.target.value))}
          type="number"
        />
      </div>

      <div className="flex justify-end gap-2">
        <CancelButton onClick={onClose}>Cancel</CancelButton>
        <ConfirmButton onClick={onSave}>Save</ConfirmButton>
      </div>
    </Modal>
  );
}
