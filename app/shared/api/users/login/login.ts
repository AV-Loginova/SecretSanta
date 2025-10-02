import { request } from '../../request';

import { LoginPayload, LoginResponse } from './login.types';

export async function loginUser(payload: LoginPayload) {
  return request<LoginResponse>('/api/login', {
    method: 'POST',
    json: payload,
  });
}
