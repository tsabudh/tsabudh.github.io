let modals = document.querySelectorAll(`[class^=modal-type-]`);

modals.forEach((modalContainer) => {
  console.log(modalContainer);
  let closeButton = modalContainer.querySelector(".close-modal-button");
  closeButton.addEventListener("click", () => {
    let className = modalContainer.classList[0];

    modalContainer.classList.add(`${className}--hidden`);
    document.body.style.overflow = "auto";
    // console.log(modalContainer);
    // console.log(modalContainer.classList[0]);
  });
});

// document.getElementById("skdModalToggle").addEventListener("click", (e) => {
//   let modalContainer = document.getElementsByClassName("modal-name-skd")[0];
//   let className = modalContainer.classList[0];
//   modalContainer.classList.remove(`${className}--hidden`);
//   document.body.style.overflow = "hidden";

//   console.log(modalContainer);
//   console.log(modalContainer.classList[0]);
// });

let toggleButtons = document.querySelectorAll(".toggle-modal-type-1");

console.log(toggleButtons);
toggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log(button.dataset.targetModal);
    let targetModal = document.getElementById(button.dataset.targetModal);
    let className = targetModal.classList[0];
    targetModal.classList.remove(`${className}--hidden`);
    document.body.style.overflow = "hidden";
  });
});
