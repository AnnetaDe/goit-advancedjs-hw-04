export * from "./render-functions.js";

// library imports
import flatpickr from "flatpickr";
import iziToast from "izitoast";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// function imports
import { fetchPhotosByQuery } from "./pixabay-api.js";
import simpleLightbox from "simplelightbox";
const searchForm = document.querySelector(".search-form");

const galleryUl = document.querySelector(".picture-and-data-list");
const loaderEl = document.querySelector(".loader");



function createGalleryItemMarkup({
  linkWeb,
  linkBig,
  tags,
  likes,
  views,
  comments,
  downloads
}) {
  const galleryItem = `
<li class="picture-and-data-item">
<div class="img-container">
      <a  class="image-link" href="${linkBig}"><img class="image" src="${linkWeb}" alt="${tags}" />
      </div>
      <ul class="under-picture-list">
          <li class="under-picture-info-item">Likes <span class="data-received">${likes}</span></li>
          <li class="under-picture-info-item">Views <span class="data-received">${views}</span></li>
          <li class="under-picture-info-item">Comments <span class="data-received">${comments}</span></li>
          <li class="under-picture-info-item">Downloads <span class="data-received">${downloads}</span></li>
      </ul>
  </li> 
  </a>`;
  return galleryItem;
}

const onSearchFormSubmit = event => {
  event.preventDefault();
  const query = event.target.elements.picture_search.value.trim();

  if (query === "") {
    galleryUl.innerHTML = "";
    event.target.reset();
    iziToast.error({
      title: "Error",
      message: "Please enter a search query",
      position: "topCenter"
    });
    return;
  }

  loaderEl.classList.add("is-visible");

  fetchPhotosByQuery(query)
    .finally(() => {
        
      loaderEl.classList.remove("is-visible");
    })
    .then(data => {
      const linksTags = data.hits.map(img => {
        
        return {
          linkWeb: img.webformatURL,
          linkBig: img.largeImageURL,
          tags: img.tags,
          likes: img.likes,
          views: img.views,
          comments: img.comments,
          downloads: img.downloads
        };
      });



      galleryUl.innerHTML = "";
      const galleryItemsMarkup = linksTags
        .map(createGalleryItemMarkup)
        .join("");
        
        
        
      galleryUl.insertAdjacentHTML("beforeend", galleryItemsMarkup);
      searchForm.reset();
      const lightbox = new SimpleLightbox(".image-link", {
        focus: true,
        captionsData: "alt",
        captionDelay: 250
      });
      lightbox.show();
      
    })
    .catch(error => {
      console.log(error);
    });
};

searchForm.addEventListener("submit", onSearchFormSubmit);
