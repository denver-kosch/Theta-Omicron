import ENDPOINT from "@/services/serverEndpoint";

export default async (api, { method = "GET", body, headers = {} } = {}) => {
    const apiLink = `${ENDPOINT}${api}`;
    // console.log(`API Call: ${apiLink} | Method: ${method} | Body:`, body);
    try {
        const fetchOptions = {
            method,
            headers: body instanceof FormData ? headers : { 'Content-Type': 'application/json', ...headers }
        };
        if (method !== "GET" && body) fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
        
        const result = await fetch(apiLink, fetchOptions);
        
        if (result.ok) return result.status === 204 ? { success: true } : result.json();
        
        const errorData = await result.text();    // Get the error message if not OK
        throw new Error(errorData);
    } catch (error) {
        console.error("Error making API call:", error);
        return { success: false, error: error.message };
    }
};
