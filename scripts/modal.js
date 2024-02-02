let modals = document.querySelectorAll(`[class^=modal-type-]`);
console.log(modals);
modals.forEach((modalContainer) => {
  console.log(modalContainer);
  let closeButton = modalContainer.querySelector(".close-modal-button");
  closeButton.addEventListener("click", () => {
    let className = modalContainer.classList[0];
    modalContainer.classList.toggle(`${className}--hidden`);
    // console.log(modalContainer);
    // console.log(modalContainer.classList[0]);
  });
});

document.getElementById("skdModalToggle").addEventListener("click", (e) => {
  let modalContainer = document.getElementsByClassName("modal-name-skd")[0];
  let className = modalContainer.classList[0];
  modalContainer.classList.toggle(`${className}--hidden`);
  console.log(modalContainer);
  console.log(modalContainer.classList[0]);
});
