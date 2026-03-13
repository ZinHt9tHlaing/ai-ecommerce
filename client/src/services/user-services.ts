import { userEndpoints } from "@/config/endpoints/user-endpoint";
import type {
  GetUserProfileResponse,
  LoginResponse,
  RegisterResponse,
  UpdateProfileResponse,
} from "@/types/response/user-responses";
import apiClient from "@/utils/apiClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface UpdateProfilePayload {
  name: string;
  profilePhoto: File;
}

const userService = {
  register: async (payload: RegisterPayload) => {
    const response = await apiClient.post<RegisterResponse>(
      userEndpoints.register,
      payload,
    );

    return response.data;
  },

  login: async (payload: LoginPayload) => {
    const response = await apiClient.post<LoginResponse>(
      userEndpoints.login,
      payload,
    );

    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const response = await apiClient.patch<UpdateProfileResponse>(
      userEndpoints.updateProfile,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get<GetUserProfileResponse>(
      userEndpoints.getUserProfile,
    );

    return response.data;
  },
};

export default userService;
