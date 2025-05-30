import { setLoadingState } from "../../utils/helper.js";
import Api from "../../utils/Api.js";
import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disabledButton,
} from "../scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2b30e7c9-342a-4e4c-ba4f-b64b90108030",
    "Content-Type": "application/json",
  },
});

let selectedCard;
let selectedCardId;
let userId;

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileAddButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector("#edit-profile-form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector("#add-card-form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEL = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector("#edit-avatar-form");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".modal__submit-btn_cancel"
);

// ============ Event Listeners ============

editModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) closeModal(editModal);
});

cardModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) closeModal(cardModal);
});

previewModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) closeModal(previewModal);
});

avatarModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) closeModal(avatarModal);
});

deleteModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) closeModal(deleteModal);
});

avatarModalBtn.addEventListener("click", () => {
  resetValidation(avatarForm, settings);
  const submitButton = avatarForm.querySelector(".modal__submit-btn");
  disabledButton(submitButton, settings);
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));
previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));
cardModalCloseBtn.addEventListener("click", () => closeModal(cardModal));
editModalCloseBtn.addEventListener("click", () => closeModal(editModal));
deleteModalCloseBtn.addEventListener("click", () => closeModal(deleteModal));
deleteModalCancelBtn.addEventListener("click", () => closeModal(deleteModal));

// ============ Form Submissions ============

avatarForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const avatarUrl = avatarInput.value;
  const submitButton = avatarForm.querySelector(".modal__submit-btn");

  setLoadingState(submitButton, true, "Saving...");

  api
    .editAvatarInfo({ avatar: avatarUrl })
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => console.error("Error saving avatar:", err))
    .finally(() => setLoadingState(submitButton, false, "Save"));
});

editFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const submitButton = editFormElement.querySelector(".modal__submit-btn");
  setLoadingState(submitButton, true, "Saving...");

  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => setLoadingState(submitButton, false, "Save"));
});

cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const submitButton = cardForm.querySelector(".modal__submit-btn");

  setLoadingState(submitButton, true, "Saving...");

  api
    .addCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((newCard) => {
      cardsList.prepend(getCardElement(newCard, userId));
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch((err) => console.error("Error adding card:", err))
    .finally(() => setLoadingState(submitButton, false, "Create"));
});

deleteModal.querySelector(".modal__form").addEventListener("submit", (e) => {
  e.preventDefault();
  const submitButton = deleteModal.querySelector(".modal__submit-btn");

  setLoadingState(submitButton, true, "Deleting...");

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => console.error("Error deleting card:", err))
    .finally(() => setLoadingState(submitButton, false, "Delete"));
});

// ============ Buttons ============

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editModal);
});

profileAddButton.addEventListener("click", () => {
  resetValidation(cardForm, settings);
  const submitButton = cardForm.querySelector(".modal__submit-btn");
  disabledButton(submitButton, settings);
  openModal(cardModal);
});

// ============ Helper Functions ============

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

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function getCardElement(data, userId) {
  const cardElement = cardTemplate.content
    .cloneNode(true)
    .querySelector(".card");
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDeleteButton = cardElement.querySelector(".card__delete-btn");
  const likeCountEl = cardElement.querySelector(".card__like-count");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardNameEl.textContent = data.name;

  const isLikedByUser = data.likes?.some((like) => like._id === userId);
  const isLiked = localStorage.getItem(`card-${data._id}-liked`) === "true";

  if (isLiked || isLikedByUser) {
    cardLikeButton.classList.add("card__like-btn_liked");
  }

  likeCountEl.textContent = Array.isArray(data.likes) ? data.likes.length : 0;

  cardLikeButton.addEventListener("click", () => {
    const apiCall = cardLikeButton.classList.contains("card__like-btn_liked")
      ? api.unlikeCard(data._id)
      : api.likeCard(data._id);

    apiCall
      .then((updatedCard) => {
        cardLikeButton.classList.toggle("card__like-btn_liked");
        likeCountEl.textContent = Array.isArray(updatedCard.likes)
          ? updatedCard.likes.length
          : 0;

        if (cardLikeButton.classList.contains("card__like-btn_liked")) {
          localStorage.setItem(`card-${data._id}-liked`, "true");
        } else {
          localStorage.removeItem(`card-${data._id}-liked`);
        }
      })
      .catch((err) => console.error("Error updating like status:", err));
  });

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data)
  );

  cardImageEl.addEventListener("click", () => {
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEL.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// ============ Load Initial Data ============

api
  .getAppInfo()
  .then(([userData, cards]) => {
    userId = userData._id;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;

    cards.forEach((cardData) => {
      cardsList.append(getCardElement(cardData, userId));
    });
  })
  .catch((err) => {
    console.error("Error loading app info:", err);
  });

enableValidation(settings);
