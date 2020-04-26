import "../pages/index.css"
import Card from "./Card"
import CardList from "./CardList"
import Popup from "./Popup"
import ServerAPI from "./serverAPI"

const signInPopupElement = document.querySelector(".js-popup-sign-in");
const signInPopupForm = document.forms["sign-in"];
const signInOpenButtonElement = document.querySelector(".header__login-button");
const signInCloseButtonElement = document.querySelector(".js-close-sign-in");
const signInSubmitButtonElement = document.querySelector(".js-submit-sign-in");
const signOutButtonElement = document.querySelector('.header__logout-button');

const signUpPopupElement = document.querySelector(".js-popup-sign-up");
const signUpPopupForm = document.forms["sign-up"];
export const signUpOpenButtonElement = document.querySelector(".sign-up__link");
export const signUpCloseButtonElement = document.querySelector(".js-close-sign-up");
const signUpSubmitButtonElement = document.querySelector(".js-submit-sign-up");

const addCardPopupElement = document.querySelector(".js-popup-add");
const addCardPopupForm = document.forms["new-card"];
const addCardOpenButtonElement = document.querySelector(".user-info__button");
const addCardCloseButtonElement = document.querySelector(".js-close-add");
const addCardSubmitButtonElement = document.querySelector(".js-submit-add");

export const editProfilePopupElement = document.querySelector(".js-popup-edit");
export const editProfilePopupForm = document.forms["edit-profile"];
export const editProfileOpenButtonElement = document.querySelector(".user-info__edit-button");
export const editProfileCloseButtonElement = document.querySelector(".js-close-edit");
export const editProfileSubmitButtonElement = document.querySelector(".js-submit-edit");
export const profileName = document.querySelector(".user-info__name");
export const profileJob = document.querySelector(".user-info__job");

const imagePopupElement = document.querySelector(".js-popup-image");
export const imageFile = document.querySelector(".popup__image");
const imageCloseButton = document.querySelector(".js-close-image");

const profilePicCloseButtonElement = document.querySelector(".js-close-pic");
const profilePicPopupElement = document.querySelector(".js-popup-pic");
const profilePicSubmitButtonElement = document.querySelector(".js-submit-pic");
const profilePicPopupForm = document.forms["profile-pic"];
const profilePhoto = document.querySelector(".user-info__photo");


export const signInPopup = new Popup(signInOpenButtonElement, signInCloseButtonElement, signInPopupElement,
    signInSubmitButtonElement);
const signUpPopup = new Popup(signUpOpenButtonElement, signUpCloseButtonElement, signUpPopupElement,
    signUpSubmitButtonElement);

signInPopupForm.addEventListener('input', inputHandler);
signInPopupForm.addEventListener('submit', processForm);
signUpPopupForm.addEventListener('input', inputHandler);
signUpPopupForm.addEventListener('submit', processForm);
signOutButtonElement.addEventListener('click', logout);

let addCardPopup = {};
let editProfilePopup = {};
let imagePopup = {};
let profilePicPopup = {};

let JWT_TOKEN = document.cookie;
export let USER_ID = "";
export const serverAPI = new ServerAPI();
let cardList = {};

if (JWT_TOKEN) {
    initialize(serverAPI, cardList);
};

