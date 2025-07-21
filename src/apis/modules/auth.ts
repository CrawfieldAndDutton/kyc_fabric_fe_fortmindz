import httpClient from "@/apis/axiosSetup";
import {
  contactPayLoad,
  contactResponse,
  LoginPayload,
  LoginResponse,
  LogoutPayload,
  RegisterPayload,
  RegisterResponse,
  resetPayload,
  SendotpPayload,
  SendotpResponse,
  VerifyotpPayload,
  VerifyotpResponse,
} from "@/apis/apiTypes";

export const authApi = {
  login: (data: LoginPayload) =>
    httpClient.post<LoginResponse>("/dashboard/api/v1/auth/login", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }),

  register: (data: RegisterPayload) =>
    httpClient.post<RegisterResponse>("/dashboard/api/v1/auth/register", data),

  logout: (data: LogoutPayload) =>
    httpClient.post<string>("/dashboard/api/v1/auth/logout", data, {
      headers: { useAuth: true,  },
    }),
     
  sendOtp: (data: SendotpPayload) =>
        httpClient.post<SendotpResponse>("/dashboard/api/v1/auth/send_otp", data),

  verifyOtp: (data: VerifyotpPayload) =>
    httpClient.post<VerifyotpResponse>("/dashboard/api/v1/auth/verify_otp", data),

  contactUs: (data: contactPayLoad ) =>
    httpClient.post<contactResponse>("/dashboard/api/v1/contact-us/capture", data, {headers: { "Content-Type": "application/json" }}),

  resetEmailVerify: (email: string) =>
    httpClient.get<any>("/dashboard/api/v1/account/reset/link" , {params: {
      email: email
    }}),

  resetPassword:(data: resetPayload) =>
    httpClient.post<any>("/dashboard/api/v1/account/password/reset",data)
    
};
