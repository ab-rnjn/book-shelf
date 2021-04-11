export const addBook = async (payload) => {
    try {
        const responseStream = await fetch(`/addBook`, {
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


export const deleteBook = async ({ bookId }) => {
    try {
        const responseStream = await fetch(`/deleteBook/${bookId}`, {
            method: 'DELETE',
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

export const getBooks = async () => {
    try {
        const responseStream = await fetch(`/getBooks`, {
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

export const searchBooks = async ({ bookName }) => {
    try {
        const responseStream = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const response = await responseStream.json();
        if (response.error) throw response.error;
        return response.items;
    } catch (e) {
        throw e;
    }
}