function initialize(serverAPI, cardList) {
    addCardPopup = new Popup(addCardOpenButtonElement, addCardCloseButtonElement, addCardPopupElement,
        addCardSubmitButtonElement);
    editProfilePopup = new Popup(editProfileOpenButtonElement, editProfileCloseButtonElement, editProfilePopupElement,
        editProfileSubmitButtonElement);
    imagePopup = new Popup(undefined, imageCloseButton, imagePopupElement);
    profilePicPopup = new Popup(profilePhoto, profilePicCloseButtonElement, profilePicPopupElement,
        profilePicSubmitButtonElement);
    addCardPopupForm.addEventListener('input', inputHandler);
    addCardPopupForm.addEventListener('submit', processForm);
    editProfilePopupForm.addEventListener('input', inputHandler);
    editProfilePopupForm.addEventListener('submit', processForm);
    profilePicPopupForm.addEventListener('input', inputHandler);
    profilePicPopupForm.addEventListener('submit', processForm);
    signInOpenButtonElement.classList.add('header__login-button_hidden');
    signOutButtonElement.classList.remove('header__logout-button_hidden');
    serverAPI.getInitialUserInfo()
        .then(res => {
            renderProfileData(res.name, res.about);
            editProfilePic(res.avatar);
            USER_ID = res._id;
            displayContent();
        })
    .catch(err => window.alert(err));
    serverAPI.loadInitialCards()
        .then(cards => {
            cardList = new CardList(document.querySelector(".places-list"), cards.data, imagePopup);
        });
}

function logout(event) {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=.the-mesto.tk; path=/;"
    location.reload();
}

function displayContent() {
    const profile = document.querySelector('.profile');
    profile.style.display = "flex";
    const placesList = document.querySelector('.places-list');
    placesList.style.display = "grid";
}

function renderProfileData(authorName, about) {
    profileName.textContent = authorName;
    profileJob.textContent = about;
}

function editProfilePic(link) {
    profilePhoto.style.backgroundImage = `url(${link})`;
}

// функция, задающая стили кнопки submit в формах
export function setButtonState(button, state) {
    if (state === "enable") {
        button.removeAttribute('disabled');
        button.style.backgroundColor = "#000";
        button.style.color = "#FFF";
        button.style.cursor = "pointer";
    } else if (state === "disable") {
        button.setAttribute('disabled', "true");
        button.style.backgroundColor = "transparent";
        button.style.color = "rgba(0, 0, 0, .2)";
        button.style.cursor = "default";
    }
}

// обработчик отправки всплывающей формы
function processForm(event) {
    event.preventDefault();
    if (event.target === addCardPopupForm) {
        const placeName = addCardPopupForm.elements.name.value;
        const imageLink = addCardPopupForm.elements.link.value;
        addCardPopup.renderLoading(true);
        serverAPI.addNewCard(placeName, imageLink)
            .then((res) => {
                const card = new Card(placeName, imageLink, 0, "me", res._id, false);
                cardList.addCard(card);
                addCardPopup.close(event);
                resetForm();
            })
            .catch((err) => window.alert(err))
    } else if (event.target === editProfilePopupForm) {
        const authorName = editProfilePopupForm.elements["author-name"].value;
        const about = editProfilePopupForm.elements["about"].value;
        editProfilePopup.renderLoading(true);
        serverAPI.editProfileInfo(authorName, about)
            .then(() => {
                renderProfileData(authorName, about);
                editProfilePopup.close(event);
                resetForm();
            })
            .catch(err => window.alert(err));
    } else if (event.target === profilePicPopupForm) {
        const link = profilePicPopupForm.elements["pic-link"].value;
        profilePicPopup.renderLoading(true);
        serverAPI.updateUserPic(link)
            .then(() => {
                editProfilePic(link);
                profilePicPopup.close(event);
                resetForm();
            })
            .catch(err => window.alert(err));
    } else if (event.target === signInPopupForm) {
        const email = signInPopupForm.elements.email.value;
        const password = signInPopupForm.elements.password.value;
        signInPopup.renderLoading(true);
        serverAPI.signIn(email, password)
            .then((res) => {
                USER_ID = res._id;
                initialize(serverAPI, cardList);
                resetForm();
                signInPopup.close(event);
            })
            .catch((err) => window.alert(err));
    } else if (event.target === signUpPopupForm) {
        const name = signUpPopupForm.elements.name.value;
        const about = signUpPopupForm.elements.about.value;
        const avatar = signUpPopupForm.elements.avatar.value;
        const email = signUpPopupForm.elements.email.value;
        const password = signUpPopupForm.elements.password.value;
        signUpPopup.renderLoading(true);
        serverAPI.signUp(name, about, avatar, email, password)
            .then((res) => {
                resetForm();
                renderSuccess(document.querySelector('.js-popup-content-sign-up'));
            })
            .catch((err) => window.alert(err));
    }

    function resetForm() {
        const currentForm = event.target.closest("form");
        const currentSubmitButton = Array.from(currentForm).find(elem => elem.classList.contains("popup__button"));
        currentForm.reset();
        if (currentSubmitButton.classList.contains("js-submit-add") ||  currentSubmitButton.classList.contains("js-submit-pic") || 
        currentSubmitButton.classList.contains("js-submit-sign-in") || currentSubmitButton.classList.contains("js-submit-sign-up")) {
            setButtonState(currentSubmitButton, "disable");
        }
    }
}

