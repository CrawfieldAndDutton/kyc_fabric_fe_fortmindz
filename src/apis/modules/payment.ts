import httpClient from "@/apis/axiosSetup";
import { paymentPayload, paymentResponse } from "../apiTypes";

export const paymentApi = {
    payment: (data: paymentPayload) =>
        httpClient.post<paymentResponse>("/dashboard/api/v1/payments/create", data, {headers: { useAuth: true, }}),
}