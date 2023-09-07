// Import Axios
import axios from 'axios';

// Import Notiflix
import Notiflix from 'notiflix';

// Import SimpleLightbox
import SimpleLightbox from 'simplelightbox';

// Additional import for SimpleLightbox styles (if using a bundler like Webpack)
import 'simplelightbox/dist/simple-lightbox.min.css';

// Your Pixabay API key
const apiKey = '39310917-6ff177e3dc10cf07da84df6f8';

// Elements
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchQueryInput = document.getElementById('searchQuery');

let page = 1;
const perPage = 20;
let currentQuery = '';

// Initialize SimpleLightbox
const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentQuery = searchQueryInput.value.trim();

  if (!currentQuery) {
    return;
  }

  clearGallery();
  page = 1;
  await fetchImages(currentQuery, page);
});

loadMoreBtn.addEventListener('click', async () => {
  page++;
  await fetchImages(currentQuery, page);
});

async function fetchImages(query, currentPage) {
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.hits.length === 0) {
      displayMessage("Sorry, there are no images matching your search query. Please try again.");
      return;
    }

    displayImages(data.hits);

    // if (currentPage === 1) {
    //   displayMessage(`Hooray! We found ${data.totalHits} images.`);
    // }

    if (currentPage * perPage < data.totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      displayMessage("We're sorry, but you've reached the end of search results.");
    }

    // Refresh SimpleLightbox after adding new images
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

function displayImages(images) {
  images.forEach((image) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

function clearGallery() {
  gallery.innerHTML = '';
}

function displayMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  messageDiv.textContent = message;
  gallery.appendChild(messageDiv);
}npm