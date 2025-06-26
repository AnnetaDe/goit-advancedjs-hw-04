import iziToast from "izitoast";

export const scroll = () => {
  document.querySelector(".bottom-scroll")?.scrollIntoView({ behavior: "smooth" });
};

export const scrollUp = () => {
  document.querySelector(".top-scroll")?.scrollIntoView({ behavior: "smooth" });
};

export const renderItemsMarkup = hits => hits.map(hit => `
  <li class="gallery-item">
    <div class="img-container">
      <a class="image-link" href="${hit.largeImageURL}">
        <img class="image" src="${hit.webformatURL}" alt="${hit.tags}" />
      </a>
    </div>
    <ul class="under-picture-list">
      <li class="under-picture-info-item">Likes <span class="data-received">${hit.likes}</span></li>
      <li class="under-picture-info-item">Views <span class="data-received">${hit.views}</span></li>
      <li class="under-picture-info-item">Comments <span class="data-received">${hit.comments}</span></li>
      <li class="under-picture-info-item">Downloads <span class="data-received">${hit.downloads}</span></li>
    </ul>
  </li>
`).join("");

export const refreshGallery = (galleryEl, formEl, errorMessage) => {
  galleryEl.innerHTML = "";
  formEl.reset();
  iziToast.error({
    message: errorMessage,
    position: "topRight",
    timeout: 2000
  });
};

export const removeLoadMoreBtn = btn => {
  btn.classList.add("is-hidden");
  btn.replaceWith(btn.cloneNode(true)); // removes all listeners safely
};

export const showLoadMoreBtn = (btn, loadMoreText) => {
  btn.classList.remove("is-hidden");
  btn.innerHTML = `<span class="load-more-text">${loadMoreText}</span>`;

};

export const showLoader = loaderEl => {
  loaderEl.classList.add("is-visible");
};

export const hideLoader = loaderEl => {
  loaderEl.classList.remove("is-visible");
};

export const showToast = (message, position = "topRight", timeout = 5000) => {
  iziToast.show({
    message,
    position,
    timeout
  });
}