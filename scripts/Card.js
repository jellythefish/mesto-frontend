class Card {
    constructor(name, link, likeCounter, cardOwner, cardID, isLikedByMe) {
        this.likeCounter = likeCounter;
        this.isLikedByMe = isLikedByMe;
        this.cardOwner = cardOwner;
        this.cardID = cardID;
        this.cardElement = this.create(name, link);
        this.likeIcon = this.cardElement.querySelector(".place-card__like-icon");
    }
    like() {
        serverAPI.likeCard(this.cardID, this.isLikedByMe)
            .then(() => {
                !this.isLikedByMe ? this.likeCounter += 1 : this.likeCounter -= 1;
                this.cardElement.querySelector(".place-card__like-counter").textContent = this.likeCounter;
                this.likeIcon.classList.toggle("place-card__like-icon_liked");
                this.isLikedByMe = !this.isLikedByMe;
            })
            .catch(err => window.alert(err))
    }
    remove() {
        this.cardElement.remove();
    }
    create(name, link) {
        const placeCard = document.createElement('div');
        placeCard.classList.add("place-card");

        const cardImage = document.createElement('div');
        cardImage.classList.add("place-card__image");
        cardImage.style.backgroundImage = `url(${link})`;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("place-card__delete-icon");

        const placeCardDescription = document.createElement("div");
        placeCardDescription.classList.add("place-card__description");

        const cardTitle = document.createElement('h3');
        cardTitle.classList.add('place-card__name');
        cardTitle.textContent = name;

        const likeContainer = document.createElement("div");
        likeContainer.classList.add("place-card__like-container");

        const placeCardLikeIcon = document.createElement("button");
        placeCardLikeIcon.classList.add("place-card__like-icon");
        if (this.isLikedByMe) placeCardLikeIcon.classList.add("place-card__like-icon_liked");

        const likeCounter = document.createElement("p");
        likeCounter.classList.add("place-card__like-counter");
        likeCounter.textContent = this.likeCounter.toString();

        placeCard.appendChild(cardImage);
        cardImage.appendChild(deleteButton);
        placeCard.appendChild(placeCardDescription);
        placeCardDescription.appendChild(cardTitle);
        likeContainer.appendChild(placeCardLikeIcon);
        likeContainer.appendChild(likeCounter);
        placeCardDescription.appendChild(likeContainer);

        if (this.cardOwner === "others") {
            deleteButton.style.display = "none";
        }
        return placeCard;
    }
}
