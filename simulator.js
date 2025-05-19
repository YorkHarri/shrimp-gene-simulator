window.addEventListener("DOMContentLoaded", () => {

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);







const imagePaths = {
  spottedMale: "images/spottedMale.png",
  stripedMale: "images/stripedMale.png",
  plainMale: "images/plainMale.png",
  plainFemale: "images/plainFemale.png",
  stripedFemale: "images/stripedFemale.png",
  spottedFemale: "images/spottedFemale.png"
};

// Now you can use these variables in your content arrays
const leftBoxContent = [
  { content: `
      <div class="image-container">
        <img src="${imagePaths.spottedMale}" alt="Box 1 Image">
        <div class="text-box">Purpl</div>
      </div>
    `, backgroundColor: "#9C89B8" }, // Purple
  { content: `
      <div class="image-container">
        <img src="${imagePaths.spottedMale}" alt="Box 2 Image">
        <div class="text-box">Ping</div>
      </div>
    `, backgroundColor: "#F0A6CA" }, // Pink
  { content: `
      <div class="image-container">
        <img src="${imagePaths.stripedMale}" alt="Box 3 Image">
        <div class="text-box">Ligh ping</div>
      </div>
    `,  backgroundColor: "#FF00FF" }, // Heavy Pink
  { 
    content: `
      <div class="image-container">
        <img src="${imagePaths.plainMale}" alt="Box 4 Image">
        <div class="text-box">Blew</div>
      </div>
    `, 
    backgroundColor: "#B8BEDD" // Light Blue
  },
];

const rightBoxContent = [
  { content: `
      <div class="image-container">
        <img src="${imagePaths.plainFemale}" alt="Box 1 Image">
        <div class="text-box">Right 1</div>
      </div>
    `, backgroundColor: "#FFD166" }, // Yellow
  { content: `
      <div class="image-container">
        <img src="${imagePaths.plainFemale}" alt="Box 2 Image">
        <div class="text-box">Right 2</div>
      </div>
    `, backgroundColor: "#06D6A0" }, // Green
  { content: `
      <div class="image-container">
        <img src="${imagePaths.stripedFemale}" alt="Box 3 Image">
        <div class="text-box">Right 3</div>
      </div>
    `, backgroundColor: "#118AB2" }, // Blue
  { 
    content: `
      <div class="image-container">
        <img src="${imagePaths.spottedFemale}" alt="Box 4 Image">
        <div class="text-box">Right 4</div>
      </div>
    `, 
    backgroundColor: "#EF476F" // Red
  },
];


// Carousel logic for each list
function createCarousel(list, content) {
  let currentBoxContent = [...content]; // Clone the content array for each carousel

  function updateBoxContent() {
    const boxes = list.querySelectorAll('li');
    boxes.forEach((box, index) => {
      const boxData = currentBoxContent[index];
      if (boxData) {
        box.innerHTML = boxData.content; // Set the content
        box.style.backgroundColor = boxData.backgroundColor; // Set the background color
      }

      // Add click event listener to images (if any)
      const img = box.querySelector('img');
      if (img) {
        img.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent the image click from interfering
          slide(box); // Trigger the slide function for the parent box
        });
      }
    });
  }

  function next() {
    if (list.querySelector(".hide")) {
      list.querySelector(".hide").remove();
    }

    /* Step */
    if (list.querySelector(".prev")) {
      list.querySelector(".prev").classList.add("hide");
      list.querySelector(".prev").classList.remove("prev");
    }

    list.querySelector(".act").classList.add("prev");
    list.querySelector(".act").classList.remove("act");

    list.querySelector(".next").classList.add("act");
    list.querySelector(".next").classList.remove("next");

    /* New Next */
    list.querySelector(".new-next").classList.remove("new-next");

    // Move the first content to the end of the array
    currentBoxContent.push(currentBoxContent.shift());

    const addedEl = document.createElement('li');
    list.appendChild(addedEl);
    addedEl.classList.add("next", "new-next");

    // Update all box content
    updateBoxContent();
  }

  function prev() {
    list.querySelector(".new-next").remove();

    /* Step */
    list.querySelector(".next").classList.add("new-next");

    list.querySelector(".act").classList.add("next");
    list.querySelector(".act").classList.remove("act");

    list.querySelector(".prev").classList.add("act");
    list.querySelector(".prev").classList.remove("prev");

    /* New Prev */
    list.querySelector(".hide").classList.add("prev");
    list.querySelector(".hide").classList.remove("hide");

    // Move the last content to the beginning of the array
    currentBoxContent.unshift(currentBoxContent.pop());

    const addedEl = document.createElement('li');
    list.insertBefore(addedEl, list.firstChild);
    addedEl.classList.add("hide");

    // Update all box content
    updateBoxContent();
  }

  function slide(element) {
    /* Next slide */
    if (element.classList.contains('next')) {
      next();
    /* Previous slide */
    } else if (element.classList.contains('prev')) {
      prev();
    }
  }

  // Initialize box content on page load
  updateBoxContent();

  // Add click event listener to the list
  list.onclick = event => {
    slide(event.target);
  };
}

// Initialize carousels
const leftCarousel = $(".left-list");
const rightCarousel = $(".right-list");

createCarousel(leftCarousel, leftBoxContent);
createCarousel(rightCarousel, rightBoxContent);

// Swipe functionality
const swipe = new Hammer($(".swipe"));

swipe.on("swipeleft", (ev) => {
  const activeCarousel = ev.target.closest('.list');
  if (activeCarousel) {
    createCarousel(activeCarousel, activeCarousel.classList.contains('left-list') ? leftBoxContent : rightBoxContent).next();
  }
});

swipe.on("swiperight", (ev) => {
  const activeCarousel = ev.target.closest('.list');
  if (activeCarousel) {
    createCarousel(activeCarousel, activeCarousel.classList.contains('left-list') ? leftBoxContent : rightBoxContent).prev();
  }
});

});