export async function login(formData: { username: string; password: string }) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVICE_ENDPOINT}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include',
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'login failed');
  }

  return await response.json();
}
