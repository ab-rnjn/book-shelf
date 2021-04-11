export const loginService = async (payload) => {
    try {
        const responseStream = await fetch(`/login`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const response = await responseStream.json();
        if (response.error) throw response.error;
        localStorage.setItem("token", response.info);
        return response.data;
    } catch (e) {
        throw e;
    }
}

export const signUpService = async (payload) => {
    try {
        const responseStream = await fetch(`/newUser`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const response = await responseStream.json();
        if (response.error) throw response.error;
        return response.data;
    } catch (e) {
        throw e;
    }
}

export const usernameService = async ({ username }) => {
    try {
        const responseStream = await fetch(`/checkUsername/${username}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        });
        const response = await responseStream.json();
        if (response.error) throw response.error;
        return response.data;
    } catch (e) {
        throw e;
    }
}