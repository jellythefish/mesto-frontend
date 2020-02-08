export default class ServerAPI {
    constructor(token, groupID) {
        this.token = token;
        this.groupID = groupID;
        this.initialURL = `http://95.216.175.5/${this.groupID}`
    }

    getInitialUserInfo() {
        return fetch(`${this.initialURL}/users/me`, {
            headers: {
                authorization: `${this.token}`
            }
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
            headers: {
                authorization: `${this.token}`
            }
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
                authorization: this.token,
                'Content-Type': 'application/json'
            },
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

    addNewCard(name, link) {
        return fetch(`${this.initialURL}/cards`, {
            method: 'POST',
            headers: {
                authorization: this.token,
                'Content-Type': 'application/json'
            },
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
            headers: {
                authorization: this.token,
            }
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
        return fetch(`${this.initialURL}/cards/like/${cardID}`, {
            method: method,
            headers: {
                authorization: this.token,
            }
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
                authorization: this.token,
                'Content-Type': 'application/json'
            },
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
}
