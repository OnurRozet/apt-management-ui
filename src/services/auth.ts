import {
  CreateOrEditResponse,
  ServiceResult,
  LoginDto,
  RegisterDto,
  UserDto,
} from "@/types";
import { Get, Post } from "./service";

export const AuthService = {
  login: async (
    loginData: LoginDto,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Post<ServiceResult<CreateOrEditResponse>>(
      "/auth/login",
      loginData,
      isAnonymous,
      clientToken,
    );
  },
  register: async (
    registerData: RegisterDto,
    isAnonymous = false,
    clientToken?: string,
  ) => {
    return Post<ServiceResult<CreateOrEditResponse>>(
      "/auth/register",
      registerData,
      isAnonymous,
      clientToken,
    );
  },
  logout: async (isAnonymous = false, clientToken?: string) => {
    return Post<ServiceResult<null>>(
      "/auth/logout",
      {},
      isAnonymous,
      clientToken,
    );
  },
  getMe: async (apartmentNumber: string, isAnonymous = false, clientToken?: string) => {
    return Get<ServiceResult<UserDto>>(
      `/auth/get-user-info/${apartmentNumber}`,
      undefined,
      isAnonymous,
      clientToken,
    );
  },
};
