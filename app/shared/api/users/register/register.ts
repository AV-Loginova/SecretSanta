import { request } from "../../request";

import { RegisterPayload, RegisterResponse } from "./register.types";

export async function registerUser(payload: RegisterPayload) {
  return request<RegisterResponse>("/api/register", {
    method: "POST",
    json: payload,
  });
}