function renderSuccess(element) {
    element.children[1].style.display = 'none';
    element.children[2].style.display = 'none';
    element.style['min-height'] = '50px';
    const ok = document.createElement('h4');
    ok.classList.add('popup__status');
    ok.textContent = "Вы успешно зарегистрировались!";
    ok.style['text-align'] = 'center'
    ok.style['font-size'] = '20px';
    element.appendChild(ok);
}

// обработчик валидности введенных данных
function checkInputValidity(currentForm, currentInput) {
    const errorList = Array.from(currentForm.querySelectorAll(".popup__error-message"));
    const currentError = errorList.find(error => error.getAttribute("data-for-element") ===
        currentInput.name);
    if (currentInput.validity.valueMissing) {
        currentError.textContent = "Это обязательное поле";
        return false;
    } else if (currentInput.validity.tooShort || currentInput.validity.tooLong) {
        currentError.textContent = "Должно быть от 2 до 30 символов";
        return false;
    } else if ((currentInput.name === "link" || currentInput.name === "pic-link" || currentInput.name === "avatar") 
    && !currentInput.validity.valid) {
        currentError.textContent = "Некорректная ссылка";
        return false;
    } else if (currentInput.name === "email" && !currentInput.validity.valid) {
        currentError.textContent = "Некорректный email";
        return false;
    } else if (currentInput.name === "password" && !currentInput.validity.valid) {
        currentError.textContent = "от 8 символов: заглавная, прописная буква и цифра";
        currentError.style.color = "red";
        return false;
    } else {
        currentError.textContent = "";
        return true;
    }
}

// обработчик ввода данных в форму
function inputHandler(event) {
    let fields = {};
    const currentForm = event.target.closest("form");
    const currentSubmitButton = Array.from(currentForm).find(elem => elem.classList.contains("popup__button"));
    if (currentForm === addCardPopupForm) {
        fields.name = addCardPopupForm.elements.name;
        fields.link = addCardPopupForm.elements.link;
    } else if (currentForm === signInPopupForm) {
        fields.email = signInPopupForm.elements.email;
        fields.password = signInPopupForm.elements.password;
    } else if (currentForm === signUpPopupForm) {
        fields.name = signUpPopupForm.elements.name;
        fields.about = signUpPopupForm.elements.about;
        fields.avatar = signUpPopupForm.elements.avatar;
        fields.email = signUpPopupForm.elements.email;
        fields.password = signUpPopupForm.elements.password;
    } else if (currentForm === editProfilePopupForm) {
        fields["author-name"] = editProfilePopupForm.elements["author-name"];
        fields.about = editProfilePopupForm.elements["about"];
    } else if (currentForm === profilePicPopupForm) {
        fields["pic-link"] = profilePicPopupForm.elements["pic-link"];
    }
    checkInputValidity(currentForm, event.target);
    const allFieldsValid = Object.values(fields).every((elem) => elem.validity.valid);
    if (allFieldsValid) {
        setButtonState(currentSubmitButton, "enable");
    } else {
        setButtonState(currentSubmitButton, "disable");
    }
}

/* Слушатели событий */
