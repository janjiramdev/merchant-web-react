export async function createUser(formData: {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
}) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVICE_ENDPOINT}/users`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

export async function updateUser(
  token: string,
  objectID: string,
  updateData: {
    password?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    age?: number;
  },
) {
  const response = await fetch(
    `${import.meta.env.VITE_SERVICE_ENDPOINT}/users/${objectID}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    },
  );
  console.log(response);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update profile');
  }
  return response.json();
}

export async function getUser(token: string, username: string) {
  const url = new URL(`${import.meta.env.VITE_SERVICE_ENDPOINT}/users`);
  url.searchParams.append('username', username);
  url.searchParams.append('sortBy', 'createdAt');
  url.searchParams.append('sortDirection', 'asc');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('response:', response);

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
}
