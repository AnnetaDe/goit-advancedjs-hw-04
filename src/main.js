// import "./js/pixabay-api.js";
// import "./js/render-functions.js";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import iziToast from "izitoast";
import { getImages } from "./js/pixabay-api.js";
import { renderItemsMarkup, scroll, removeLoadMoreBtn, showLoadMoreBtn,refreshGallery, showLoader, hideLoader, showToast  } from "./js/render-functions.js";


document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".form");
    const galleryEl = document.querySelector(".gallery");
    const loaderEl = document.querySelector(".loader");
    const loadMoreImagesBtn = document.querySelector(".load-more-images-btn");

    const scrollUpBtn = document.querySelector(".scroll-to-top-btn");
    loadMoreImagesBtn.classList.add("is-hidden");

    const userInput = document.querySelector("#user-search-input");
  
    let currentPage = 1;
    let totalPages = 0;
    let totalImages = 0;
    let totalHits = 0;
    let query = "";
    const perPage = 15; 

    let loadMoreText = `Load more images ${totalImages - currentPage * perPage} of ${totalImages}`;

    let lightbox = new SimpleLightbox(".image-link", {
      captionsData: "alt",
      captionDelay: 250,
    });
  
    loadMoreImagesBtn.classList.add("is-hidden");
  const onSearchFormSubmit = async event => {
    try {
      event.preventDefault();
      query = event.target.elements.picture_search.value.trim();
      currentPage = 1;
  
      if (!lightbox) {
        lightbox = new SimpleLightbox(".image-link", {
          focus: true,
          captionsData: "alt",
          captionDelay: 250
        });
      }
  
      if (query === "") {
        refreshGallery(event.target, "Please enter a query.");
        return;
      }
  
      galleryEl.innerHTML = "";
        showLoader(loaderEl);
      const response = await getImages(query, currentPage, perPage);
      console.log(response);
      totalImages = response.data.total;
        if (response.status !== 200) {
            hideLoader(loaderEl);
            refreshGallery(event.target, "Error fetching images. Please try again.");
            return;
        }
        if (!response || !response.data) {
            refreshGallery(event.target, "No images found. Please enter another query.");
            return;
        }
      hideLoader(loaderEl);
      userInput.value = "";
  
      if (response.data.hits.length === 0) {
        refreshGallery(
          event.target,
          "No images found. Please enter another query."
        );
        return;
      }
  
      galleryEl.innerHTML = renderItemsMarkup(response.data.hits);
      lightbox.refresh();
  
      totalHits = response.data.totalHits;
      console.log(`Total hits: ${totalHits}`);
      totalPages = Math.ceil(totalHits / perPage);
      console.log(`Total pages: ${totalPages}`);


      if (totalHits <= perPage) {
        removeLoadMoreBtn();
        showToast("We're sorry, but you've reached the end of search results.");
      } else {
        loadMoreText = `Load more images ${totalImages - currentPage * perPage} of ${totalImages}`;
        showLoadMoreBtn(loadMoreImagesBtn, loadMoreText);
      }
  
    } catch (error) {
      hideLoader(loaderEl);
      const remaining = totalImages - currentPage * perPage;
        loadMoreText = `Load more images ${remaining} of ${totalImages}`;

        removeLoadMoreBtn(loadMoreImagesBtn);
        refreshGallery(event.target, "Error fetching images. Please try again.");

      console.error(error);
    }
  };

  const onLoadMoreBtnClick = async () => {
    try {
      currentPage++;
      showLoader(loaderEl);
        loadMoreText = `Load more images ${totalImages - currentPage * perPage} of ${totalImages}`;
      const response = await getImages(query, currentPage, perPage);

        console.log(currentPage, totalPages);
        if (response.status !== 200) {
            hideLoader(loaderEl);
            refreshGallery(target, "Error fetching images. Please try again.");
            return;
        }
        if (!response || !response.data) {
            refreshGallery(target, "No images found. Please enter another query.");
            return;
        }
      hideLoader(loaderEl);


      galleryEl.insertAdjacentHTML(
        "beforeend",
        renderItemsMarkup(response.data.hits)
      );
      lightbox.refresh();
      scroll();
      const remaining = totalImages - currentPage * perPage;
      const text = `Load more images ${remaining} of ${totalImages}`;
  
        if (currentPage >= totalPages) {
            removeLoadMoreBtn(loadMoreImagesBtn);
            showToast("We're sorry, but you've reached the end of search results.");
        }
        else {
            showLoadMoreBtn(loadMoreImagesBtn, text);
        }
  
    } catch (error) {
      hideLoader(loaderEl);
      console.error(error);
    }
  };
  searchForm.addEventListener("submit", onSearchFormSubmit);
loadMoreImagesBtn.addEventListener("click", onLoadMoreBtnClick);
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      scrollUpBtn.classList.remove("is-hidden");
    } else {
      scrollUpBtn.classList.add("is-hidden");
    }
  });
  
  scrollUpBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  });




