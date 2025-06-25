export * from "./pixabay-api.js";

// lib imports
import axios from "axios";
import flatpickr from "flatpickr";
import iziToast from "izitoast";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const API_KEY = "3024031-50bf2ca6b1e9bc3513f045fb3";

export async function getImages(query, page) {
  let currentPage = 1;
  let qtyPerPage = 15;
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
    per_page: qtyPerPage,
    page
  });
  const baseUrl = `https://pixabay.com/api/?${searchParams.toString()}`;
  return axios.get(baseUrl);
}


