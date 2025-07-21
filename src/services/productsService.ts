export type ProductPayload = {
  name?: string;
  description?: string;
  price?: number;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    let message = res.statusText;
    try {
      const errorData = await res.json();
      if (errorData?.message) message = errorData.message;
    } catch {
      //
    }
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
};

export async function searchProducts(name?: string, token?: string) {
  const url = new URL(`${import.meta.env.VITE_SERVICE_ENDPOINT}/products`);

  if (name !== undefined && name !== 'undefined' && name !== '')
    url.searchParams.append('name', name);
  url.searchParams.append('sortBy', 'name');
  url.searchParams.append('sortDirection', 'asc');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function createProduct(data: ProductPayload, token: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVICE_ENDPOINT}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateProduct(
  id: string,
  data: ProductPayload,
  token: string,
) {
  const res = await fetch(
    `${import.meta.env.VITE_SERVICE_ENDPOINT}/products/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );
  return handleResponse(res);
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(
    `${import.meta.env.VITE_SERVICE_ENDPOINT}/products/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return handleResponse(res);
}
