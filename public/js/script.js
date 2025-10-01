document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".show-more-btn");
  const show = document.querySelectorAll(".index-2, .index-3");
  let condition = false;

  btn.addEventListener("click", () => {
    condition = !condition;

    show.forEach(el => {
      el.style.display = condition ? "flex" : "none";
      if(condition) el.style.flexWrap = "wrap";
    });

    btn.textContent = condition ? "Show Less" : "Show More";
  });
});