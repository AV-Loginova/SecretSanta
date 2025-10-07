import { ApiError, request } from '@shared/api/request';

describe('request', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('returns data when fetch is successful', async () => {
    const mockData = { message: 'ok' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const data = await request<typeof mockData>('/test-url');

    expect(data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('/test-url', expect.any(Object));
  });

  test('throws ApiError when fetch fails', async () => {
    const mockErrorData = { message: 'Not Found' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: jest.fn().mockResolvedValue(mockErrorData),
    });

    await expect(request('/fail-url')).rejects.toThrow(ApiError);
  });

  test('sends JSON body correctly', async () => {
    const mockData = { success: true };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const body = { foo: 'bar' };

    await request('/json-url', { method: 'POST', json: body });

    const fetchArgs = (global.fetch as jest.Mock).mock.calls[0][1];

    expect(fetchArgs.body).toBe(JSON.stringify(body));

    expect(fetchArgs.headers.get('Content-Type')).toBe('application/json');
  });
});
