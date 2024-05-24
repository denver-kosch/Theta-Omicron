export async function apiCall (api, body = {}, headers = {}) {
    const apiLink = `http://localhost:3306/${api}`;
    console.log(apiLink);

    const isFormData = body instanceof FormData;
    try {
        const fetchOptions = {
            method: "POST",
            headers: isFormData ? headers : { 'Content-Type': 'application/json', ...headers },
            body: isFormData ? body : JSON.stringify(body)
        };
        const result = await fetch(apiLink, fetchOptions);
        
        if (result.status === 200) return result.json();
        
        const errorData = await result.text();  // Get the error message if not OK
        throw new Error(errorData);
    } catch (error) {
        console.error("Error making API call:", error);
        return error;
    }
}