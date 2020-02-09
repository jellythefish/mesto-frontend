import {
    editProfileOpenButtonElement, 
    editProfileCloseButtonElement,
    editProfilePopupForm,
    imageFile,
    profileName,
    profileJob,
    editProfileSubmitButtonElement,
    setButtonState
} from "./script"
export default class Popup {
    constructor(openButton, closeButton, popupElement, submitButton) {
        this.popupElement = popupElement;
        this.submitButton = submitButton;
        if (openButton !== undefined) {
            openButton.addEventListener('click', this.open.bind(this));
        }
        closeButton.addEventListener('click', this.close.bind(this));
    }
    open(event) {
        this.popupElement.classList.toggle("popup_is-opened");
        this.render(event);
    }
    close(event) {
        this.popupElement.classList.toggle("popup_is-opened");
        this.render(event);
        this.renderLoading(false);
    }
    render(event) {
        if (event.target === editProfileOpenButtonElement) {
            editProfilePopupForm.elements["author-name"].value = profileName.textContent;
            editProfilePopupForm.elements["about"].value = profileJob.textContent;
        } else if (event.target === editProfileCloseButtonElement || event.target === editProfilePopupForm) {
            editProfilePopupForm.querySelectorAll(".popup__error-message").forEach(elem => elem.textContent = "");
            setButtonState(editProfileSubmitButtonElement, "enable");
        } else if (event.target.classList.contains("place-card__image")) {
            let imageURL = event.target.style.backgroundImage;
            imageURL = imageURL.slice(5, -2);
            imageFile.setAttribute("src", imageURL);
        }
    }
    renderLoading(isLoading) {
        if (!this.submitButton) return;
        if (isLoading) {
            if (this.submitButton.classList.contains("js-submit-add")) {
                this.submitButton.style.fontSize = "18px"
            }
            this.submitButton.textContent = "Загрузка...";
        } else {
            if (this.submitButton.classList.contains("js-submit-add")) {
                this.submitButton.style.fontSize = "36px";
                this.submitButton.textContent = "+";
            } else {
                this.submitButton.style.fontSize = "18px";
                this.submitButton.textContent = "Сохранить";
            }
        }
    }
}