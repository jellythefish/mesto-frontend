import "../pages/index.css"
import Card from "./Card"
import CardList from "./CardList"
import Popup from "./Popup"
import ServerAPI from "./serverAPI"

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

const addCardPopup = new Popup(addCardOpenButtonElement, addCardCloseButtonElement, addCardPopupElement,
    addCardSubmitButtonElement);
const editProfilePopup = new Popup(editProfileOpenButtonElement, editProfileCloseButtonElement, editProfilePopupElement,
    editProfileSubmitButtonElement);
const imagePopup = new Popup(undefined, imageCloseButton, imagePopupElement);
const profilePicPopup = new Popup(profilePhoto, profilePicCloseButtonElement, profilePicPopupElement,
    profilePicSubmitButtonElement);

const TOKEN = "1cfc4850-364c-4f4b-aa01-64990e05d356";
const GROUPID = "cohort6";
export const MYOWNERID = "8be3eb7eaf8a860614ec2a23";

export const serverAPI = new ServerAPI(TOKEN, GROUPID);

serverAPI.getInitialUserInfo()
    .then(data => {
        renderProfileData(data.name, data.about);
        editProfilePic(data.avatar);
    })
    .catch(err => window.alert(err));

let cardList;
serverAPI.loadInitialCards()
    .then(cards => {
        cardList = new CardList(document.querySelector(".places-list"), cards, imagePopup);
});

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
    }

    function resetForm() {
        const currentForm = event.target.closest("form");
        const currentSubmitButton = Array.from(currentForm).find(elem => elem.classList.contains("popup__button"));
        currentForm.reset();
        if (currentSubmitButton.classList.contains("js-submit-add") ||  currentSubmitButton.classList.contains("js-submit-pic")) {
            setButtonState(currentSubmitButton, "disable");
        }
    }
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
    } else if ((currentInput.name === "link" || currentInput.name === "pic-link") && !currentInput.validity.valid) {
        currentError.textContent = "Здесь должна быть ссылка";
        return false;
    } else {
        currentError.textContent = "";
        return true;
    }
}

// обработчик ввода данных в форму
function inputHandler(event) {
    let firstField;
    let secondField;
    const currentForm = event.target.closest("form");
    const currentSubmitButton = Array.from(currentForm).find(elem => elem.classList.contains("popup__button"));
    if (currentForm === addCardPopupForm) {
        firstField = addCardPopupForm.elements.name;
        secondField = addCardPopupForm.elements.link;
    } else if (currentForm === editProfilePopupForm) {
        firstField = editProfilePopupForm.elements["author-name"];
        secondField = editProfilePopupForm.elements["about"];
    } else if (currentForm === profilePicPopupForm) {
        firstField = profilePicPopupForm.elements["pic-link"];
        secondField = firstField;
    }
    checkInputValidity(currentForm, event.target);
    if (firstField.validity.valid && secondField.validity.valid) {
        setButtonState(currentSubmitButton, "enable");
    } else {
        setButtonState(currentSubmitButton, "disable");
    }
}

/* Слушатели событий */
addCardPopupForm.addEventListener('input', inputHandler);
addCardPopupForm.addEventListener('submit', processForm);
editProfilePopupForm.addEventListener('input', inputHandler);
editProfilePopupForm.addEventListener('submit', processForm);
profilePicPopupForm.addEventListener('input', inputHandler);
profilePicPopupForm.addEventListener('submit', processForm);