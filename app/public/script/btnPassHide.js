(function btnPassHide() {
  const allBtnSHP = document.querySelectorAll(".btn-show-hide-pwd");
  if (!allBtnSHP) {
    return;
  }
  allBtnSHP.forEach((button) => {

    const forElement = document.getElementById(button.dataset.for);
    if (!forElement) {
      return
    }

    if (forElement && forElement instanceof HTMLInputElement) {
      ["mousedown", "touchstart"].forEach((eventName) => {
        button.addEventListener(eventName, () => {
          forElement.setAttribute("type", "text");
        });
      });

      ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(
        (eventName) => {
          button.addEventListener(eventName, (e) => {
            e.preventDefault();
            forElement.setAttribute("type", "password");
          });
        }
      );
    }
  });
}())