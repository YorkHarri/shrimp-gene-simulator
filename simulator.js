window.addEventListener("DOMContentLoaded", () => {

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const imagePaths = {
  spottedMale: "images/spottedMale.png",
  stripedMale: "images/stripedMale.png",
  plainMale: "images/plainMale.png",
  plainFemale: "images/plainFemale.png",
  stripedFemale: "images/stripedFemale.png",
  spottedFemale: "images/spottedFemale.png",
  plainEgg: "images/plainEgg.png",
  stripedEgg: "images/stripedEgg.png",
  spottedEgg: "images/spottedEgg.png",
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

// Color + saturation genotype to color mapping
function getColorFromGenotype(genotype, saturationGenotype) {
  // Color alleles
  const alleles = genotype.slice().sort().join('');
  let baseColor;
  switch (alleles) {
    case "RR":
      baseColor = "#9C89B8"; // purple
      break;
    case "Rr":
    case "rR":
      baseColor = "#F0A6CA"; // pink
      break;
    case "rr":
      baseColor = "#B8BEDD"; // blue
      break;
    default:
      baseColor = "#FFD166"; // fallback (yellow)
  }

  // Saturation alleles: D = dark (dominant), d = light (recessive)
  const satAlleles = saturationGenotype.slice().sort().join('');
  // If at least one D, it's dark; otherwise, light
  const isDark = satAlleles.includes("D");

  // Combine color and saturation
  // Example: dark + pink = red, dark + blue = teal, dark + purple = magenta
  if (isDark) {
    switch (baseColor) {
      case "#F0A6CA": // pink
        return "#EF476F"; // red
      case "#B8BEDD": // blue
        return "#118AB2"; // teal
      case "#9C89B8": // purple
        return "#FF00FF"; // magenta
      default:
        return "#FFD166"; // fallback (yellow stays yellow)
    }
  } else {
    return baseColor;
  }
}

// Utility to generate a random allele from a list
function getRandomAllele(alleles) {
  return alleles[Math.floor(Math.random() * alleles.length)];
}

// 1. Generate shrimp dataset at the start, with color and saturation determined randomly
function generateShrimpDataset() {
  const colorAlleles = ["R", "r"];
  const saturationAlleles = ["D", "d"];

  const shrimpBase = [
    // MALES
    { id: 1, sex: "male", label: "Shamus", image: imagePaths.spottedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "P"] },
    { id: 2, sex: "male", label: "Shane", image: imagePaths.spottedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "P"] },
    { id: 3, sex: "male", label: "Shilo", image: imagePaths.stripedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "S"] },
    { id: 4, sex: "male", label: "Shawn", image: imagePaths.plainMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["P", "P"] },
    { id: 9, sex: "male", label: "Sharky", image: imagePaths.spottedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "P"] },
    { id: 10, sex: "male", label: "Shelton", image: imagePaths.stripedMale, sex_phenotype: "male", sex_genotype: ["X", "Y"], pattern_genotype: ["S", "S"] },
    // FEMALES
    { id: 5, sex: "female", label: "Shira", image: imagePaths.plainFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["P", "P"] },
    { id: 6, sex: "female", label: "Shandy", image: imagePaths.plainFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["P", "P"] },
    { id: 7, sex: "female", label: "Shayla", image: imagePaths.stripedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "S"] },
    { id: 8, sex: "female", label: "Shelly", image: imagePaths.spottedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "P"] },
    { id: 11, sex: "female", label: "Sherry", image: imagePaths.spottedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "P"] },
    { id: 12, sex: "female", label: "Shannon", image: imagePaths.stripedFemale, sex_phenotype: "female", sex_genotype: ["X", "X"], pattern_genotype: ["S", "S"] }
  ];

  return shrimpBase.map(shrimp => {
    // Randomly generate color and saturation genotypes
    const color_genotype = [getRandomAllele(colorAlleles), getRandomAllele(colorAlleles)];
    const saturation_genotype = [getRandomAllele(saturationAlleles), getRandomAllele(saturationAlleles)];
    return {
      ...shrimp,
      color_genotype,
      saturation_genotype,
      type: getPatternPhenotype(shrimp.pattern_genotype),
      pattern_phenotype: getPatternPhenotype(shrimp.pattern_genotype),
      color: getColorFromGenotype(color_genotype, saturation_genotype)
    };
  });
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

    // Always update the egg after any carousel content change
    updateEgg();
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

    // Add this:
    if (eggBatchGrid.style.display === 'grid') updateEggBatchGrid();
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

    if (eggBatchGrid.style.display === 'grid') updateEggBatchGrid();
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

function getActiveShrimp(sex) {
  const list = sex === "male" ? $(".left-list") : $(".right-list");
  const boxes = list.querySelectorAll('li');
  const actBox = Array.from(boxes).find(box => box.classList.contains('act'));
  if (!actBox) return null;
  // Find the shrimp by label in the box's HTML
  for (const shrimp of shrimpDataset) {
    if (actBox.innerHTML.includes(shrimp.label)) return shrimp;
  }
  return null;
}

function mixGenes(parent1, parent2) {
  // Randomly pick one allele from each parent for each gene
  function pick(alleles1, alleles2) {
    return [getRandomAllele(alleles1), getRandomAllele(alleles2)];
  }
  return {
    pattern_genotype: pick(parent1.pattern_genotype, parent2.pattern_genotype),
    color_genotype: pick(parent1.color_genotype, parent2.color_genotype),
    saturation_genotype: pick(parent1.saturation_genotype, parent2.saturation_genotype),
    sex_genotype: [getRandomAllele(parent1.sex_genotype), getRandomAllele(parent2.sex_genotype)]
  };
}

