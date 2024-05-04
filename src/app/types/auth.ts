export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CreateUserRequest extends LoginRequest {
  username: string;
  mobileNumber: string;
}
