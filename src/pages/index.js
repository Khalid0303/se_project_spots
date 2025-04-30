import Api from "../../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2b30e7c9-342a-4e4c-ba4f-b64b90108030",
    "Content-Type": "application/json",
  },
});

import "./index.css";

import {
  enableValidation,
  settings,
  resetValidation,
  disabledButton,
} from "../scripts/validation.js";

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

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

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

// Avatar Modal Setup
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");

// Add this similar to other modals
avatarModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) closeModal(avatarModal);
});

// When opening avatar modal, reset validation
avatarModalBtn.addEventListener("click", () => {
  resetValidation(avatarForm, settings);
  const submitButton = avatarForm.querySelector(".modal__submit-btn");
  disabledButton(submitButton, settings);
  openModal(avatarModal);
});

// Close the avatar modal when the close button is clicked
avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

// Add submit event listener
avatarForm.addEventListener("submit", (evt) => {
  console.log("Form submit triggered"); // Debugging log
  handleAvatarSubmit(evt);
});

function handleAvatarSubmit(evt) {
  console.log("Inside handleAvatarSubmit"); // Debugging log
  evt.preventDefault();

  const avatarUrl = avatarInput.value;
  console.log("Avatar URL:", avatarUrl); // Debugging log to check input value

  api
    .editAvatarInfo({ avatar: avatarUrl })
    .then((data) => {
      if (data && data.avatar) {
        profileAvatar.src = data.avatar; // Ensure you're updating the `src` attribute
      } else {
        console.error("API response does not contain avatar URL:", data);
      }
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error("Error saving avatar:", err);
    });
}

function handleDeleteCard(evt) {
  evt.target.closest(".card").remove();
  openModal(deleteModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .cloneNode(true)
    .querySelector(".card");

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDeleteButton = cardElement.querySelector(".card__delete-btn");

  cardLikeButton.addEventListener("click", function () {
    cardLikeButton.classList.toggle("card__like-btn_liked");
  });

  cardDeleteButton.addEventListener("click", function () {
    openModal(deleteModal);
  });

  cardElement.querySelector(".card__image").src = data.link;
  cardElement.querySelector(".card__image").alt = data.name;
  cardNameEl.textContent = data.name;

  return cardElement;
}

function renderCards() {
  initialCards.forEach(function (data) {
    cardsList.append(getCardElement(data));
  });
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalOnEsc);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalOnEsc);
}

function closeModalOnEsc(event) {
  if (event.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    closeModal(openModal);
  }
}

profileEditButton.addEventListener("click", function () {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  openModal(editModal);
});

profileAddButton.addEventListener("click", function () {
  resetValidation(cardForm, settings);
  const submitButton = cardForm.querySelector(".modal__submit-btn");
  disabledButton(submitButton, settings);
  openModal(cardModal);
});

editModalCloseBtn.addEventListener("click", function () {
  closeModal(editModal);
});

editFormElement.addEventListener("submit", function (event) {
  event.preventDefault();

  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
});

cardModalCloseBtn.addEventListener("click", function () {
  closeModal(cardModal);
});

cardForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const cardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  cardsList.prepend(getCardElement(cardData));
  cardForm.reset();
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});
renderCards();
enableValidation(settings);
