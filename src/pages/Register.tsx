import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessAlert from '../components/alerts/SucceedAlert';
import TextField from '../components/inputs/TextField';
import SelectField from '../components/inputs/SelectField';
import FailedAlert from '../components/alerts/FailedAlert';
import ConfirmButton from '../components/buttons/ConfirmButton';
import { createUser } from '../services/userService';

type FormData = {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: 'male' | 'female' | 'other' | '';
  age: number | null;
};

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    gender: '',
    age: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowSuccess(false);
    setShowFailed(false);
    setErrorMessage('');

    try {
      await createUser({
        username: formData.username,
        password: formData.password,
        firstName: formData.firstname,
        lastName: formData.lastname,
        gender: formData.gender,
        age: formData.age ?? 0,
      });
      setShowSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate('/login');
    } catch {
      setErrorMessage('Something went wrong. Please try again');
      setShowFailed(true);
    } finally {
      setIsLoading(false);
    }
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
            <FailedAlert message={errorMessage} />
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

            <TextField
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Firstname
            </label>

            <TextField
              name="firstname"
              type="text"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Lastname
            </label>

            <TextField
              name="lastname"
              type="text"
              value={formData.lastname}
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
