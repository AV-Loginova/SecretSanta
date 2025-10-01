export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function request<T>(
  url: string,
  options?: RequestInit & { json?: unknown }
): Promise<T> {
  const headers = new Headers(options?.headers);

  if (options?.json) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
    body: options?.json ? JSON.stringify(options.json) : options?.body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && data.message) || res.statusText;
    throw new ApiError(message, res.status, data);
  }

  return data;
}
