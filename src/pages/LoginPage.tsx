import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmButton from '../components/buttons/ConfirmButton';
import PasswordToggleButton from '../components/buttons/PasswordToggleButton';
import TextField from '../components/inputs/TextField';
import { useSession } from '../contexts/sessions/SessionContext';
import type { ILoginServiceData } from '../interfaces/services.interface';
import { login } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setTokens } = useSession();

  const [formData, setFormData] = useState<ILoginServiceData>({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const res = await login({
        username: formData.username.trim(),
        password: formData.password.trim(),
      });
      setTokens(res);
      navigate('/home');
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Welcome to Merchant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              username
            </label>
            <TextField
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              password
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

          {errorMessage && (
            <div
              className={`text-sm text-center ${errorMessage === 'login success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {errorMessage}
            </div>
          )}

          <ConfirmButton type="submit" isLoading={isLoading}>
            Login
          </ConfirmButton>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Don't have an account?</p>
          <Link to="/register" className="text-blue-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
