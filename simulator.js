window.addEventListener("DOMContentLoaded", () => {
  // Utility selectors
  const $ = selector => document.querySelector(selector);

  // Image paths
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

  // Color + saturation genotype to color mapping
  function getColorFromGenotype(genotype, saturationGenotype) {
    const alleles = genotype.slice().sort().join('');
    let baseColor;
    switch (alleles) {
      case "BB": baseColor = "blue"; break;
      case "RR": baseColor = "red"; break;
      case "gg": baseColor = "green"; break;
      case "BR":
      case "RB": baseColor = "brown"; break;
      case "Bg":
      case "gB": baseColor = "blue"; break;
      case "gR":
      case "Rg": baseColor = "red"; break;
      default: baseColor = "green";
    }
    const sat = saturationGenotype.slice().sort().join('');
    const satLevel = (sat === "ll") ? "light" : "dark";
    const colorMap = {
      red:    { light: "#ffb3b3", dark: "#990000" },
      blue:   { light: "#b3b3ff", dark: "#000099" },
      green:  { light: "#b3ffb3", dark: "#009900" },
      brown:  { light: "#ffcc99", dark: "#4b2e0f" }
    };
    return colorMap[baseColor]?.[satLevel] || "#000000";
  }

  function getPatternPhenotype(genotype) {
    if (genotype.includes("S") && genotype.includes("P")) return "spotted";
    if (genotype.includes("S")) return "striped";
    if (genotype.includes("P")) return "plain";
    // If you never expect "unknown", you could log a warning here
    return "unknown";
  }

  function getRandomAllele(alleles) {
    return alleles[Math.floor(Math.random() * alleles.length)];
  }

  function getNamedGenotype(genotype, type) {
    const maps = {
      color: { R: "RED", B: "BLUE", g: "green" },
      saturation: { l: "light", D: "DARK" },
      pattern: { S: "STRIPED", P: "PLAIN" }
    };
    return genotype.map(allele => maps[type][allele] || allele);
  }

  // Generate shrimp dataset
  function generateShrimpDataset() {
    const colorAlleles = ["R", "B", "g"];
    const saturationAlleles = ["l", "D"];
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
      const color_genotype = [getRandomAllele(colorAlleles), getRandomAllele(colorAlleles)];
      const saturation_genotype = [getRandomAllele(saturationAlleles), getRandomAllele(saturationAlleles)];
      return {
        ...shrimp,
        color_genotype,
        saturation_genotype,
        color_genotype_named: getNamedGenotype(color_genotype, 'color'),
        saturation_genotype_named: getNamedGenotype(saturation_genotype, 'saturation'),
        pattern_genotype_named: getNamedGenotype(shrimp.pattern_genotype, 'pattern'),
        type: getPatternPhenotype(shrimp.pattern_genotype),
        pattern_phenotype: getPatternPhenotype(shrimp.pattern_genotype),
        color: getColorFromGenotype(color_genotype, saturation_genotype)
      };
    });
  }

  const shrimpDataset = generateShrimpDataset();

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

  // Helper to get active box and shrimp
  function getActiveBoxAndShrimp(list, sex) {
    const boxes = list.querySelectorAll('li');
    const actBox = Array.from(boxes).find(box => box.classList.contains('act'));
    if (!actBox) return { actBox: null, shrimp: null };
    const shrimp = shrimpDataset.find(s => actBox.innerHTML.includes(s.label)) || null;
    return { actBox, shrimp };
  }

  // Carousel logic
  function createCarousel(list, content) {
    let currentBoxContent = [...content];

    function updateBoxContent() {
      const boxes = list.querySelectorAll('li');
      const actBox = Array.from(boxes).find(box => box.classList.contains('act'));
      const actIdx = actBox ? Array.from(boxes).indexOf(actBox) : -1;
      const actContent = actIdx >= 0 ? currentBoxContent[actIdx] : null;

      boxes.forEach((box, index) => {
        if (box.classList.contains('info')) {
          if (actContent) {
            const shrimp = shrimpDataset.find(s => actContent.content.includes(s.label));
            if (shrimp) {
              box.innerHTML = `
                <div class="info-box">Pattern: <br><b>${shrimp.pattern_genotype_named.join(', ')}</b></div>
                <div class="info-box">Color: <br><b>${shrimp.color_genotype_named.join(', ')}</b></div>
                <div class="info-box">Saturation: <br><b>${shrimp.saturation_genotype_named.join(', ')}</b></div>
                <div class="info-box">Sex: <b>${shrimp.sex_genotype.join('/')}</b></div>
              `;
            } else {
              box.innerHTML = "";
            }
          } else {
            box.innerHTML = "";
          }
          Object.assign(box.style, {
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "center",
            justifyContent: "center"
          });
        } else {
          const boxData = currentBoxContent[index];
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
          // Use addEventListener instead of onclick
          img.addEventListener('click', event => {
            event.stopPropagation();
            slide(box);
          }, { once: true });
        }
      });

      updateEgg();
    }

    // Carousel navigation functions
    function next() {
      if (list.querySelector(".hide")) list.querySelector(".hide").remove();
      if (list.querySelector(".prev")) {
        list.querySelector(".prev").classList.add("hide");
        list.querySelector(".prev").classList.remove("prev");
      }
      list.querySelector(".act").classList.add("prev");
      list.querySelector(".act").classList.remove("act");
      list.querySelector(".next").classList.add("act");
      list.querySelector(".next").classList.remove("next");
      list.querySelector(".new-next").classList.remove("new-next");
      currentBoxContent.push(currentBoxContent.shift());
      const addedEl = document.createElement('li');
      list.appendChild(addedEl);
      addedEl.classList.add("next", "new-next");
      updateBoxContent();
      if (eggBatchGrid.style.display === 'grid') updateEggBatchGrid();
    }

    function prev() {
      list.querySelector(".new-next").remove();
      list.querySelector(".next").classList.add("new-next");
      list.querySelector(".act").classList.add("next");
      list.querySelector(".act").classList.remove("act");
      list.querySelector(".prev").classList.add("act");
      list.querySelector(".prev").classList.remove("prev");
      list.querySelector(".hide").classList.add("prev");
      list.querySelector(".hide").classList.remove("hide");
      currentBoxContent.unshift(currentBoxContent.pop());
      const addedEl = document.createElement('li');
      list.insertBefore(addedEl, list.firstChild);
      addedEl.classList.add("hide");
      updateBoxContent();
      if (eggBatchGrid.style.display === 'grid') updateEggBatchGrid();
    }

    function slide(element) {
      if (element.classList.contains('next')) next();
      else if (element.classList.contains('prev')) prev();
    }

    updateBoxContent();
    list.addEventListener('click', event => slide(event.target));

    // Expose for swipe support
    return { next, prev };
  }

  // DOM elements
  const leftCarousel = $(".left-list");
  const rightCarousel = $(".right-list");
  const eggBatchGrid = document.querySelector('.egg-batch-grid');
  const eggBatchGenotype = document.querySelector('.egg-batch-genotype');
  const eggContainer = document.querySelector('.large-image-container');
  const mixGenesBtn = document.getElementById('mix-genes-btn');
  const bigBatchBtn = document.getElementById('big-batch-btn');

  // Initialize carousels
  const leftCarouselObj = createCarousel(leftCarousel, leftBoxContent);
  const rightCarouselObj = createCarousel(rightCarousel, rightBoxContent);

  // Swipe functionality
  if (window.Hammer) {
    const swipe = new Hammer($(".swipe"));
    swipe.on("swipeleft", () => leftCarouselObj.next());
    swipe.on("swiperight", () => leftCarouselObj.prev());
  }

  // Helper to get active shrimp by sex
  function getActiveShrimp(sex) {
    const list = sex === "male" ? $(".left-list") : $(".right-list");
    const { shrimp } = getActiveBoxAndShrimp(list, sex);
    return shrimp;
  }

  // Refactored mixGenes to use destructuring for clarity
  function mixGenes(parent1, parent2) {
    const pick = (alleles1, alleles2) => [getRandomAllele(alleles1), getRandomAllele(alleles2)];
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

  function showEggBatchGrid(show) {
    eggBatchGrid.style.display = show ? 'grid' : 'none';
    eggBatchGenotype.style.display = show ? 'block' : 'none';
    eggContainer.style.display = show ? 'none' : 'block';
  }

  function updateEggBatchGrid() {
    const male = getActiveShrimp("male");
    const female = getActiveShrimp("female");
    if (!male || !female) return;
    showEggBatchGrid(true);
    eggBatchGrid.innerHTML = '';
    eggBatchGenotype.innerHTML = '<span style="color:#888;">Hover over an egg to see its genotype</span>';
    eggBatchGrid.style.gridTemplateColumns = 'repeat(6, 70px)';
    eggBatchGrid.style.gridGap = '18px';
    eggBatchGrid.style.justifyContent = 'center';
    eggBatchGrid.style.marginTop = '12px';
    for (let i = 0; i < 24; i++) {
      const eggGenotype = mixGenes(male, female);
      const pattern = getPatternPhenotype(eggGenotype.pattern_genotype);
      const color = getColorFromGenotype(eggGenotype.color_genotype, eggGenotype.saturation_genotype);
      const eggImg = getEggImage(pattern);
      const eggDiv = document.createElement('div');
      eggDiv.style.display = 'flex';
      eggDiv.style.flexDirection = 'column';
      eggDiv.style.alignItems = 'center';
      eggDiv.innerHTML = `
        <img src="${eggImg}" alt="Egg" style="background:${color};border-radius:10px;width:60px;height:60px;box-shadow:0 1px 4px rgba(0,0,0,0.08); cursor:pointer;">
      `;
      eggDiv.addEventListener('mouseenter', () => {
        eggBatchGenotype.innerHTML = `
          <div class="info-box" style="display:inline-block;">
            Pattern: <b>${eggGenotype.pattern_genotype.join('/')}</b> &nbsp;
            Color: <b>${eggGenotype.color_genotype.join('/')}</b> &nbsp;
            Saturation: <b>${eggGenotype.saturation_genotype.join('/')}</b> &nbsp;
            Sex: <b>${eggGenotype.sex_genotype.join('/')}</b>
          </div>
        `;
      });
      eggDiv.addEventListener('mouseleave', () => {
        eggBatchGenotype.innerHTML = '<span style="color:#888;">Hover over an egg to see its genotype</span>';
      });
      eggBatchGrid.appendChild(eggDiv);
    }
  }

  // Initial egg display
  updateEgg();

  // Event listeners
  document.querySelectorAll('.list').forEach(list => {
    list.addEventListener('click', () => setTimeout(updateEgg, 10));
  });

  if (mixGenesBtn) {
    mixGenesBtn.addEventListener('click', () => {
      showEggBatchGrid(false);
      updateEgg();
    });
  }

  if (bigBatchBtn) {
    bigBatchBtn.addEventListener('click', () => {
      updateEggBatchGrid();
    });
  }
});