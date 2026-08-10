import ENDPOINT from "@/services/serverEndpoint";
import type { ApiRequestOptions, ApiResponse } from "@/types";

const api = async <T extends object = Record<string, unknown>>(
    path: string,
    {method = "GET", body, headers = {}}: ApiRequestOptions = {},
): Promise<ApiResponse<T>> => {
    try {
        const isFormData = body instanceof FormData;
        const fetchOptions: RequestInit = {
            method,
            headers: isFormData ? headers : {"Content-Type": "application/json", ...headers},
        };
        if (method !== "GET" && body !== undefined) {
            fetchOptions.body = isFormData ? body : JSON.stringify(body);
        }

        const response = await fetch(`${ENDPOINT}${path}`, fetchOptions);
        if (response.ok) {
            return response.status === 204
                ? ({success: true} as ApiResponse<T>)
                : await response.json() as ApiResponse<T>;
        }

        throw new Error(await response.text());
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown API error";
        console.error("Error making API call:", error);
        return {success: false, error: message};
    }
};

export default api;
