

export async function apiCall (api, body = {}) {
    const apiLink = `http://${process.env.DB_HOST}:${process.env.PORT}/${api}`;

    try {
        const result = await fetch(apiLink, {method: "POST",headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)});
        let data;

        if (result.status === 200) {
            data = await result.json();
            return data;
        }
        const errorData = await result.text();  // Get the error message if not OK
        throw new Error(errorData);
    } catch (error) {
        console.error("Error making API call:", error);
        return null;
    }
}