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

function getPatternPhenotype(genotype) {
  if (genotype.includes("S") && genotype.includes("P")) return "spotted";
  if (genotype.includes("S")) return "striped";
  if (genotype.includes("P")) return "plain";
  return "unknown";
}

// 1. Generate shrimp dataset at the start, with random colors
function generateShrimpDataset() {
  const shrimpBase = [
    // MALES
    { id: 1, sex: "male", label: "Shamus", image: imagePaths.spottedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "P"], color_genotype: ["R", "r"], saturation_genotype: ["D", "d"] },
    { id: 2, sex: "male", label: "Shane", image: imagePaths.spottedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "P"], color_genotype: ["R", "R"], saturation_genotype: ["D", "D"] },
    { id: 3, sex: "male", label: "Shilo", image: imagePaths.stripedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "S"], color_genotype: ["r", "r"], saturation_genotype: ["d", "d"] },
    { id: 4, sex: "male", label: "Shawn", image: imagePaths.plainMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["P", "P"], color_genotype: ["R", "r"], saturation_genotype: ["D", "d"] },
    { id: 9, sex: "male", label: "Sharky", image: imagePaths.spottedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "P"], color_genotype: ["R", "r"], saturation_genotype: ["D", "d"] },
    { id: 10, sex: "male", label: "Shelton", image: imagePaths.stripedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "S"], color_genotype: ["R", "R"], saturation_genotype: ["D", "D"] },
    // FEMALES
    { id: 5, sex: "female", label: "Shira", image: imagePaths.plainFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["P", "P"], color_genotype: ["r", "r"], saturation_genotype: ["d", "d"] },
    { id: 6, sex: "female", label: "Shandy", image: imagePaths.plainFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["P", "P"], color_genotype: ["R", "r"], saturation_genotype: ["D", "d"] },
    { id: 7, sex: "female", label: "Shayla", image: imagePaths.stripedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "S"], color_genotype: ["R", "R"], saturation_genotype: ["D", "D"] },
    { id: 8, sex: "female", label: "Shelly", image: imagePaths.spottedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "P"], color_genotype: ["r", "r"], saturation_genotype: ["d", "d"] },
    { id: 11, sex: "female", label: "Sherry", image: imagePaths.spottedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "P"], color_genotype: ["R", "r"], saturation_genotype: ["D", "d"] },
    { id: 12, sex: "female", label: "Shannon", image: imagePaths.stripedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "S"], color_genotype: ["R", "R"], saturation_genotype: ["D", "D"] }
  ];

  return shrimpBase.map(shrimp => ({
    ...shrimp,
    type: getPatternPhenotype(shrimp.pattern_genotype),
    pattern_phenotype: getPatternPhenotype(shrimp.pattern_genotype),
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
    let actBox = Array.from(boxes).find(box => box.classList.contains('act'));
    let actContent = null;

    // Find the content for the .act box
    if (actBox) {
      let actIdx = Array.from(boxes).indexOf(actBox);
      actContent = currentBoxContent[actIdx] || null;
    }

    boxes.forEach((box, index) => {
      let boxData = null;
      if (box.classList.contains('info')) {
        // Show all genotypes for the active shrimp
        if (actContent) {
          const shrimp = shrimpDataset.find(s => actContent.content.includes(s.label));
          if (shrimp) {
            box.innerHTML = `
              <div class="info-box">Pattern: <b>${shrimp.pattern_genotype.join('/')}</b></div>
              <div class="info-box">Color: <b>${shrimp.color_genotype.join('/')}</b></div>
              <div class="info-box">Saturation: <b>${shrimp.saturation_genotype.join('/')}</b></div>
              <div class="info-box">Sex: <b>${shrimp.sex_genotype.join('/')}</b></div>
            `;
            box.style.backgroundColor = "transparent";
            box.style.display = "flex";
            box.style.flexDirection = "column";
            box.style.gap = "6px";
            box.style.alignItems = "center";
            box.style.justifyContent = "center";
          } else {
            box.innerHTML = "";
            box.style.backgroundColor = "transparent";
          }
        } else {
          box.innerHTML = "";
          box.style.backgroundColor = "transparent";
        }
      } else {
        boxData = currentBoxContent[index] || null;
        if (boxData) {
          box.innerHTML = boxData.content;
          box.style.backgroundColor = boxData.backgroundColor;
        } else {
          box.innerHTML = "";
          box.style.backgroundColor = "transparent";
        }
      }

      // Only add click event to non-below boxes
      const img = box.querySelector('img');
      if (img && !box.classList.contains('below')) {
        img.onclick = (event) => {
          event.stopPropagation();
          slide(box);
        };
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