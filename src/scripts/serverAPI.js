export default class ServerAPI {
    constructor() {
        this.initialURL = NODE_ENV === 'development' ? `http://localhost:3000` : `https://api.the-mesto.tk`
    }

    signIn(email, password) { 
        return fetch(`${this.initialURL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => {
                if (document.cookie.toString().includes('jwt')) {
                    if (res.ok) return res.json();
                }
                return Promise.reject(`Код: ${res.status}, Ошибка: ${res.message}`);
            })
            .catch(err => Promise.reject(err));
    }

    signUp(name, about, avatar, email, password) {
        return fetch(`${this.initialURL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                name: name,
                about: about,
                avatar: avatar,
                email: email,
                password: password
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Код: ${res.status}, Ошибка: ${res.message}`);
            })
            .catch(err => Promise.reject(err));
    }

    getInitialUserInfo() {
        return fetch(`${this.initialURL}/users/me`, {
            credentials: "include",
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => Promise.reject(err));
    }

    loadInitialCards() {
        return fetch( `${this.initialURL}/cards`, {
            credentials: "include",
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => Promise.reject(err));
    }

    editProfileInfo(name, about) {
        return fetch(`${this.initialURL}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name,
                about: about
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => Promise.reject(err));
    }

    updateUserPic(link) {
        return fetch(`${this.initialURL}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                avatar: link,
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => Promise.reject(err));
    }

    addNewCard(name, link) {
        return fetch(`${this.initialURL}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => Promise.reject(err));
    }

    deleteCard(cardID) {
        return fetch(`${this.initialURL}/cards/${cardID}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => Promise.reject(err));
    }

    likeCard(cardID, isLiked) {
        const method = isLiked ? 'DELETE' : 'PUT';
        return fetch(`${this.initialURL}/cards/${cardID}/likes`, {
            method: method,
            credentials: 'include',
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка: ${res.status}`);
            })
            .catch(err => Promise.reject(err));
    }
}
