async function apiFetch(link, options = {} ) {
    let token = localStorage.getItem("accessToken");
    let response = await fetch(link, {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        }
    });

    //If the access token expires
    if (response.status === 401 || response.status === 403) {
        const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            method: "GET",
            credentials: "include",
        });
        
        //Refresh token is expired
        if (refreshResponse.status === 401 || refreshResponse.status === 403) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
            throw new Error("Unauthorized");
        } 

        const data = await refreshResponse.json();

        token = data.accessToken;
        localStorage.setItem("accessToken", token);

        response = await fetch(link, {
            ...options,
            credentials: "include",
            headers: {
                ...options.headers,
                "Authorization": `Bearer ${token}`
            }
        });
    }
    return response;
}

export default apiFetch;