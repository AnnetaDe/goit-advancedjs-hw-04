export * from "./render-functions.js";

// library imports
// import axios from "axios"; // Remove unused import
import { autocomplete } from '@algolia/autocomplete-js';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";

// function imports
import { getImages } from "./pixabay-api.js";
import simpleLightbox from "simplelightbox";

// local variables
const searchForm = document.querySelector(".search-form");
const galleryEl = document.querySelector(".picture-and-data-list");
const pictureCard = document.querySelector(".picture-and-data-item");
const loaderEl = document.querySelector(".loader");
const loadMoreImagesBtn = document.querySelector(".load-more-images-btn");
const userInput = document.querySelector("#user-search-input");
loadMoreImagesBtn.classList.add("is-hidden");
let query = "";
let currentPage = 1;

const scroll = () => {
  const scroll = document.querySelector(".bottom-scroll");
  scroll.scrollIntoView({
    behavior: "smooth"
  });
};

const scrollUp = () => {
  const scroll = document.querySelector(".top-scroll");
  scroll.scrollIntoView({
    behavior: "smooth"
  });
};

const lightbox = new SimpleLightbox(".image-link", {
  focus: true,
  captionsData: "alt",
  captionDelay: 250
});

function renderItemsMarkup(hits) {
  const galleryItemsMarkup = hits
    .map(hit => {
      return `
    <li class="picture-and-data-item">
    <div class="img-container">
          <a  class="image-link" href="${hit.largeImageURL}"><img class="image" src="${hit.webformatURL}" alt="${hit.tags}" />
          </div>
          <ul class="under-picture-list">
              <li class="under-picture-info-item">Likes <span class="data-received">${hit.likes}</span></li>
              <li class="under-picture-info-item">Views <span class="data-received">${hit.views}</span></li>
              <li class="under-picture-info-item">Comments <span class="data-received">${hit.comments}</span></li>
              <li class="under-picture-info-item">Downloads <span class="data-received">${hit.downloads}</span></li>
          </ul>
      </li> 
      </a>`;
    })
    .join("");
  return galleryItemsMarkup;
}

const removeLoadMoreBtn = () => {
  loadMoreImagesBtn.classList.add("is-hidden");
  loadMoreImagesBtn.removeEventListener("click", onLoadMoreBtnClick);
};

const showLoadMoreBtn = () => {
  loadMoreImagesBtn.classList.remove("is-hidden");
  loadMoreImagesBtn.addEventListener("click", onLoadMoreBtnClick);
};
const refreshGallery = (searchForm, errorMessage) => {
  galleryEl.innerHTML = "";

  searchForm.reset();

  iziToast.error({
    message: errorMessage,
    position: "topRight",
    timeout: 2000
  });

  removeLoadMoreBtn();
};

const onSearchFormSubmit = async event => {
  try {
    event.preventDefault();
    query = event.target.elements.picture_search.value.trim();
    currentPage = 1;
    
    const lightbox = new SimpleLightbox(".image-link", {
      focus: true,
      captionsData: "alt",
      captionDelay: 250
    });
    if (query === "") {
      refreshGallery(event.target, "Please enter a query.");
      return;
    }
    galleryEl.innerHTML = "";
    loaderEl.classList.add("is-visible");
    const response = await getImages(query, currentPage);
    loaderEl.classList.remove("is-visible");
    userInput.value = "";

    if (response.data.hits.length === 0) {
      refreshGallery(
        event.target,
        "No images found. Please enter another query."
      );
      
      return;
    }

    if (response.data.totalHits <= 15) {
      galleryEl.insertAdjacentHTML(
        "beforeend",
        renderItemsMarkup(response.data.hits)
      );
      lightbox.refresh();
      removeLoadMoreBtn();
      iziToast.warning({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",});
      return;
    }

    if (response.data.totalHits > 15) {
      galleryEl.innerHTML = renderItemsMarkup(response.data.hits);
      lightbox.refresh();
      showLoadMoreBtn();
      loadMoreImagesBtn.addEventListener("click", onLoadMoreBtnClick);
      scroll();
    }
   
  } catch (error) {
    loaderEl.classList.remove("is-visible");
    console.log(error);
  }
};

const onLoadMoreBtnClick = async event => {
  try {
    currentPage += 1;
    const response = await getImages(query, currentPage);
    galleryEl.insertAdjacentHTML(
      "beforeend",
      renderItemsMarkup(response.data.hits)
    );
    new SimpleLightbox(".image-link", {
      focus: true,
      captionsData: "alt",
      captionDelay: 250
    });
   
    scroll();

    let totalPages = Math.ceil(response.data.totalHits / 15);

    if (currentPage === totalPages ) {
      removeLoadMoreBtn();
      iziToast.warning({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight"
      });
      
      setTimeout(() => {
        scrollUp();
      }, 5000);
      
    }
    
     loaderEl.classList.remove("is-visible");
    
  } catch (error) {
   
    console.log(error);
  }
};

searchForm.addEventListener("submit", onSearchFormSubmit);



autocomplete({
  container: '#autocomplete',
  placeholder: 'Search for images',
});