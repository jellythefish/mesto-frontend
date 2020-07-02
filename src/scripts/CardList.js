import Card from "./Card"
import {serverAPI} from "./script"
import {USER_ID} from "./script"
export default class CardList {
    constructor(container, initialCards, imagePopup) {
        this.container = container;
        this.list = [];
        this.render(initialCards);
        this.imagePopup = imagePopup;
        container.addEventListener('click', this.cardHandler.bind(this)); // не теряем контекст
    }
    addCard(card) {
        this.container.appendChild(card.cardElement);
        this.list.push(card);
    }
    render(cardList) {
        if (cardList) {
            cardList.forEach((item) => {
                const cardOwner = item.owner === USER_ID ? "me" : "others";
                const isLikedByMe = item.likes.find(id => id === USER_ID);
                const card = new Card(item.name, item.link, item.likes.length, cardOwner, item._id, isLikedByMe);
                this.addCard(card);
            })
        }
    }
    cardHandler(event) {
        const currentCard = this.list.find(elem  => elem.cardElement === event.target.closest(".place-card"));
        if (event.target.classList.contains("place-card__like-icon")) {
            currentCard.like();
        } else if (event.target.classList.contains("place-card__delete-icon")) {
            const option = window.confirm("Вы действительно хотите удалить эту карточку?");
            if (option) {
                serverAPI.deleteCard(currentCard.cardID)
                    .then(() => {
                        currentCard.remove();
                        this.list.splice(this.list.indexOf(currentCard), 1);
                    })
                    .catch(err => window.alert(err));
            }
        } else if (event.target.classList.contains("place-card__image")) {
            this.imagePopup.open(event);
        }
    }
}
