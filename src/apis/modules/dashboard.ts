import httpClient from "@/apis/axiosSetup";


export const dashboardApi = {
    getCredits : () =>
        httpClient.get<any>("/dashboard/api/v1/pending-credits/fetch",{headers: { useAuth: true}}),
    
    getWeeklyCreditUsage : (service_name : string) =>
        httpClient.get<any>(`/dashboard/api/v1/weekly-stats/fetch/${service_name}`,{headers: { useAuth: true}}),

    getTotalCredits : () =>
        httpClient.get<any>(`/dashboard/api/v1/summary/fetch`,{headers: { useAuth: true}}),

    getVerificationHistory : (page : number) =>
        httpClient.get<any>(`/dashboard/api/v1/ledger-history/fetch`,{headers: { useAuth: true}, params: {
            page: page,
          },}),

    getMonthlyCredits : () =>
        httpClient.get<any>(`/dashboard/api/v1/monthly-stats/fetch`,{headers: { useAuth: true}}),
}