function getEggImage(pattern) {
  switch (pattern) {
    case "spotted": return imagePaths.spottedEgg;
    case "striped": return imagePaths.stripedEgg;
    case "plain":   return imagePaths.plainEgg;
    default:        return imagePaths.plainEgg;
  }
}

function updateEgg() {
  const male = getActiveShrimp("male");
  const female = getActiveShrimp("female");
  if (!male || !female) return;

  const eggGenotype = mixGenes(male, female);
  const pattern = getPatternPhenotype(eggGenotype.pattern_genotype);
  const color = getColorFromGenotype(eggGenotype.color_genotype, eggGenotype.saturation_genotype);
  const eggImg = getEggImage(pattern);

  // Update the egg image and info box together
  const eggContainer = document.querySelector('.large-image-container');
  eggContainer.innerHTML = `
    <div class="egg-info-container">
      <div class="info-box">Pattern: <b>${eggGenotype.pattern_genotype.join('/')}</b></div>
      <div class="info-box">Color: <b>${eggGenotype.color_genotype.join('/')}</b></div>
      <div class="info-box">Saturation: <b>${eggGenotype.saturation_genotype.join('/')}</b></div>
      <div class="info-box">Sex: <b>${eggGenotype.sex_genotype.join('/')}</b></div>
    </div>
    <img src="${eggImg}" alt="Shrimp egg" style="background:${color};border-radius:10px;">
  `;
}

// Patch carousel creation to update egg after every change
function patchCarouselUpdate(list, content) {
  const orig = createCarousel;
  createCarousel = function(list, content) {
    const carousel = orig(list, content);
    // Patch next/prev to update egg
    if (carousel) {
      const origNext = carousel.next;
      const origPrev = carousel.prev;
      carousel.next = function() { origNext(); updateEgg(); };
      carousel.prev = function() { origPrev(); updateEgg(); };
    }
    return carousel;
  };
}
patchCarouselUpdate();

// Initial egg display
updateEgg();

// Also update egg when user clicks on a shrimp image
document.querySelectorAll('.list').forEach(list => {
  list.addEventListener('click', () => setTimeout(updateEgg, 10));
});

// "Mix Genes" button event
const mixGenesBtn = document.getElementById('mix-genes-btn');
if (mixGenesBtn) {
  mixGenesBtn.addEventListener('click', () => {
    updateEgg(); // Just re-mix and update the egg using the current active shrimp
  });
}

const bigBatchBtn = document.getElementById('big-batch-btn');
const eggBatchGrid = document.querySelector('.egg-batch-grid');
const eggBatchGenotype = document.querySelector('.egg-batch-genotype');
const eggContainer = document.querySelector('.large-image-container');

function showEggBatchGrid(show) {
  eggBatchGrid.style.display = show ? 'grid' : 'none';
  eggBatchGenotype.style.display = show ? 'block' : 'none';
  eggContainer.style.display = show ? 'none' : 'block';
}

if (bigBatchBtn && eggBatchGrid && eggBatchGenotype) {
  bigBatchBtn.addEventListener('click', () => {
    updateEggBatchGrid();
  });
}

// Hide grid and show single egg when "Mix Genes" is clicked
if (mixGenesBtn) {
  mixGenesBtn.addEventListener('click', () => {
    showEggBatchGrid(false);
    updateEgg();
  });
}

// Update egg batch grid display
function updateEggBatchGrid() {
  const male = getActiveShrimp("male");
  const female = getActiveShrimp("female");
  if (!male || !female) return;

  showEggBatchGrid(true);

  eggBatchGrid.innerHTML = '';
  eggBatchGenotype.innerHTML = '<span style="color:#888;">Hover over an egg to see its genotype</span>';
  eggBatchGrid.style.gridTemplateColumns = 'repeat(4, 70px)';
  eggBatchGrid.style.gridGap = '18px';
  eggBatchGrid.style.justifyContent = 'center';
  eggBatchGrid.style.marginTop = '12px';

  const eggs = [];
  for (let i = 0; i < 16; i++) {
    const eggGenotype = mixGenes(male, female);
    const pattern = getPatternPhenotype(eggGenotype.pattern_genotype);
    const color = getColorFromGenotype(eggGenotype.color_genotype, eggGenotype.saturation_genotype);
    const eggImg = getEggImage(pattern);

    eggs.push({eggGenotype, pattern, color, eggImg});
  }

  eggs.forEach((egg, idx) => {
    const eggDiv = document.createElement('div');
    eggDiv.style.display = 'flex';
    eggDiv.style.flexDirection = 'column';
    eggDiv.style.alignItems = 'center';
    eggDiv.innerHTML = `
      <img src="${egg.eggImg}" alt="Egg" style="background:${egg.color};border-radius:10px;width:60px;height:60px;box-shadow:0 1px 4px rgba(0,0,0,0.08); cursor:pointer;">
    `;
    eggDiv.addEventListener('mouseenter', () => {
      eggBatchGenotype.innerHTML = `
        <div class="info-box" style="display:inline-block;">
          Pattern: <b>${egg.eggGenotype.pattern_genotype.join('/')}</b> &nbsp;
          Color: <b>${egg.eggGenotype.color_genotype.join('/')}</b> &nbsp;
          Saturation: <b>${egg.eggGenotype.saturation_genotype.join('/')}</b> &nbsp;
          Sex: <b>${egg.eggGenotype.sex_genotype.join('/')}</b>
        </div>
      `;
    });
    eggDiv.addEventListener('mouseleave', () => {
      eggBatchGenotype.innerHTML = '<span style="color:#888;">Hover over an egg to see its genotype</span>';
    });
    eggBatchGrid.appendChild(eggDiv);
  });
}
});