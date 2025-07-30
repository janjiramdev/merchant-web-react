import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import FailedAlert from '../components/alerts/FailedAlert';
import SuccessAlert from '../components/alerts/SucceedAlert';
import ConfirmButton from '../components/buttons/ConfirmButton';
import PasswordToggleButton from '../components/buttons/PasswordToggleButton';
import SelectField from '../components/inputs/SelectField';
import TextField from '../components/inputs/TextField';
import type { ICreateUserRequestBody } from '../interfaces/services.interface';
import { createUser } from '../services/users.service';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ICreateUserRequestBody>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: 'other',
    age: 0,
  });
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFailed, setShowFailed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);
    setShowFailed(false);
    setErrorMessage('');

    try {
      await createUser({
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        age: formData.age ?? 0,
      });

      setShowSuccess(true);
      navigate('/login');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Register Failed',
      );
      setShowFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const onCloseFailed = () => {
    setErrorMessage('');
    setShowFailed(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl relative">
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30">
            <SuccessAlert message="Account created successfully!" />
          </div>
        )}

        {showFailed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30">
            <FailedAlert message={errorMessage} onClose={onCloseFailed} />
          </div>
        )}

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>
            <TextField
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              />
              <PasswordToggleButton
                isShow={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Firstname
            </label>
            <TextField
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Lastname
            </label>
            <TextField
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Gender
            </label>
            <SelectField
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </SelectField>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Age
            </label>
            <TextField
              name="age"
              type="number"
              value={formData.age ?? ''}
              onChange={handleChange}
            />
          </div>

          <ConfirmButton type="submit" isLoading={isLoading}>
            Create Account
          </ConfirmButton>
        </form>
      </div>
    </div>
  );
}
