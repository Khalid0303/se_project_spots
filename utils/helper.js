export function setLoadingState(
  buttonElement,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save"
) {
  if (!buttonElement) return;

  buttonElement.textContent = isLoading ? loadingText : defaultText;
  buttonElement.disabled = isLoading;
}

export function enableValidation({
  formSelector,
  inputSelector,
  submitButtonSelector,
  inputErrorClass,
  errorClass,
}) {
  const formElements = Array.from(document.querySelectorAll(formSelector));

  formElements.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });

    const inputs = Array.from(formElement.querySelectorAll(inputSelector));
    const submitButton = formElement.querySelector(submitButtonSelector);

    toggleButtonState(inputs, submitButton, inputErrorClass, errorClass);

    inputs.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        checkInputValidity(
          formElement,
          inputElement,
          inputErrorClass,
          errorClass
        );
        toggleButtonState(inputs, submitButton, inputErrorClass, errorClass);
      });
    });
  });
}

// Other functions remain unchanged
