export type SalePayload = {
  productId: string;
  quantity: number;
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

export async function sale(data: SalePayload, token: string) {
  const res = await fetch(`${import.meta.env.VITE_SERVICE_ENDPOINT}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getSaleHistories(productId?: string, token?: string) {
  const url = new URL(`${import.meta.env.VITE_SERVICE_ENDPOINT}/sales`);

  if (productId) url.searchParams.append('productId', productId);
  url.searchParams.append('sortBy', 'createdAt');
  url.searchParams.append('sortDirection', 'desc');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}
