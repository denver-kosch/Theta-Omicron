export async function apiCall (api, body) {
    let x = new FormData();

    for (const key in body) {
        if (body.hasOwnProperty(key)) {
          x.append(key, body[key]);
        }
      }

    let apiLink = '' + api;

    const result = await fetch(apiLink, {method: "POST", body: x});
    let data;

    if (result.ok) {
        data = await result.json();
        return data;
    }
    return null;
}