async function apiCall (api, body = {}, headers = {'Content-Type': 'application/json'}) {
    const port = process.env.REACT_APP_SERVERPORT || 3001;
    const host = window.location.hostname || 'localhost';
    const apiLink = `http://${host}:${port}/${api}`;
    
    const isFormData = body instanceof FormData;
    try {
        const fetchOptions = {
            method: "POST",
            headers: isFormData ? headers : { 'Content-Type': 'application/json', ...headers },
            body: isFormData ? body : JSON.stringify(body)
        };
        const result = await fetch(apiLink, fetchOptions);
        
        if (result.status >= 200 && result.status < 300) return result.json();
        
        const errorData = await result.text();  // Get the error message if not OK
        throw new Error(errorData);
    } catch (error) {
        console.error("Error making API call:", error);
        return error;
    }
};

export default apiCall;