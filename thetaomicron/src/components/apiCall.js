
export async function apiCall (api, body = {}, headers = {}) {
    const apiLink = `http://localhost:3306/${api}`;
    console.log(apiLink);

    try {
        const result = await fetch(apiLink, {method: "POST",headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)});
        
        if (result.status === 200) return result.json();
        
        const errorData = await result.text();  // Get the error message if not OK
        throw new Error(errorData);
    } catch (error) {
        console.error("Error making API call:", error);
        return error;
    }
}