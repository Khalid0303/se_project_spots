const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

console.log(initialCards);

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");

editModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) closeModal(editModal);
});

const editFormElement = editModal.querySelector("#edit-profile-form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
cardModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) closeModal(cardModal);
});

const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");
const cardForm = cardModal.querySelector("#add-card-form");

const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
previewModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) closeModal(previewModal);
});

const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEL = previewModal.querySelector(".modal__caption");

const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_liked");
  });
  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEL.textContent = data.name;
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });
  return cardElement;
}

function handlePressEsc(event) {
  if (event.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    closeModal(modal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handlePressEsc);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handlePressEsc);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  evt.target.reset();
  disabledButton(cardSubmitButton, settings);

  closeModal(cardModal);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, settings);
  openModal(editModal);
});

profileAddButton.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  cardsList.prepend(cardElement);
}
