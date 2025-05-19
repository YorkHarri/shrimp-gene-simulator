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

// Predefined list of allowed colors
const allowedColors = [
  "#9C89B8", // purple
  "#F0A6CA", // pink
  "#FF00FF", // magenta
  "#B8BEDD", // blue
  "#FFD166", // yellow
  "#06D6A0", // green
  "#118AB2", // teal
  "#EF476F"  // red
];

// Utility to pick a random color from the allowed list
function getRandomColor() {
  return allowedColors[Math.floor(Math.random() * allowedColors.length)];
}

// 1. Generate shrimp dataset at the start, with random colors
function generateShrimpDataset() {
  return [
    { id: 1, sex: "male", type: "spotted", label: "Shamus", image: imagePaths.spottedMale },
    { id: 2, sex: "male", type: "spotted", label: "Shane", image: imagePaths.spottedMale },
    { id: 3, sex: "male", type: "striped", label: "Shilo", image: imagePaths.stripedMale },
    { id: 4, sex: "male", type: "plain", label: "Shawn", image: imagePaths.plainMale },
    { id: 5, sex: "female", type: "plain", label: "Shira", image: imagePaths.plainFemale },
    { id: 6, sex: "female", type: "plain", label: "Shandy", image: imagePaths.plainFemale },
    { id: 7, sex: "female", type: "striped", label: "Shayla", image: imagePaths.stripedFemale },
    { id: 8, sex: "female", type: "spotted", label: "Shelly", image: imagePaths.spottedFemale }
  ].map(shrimp => ({
    ...shrimp,
    color: getRandomColor()
  }));
}

const shrimpDataset = generateShrimpDataset();

// 2. Generate box content from dataset
function createBoxContent(sex) {
  return shrimpDataset
    .filter(shrimp => shrimp.sex === sex)
    .map(shrimp => ({
      content: `
        <div class="image-container">
          <img src="${shrimp.image}" alt="Shrimp">
          <div class="text-box">${shrimp.label}</div>
        </div>
      `,
      backgroundColor: shrimp.color
    }));
}

const leftBoxContent = createBoxContent("male");
const rightBoxContent = createBoxContent("female");


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