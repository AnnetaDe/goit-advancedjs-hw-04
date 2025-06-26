import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import { getImages } from "./js/pixabay-api.js";
import {
  renderItemsMarkup,
  scroll,
  removeLoadMoreBtn,
  showLoadMoreBtn,
  refreshGallery,
  showLoader,
  hideLoader,
  showToast
} from "./js/render-functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".form");
  const galleryEl = document.querySelector(".gallery");
  const loaderEl = document.querySelector(".loader");
  const loadMoreImagesBtn = document.querySelector(".load-more-images-btn");
  const scrollUpBtn = document.querySelector(".scroll-to-top-btn");
  const userInput = document.querySelector("#user-search-input");

  const perPage = 15;
  let currentPage = 1;
  let totalPages = 0;
  let totalImages = 0;
  let totalHits = 0;
  let query = "";

  const lightbox = new SimpleLightbox(".image-link", {
    captionsData: "alt",
    captionDelay: 250,
  });

  loadMoreImagesBtn.classList.add("is-hidden");

  const onSearchFormSubmit = async (event) => {
    event.preventDefault();
    query = event.target.elements.picture_search.value.trim();
    currentPage = 1;

    if (query === "") {
      refreshGallery(galleryEl, searchForm, "Please enter a query.");
      return;
    }

    galleryEl.innerHTML = "";
    showLoader(loaderEl);

    try {
      const response = await getImages(query, currentPage, perPage);
      hideLoader(loaderEl);
      userInput.value = "";

      if (response.status !== 200 || !response.data) {
        refreshGallery(galleryEl, searchForm, "Error fetching images.");
        return;
      }

      const hits = response.data.hits;
      totalHits = response.data.totalHits;
      totalImages = response.data.total;
      totalPages = Math.ceil(totalHits / perPage);

      if (hits.length === 0) {
        refreshGallery(galleryEl, searchForm, "No images found.");
        return;
      }

      galleryEl.innerHTML = renderItemsMarkup(hits);
      lightbox.refresh();

      if (totalHits <= perPage) {
        removeLoadMoreBtn(loadMoreImagesBtn);
        showToast("We're sorry, but you've reached the end of search results.");
      } else {
        const remaining = totalImages - currentPage * perPage;
        const text = `Load more images ${remaining} of ${totalImages}`;
        showLoadMoreBtn(loadMoreImagesBtn, text);
      }

    } catch (error) {
      hideLoader(loaderEl);
      removeLoadMoreBtn(loadMoreImagesBtn);
      refreshGallery(galleryEl, searchForm, "Error fetching images.");
      console.error(error);
    }
  };

  const onLoadMoreBtnClick = async () => {
    currentPage++;
    showLoader(loaderEl);

    try {
      const response = await getImages(query, currentPage, perPage);
      hideLoader(loaderEl);

      if (response.status !== 200 || !response.data) {
        refreshGallery(galleryEl, searchForm, "Error fetching images.");
        return;
      }

      const hits = response.data.hits;
      galleryEl.insertAdjacentHTML("beforeend", renderItemsMarkup(hits));
      lightbox.refresh();
      scroll();

      const remaining = totalImages - currentPage * perPage;
      const text = `Load more images ${remaining} of ${totalImages}`;

      if (currentPage >= totalPages) {
        removeLoadMoreBtn(loadMoreImagesBtn);
        showToast("You've reached the end of search results.");
      } else {
        showLoadMoreBtn(loadMoreImagesBtn, text);
      }

    } catch (error) {
      hideLoader(loaderEl);
      console.error(error);
    }
  };

  // Scroll-up button logic
  window.addEventListener("scroll", () => {
    scrollUpBtn.classList.toggle("is-hidden", window.scrollY <= 400);
  });

  scrollUpBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  searchForm.addEventListener("submit", onSearchFormSubmit);
  loadMoreImagesBtn.addEventListener("click", onLoadMoreBtnClick);
});