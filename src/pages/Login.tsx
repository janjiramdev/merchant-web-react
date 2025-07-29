import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import ConfirmButton from '../components/buttons/ConfirmButton';
import PasswordToggleButton from '../components/buttons/PasswordToggleButton';
import TextField from '../components/inputs/TextField';

export default function Login() {
  const { setTokens } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await login({
        username: formData.username.trim(),
        password: formData.password.trim(),
      });
      setTokens(res);
      navigate('/home');
    } catch {
      setMessage('incorrect username or password');
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
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {message && (
            <div
              className={`text-sm text-center ${message === 'login success' ? 'text-green-600' : 'text-red-600'}`}
            >
              {message}
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
