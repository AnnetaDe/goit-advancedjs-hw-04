export * from "./pixabay-api.js";

export const fetchPhotosByQuery = query => {
  const API_KEY = "3024031-50bf2ca6b1e9bc3513f045fb3";
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true"
  });
  console.log(searchParams.toString());
  const urlbold = 'https://pixabay.com/api/'
  // https://pixabay.com/api/?key=3024031-50bf2ca6b1e9bc3513f045fb3&q=yellow+flowers&image_type=photo
  // https://pixabay.com/api/?key=3024031-50bf2ca6b1e9bc3513f045fb3&query=13&image_type=photo&orientation=horizontal&safesearch=true
  
  const baseUrl = `https://pixabay.com/api/?${searchParams.toString()}`;
  console.log(baseUrl);

  return fetch(baseUrl).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
