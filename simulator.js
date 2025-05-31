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
      red:    { light: "#fe8489", dark: "#aa1d27" },
      blue:   { light: "#7ca3dc", dark: "#0352ce" },
      green:  { light: "#98db9c", dark: "#119523" },
      brown:  { light: "#ac775e", dark: "#5a4232" }
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

  // Generate lethal alleles
  function generateLethalAlleles(num = 10, trueCount = 3) {
    const alleles = {};
    for (let i = 1; i <= num; i++) alleles[i] = false;
    // Randomly pick trueCount alleles to set to true
    const keys = Object.keys(alleles);
    for (let i = 0; i < trueCount; i++) {
      let idx;
      do { idx = Math.floor(Math.random() * keys.length); }
      while (alleles[keys[idx]]);
      alleles[keys[idx]] = true;
    }
    return alleles;
  }

  // Generate shrimp dataset
  function generateShrimpDataset() {
    const colorAlleles = ["R", "B", "g"];
    const saturationAlleles = ["l", "D"];
    const shrimpBase = [
    // MALES
    { 
      id: 1, //hidden recessive green
      sex: "male", 
      label: "Shamus", 
      sex_phenotype: "male", 
      sex_genotype: ["X", "Y"], 
      pattern_genotype: ["S", "P"],
      color_genotype: ["R", "g"],
      saturation_genotype: ["D", "D"],
      lethal_alleles: { "1": true, "2": true, "3": true, "4": false, "5": false, "6": false, "7": false, "8": false, "9": false, "10": false }
    },
    { 
      id: 2,
      sex: "male",
      label: "Shane",
      sex_phenotype: "male",
      sex_genotype: ["X", "Y"],
      pattern_genotype: ["S", "S"],
      color_genotype: ["R", "g"],
      saturation_genotype: ["D", "l"]
    },
    { 
      id: 3,
      sex: "male",
      label: "Shilo",
      sex_phenotype: "male",
      sex_genotype: ["X", "Y"],
      pattern_genotype: ["P", "P"],
      color_genotype: ["B", "B"],
      saturation_genotype: ["l", "l"],
      lethal_alleles: { "1": false, "2": false, "3": true, "4": false, "5": true, "6": false, "7": false, "8": true, "9": false, "10": false }
    },
    { 
      id: 4,
      sex: "male",
      label: "Shawn",
      sex_phenotype: "male",
      sex_genotype: ["X", "Y"],
      pattern_genotype: ["S", "P"]
    },
    { 
      id: 5,
      sex: "male",
      label: "Sharky",
      sex_phenotype: "male",
      sex_genotype: ["X", "Y"],
      pattern_genotype: ["S", "S"],
      color_genotype: ["g","g"],
      saturation_genotype: ["l", "l"],
      lethal_alleles: { "1": true, "2": false, "3": true, "4": false, "5": true, "6": false, "7": false, "8": false, "9": false, "10": false }
    },
    { 
      id: 6,
      sex: "male",
      label: "Shelton",
      sex_phenotype: "male",
      sex_genotype: ["X", "Y"],
      pattern_genotype: ["S", "S"],
      color_genotype: ["g","g"],
      saturation_genotype: ["l", "l"],
      lethal_alleles: { "1": false, "2": true, "3": false, "4": true, "5": false, "6": true, "7": false, "8": false, "9": false, "10": false }
    },
    // FEMALES
    { 
      id: 11, //hidden recessive light
      sex: "female", 
      label: "Shira", 
      sex_phenotype: "female", 
      sex_genotype: ["X", "X"], 
      pattern_genotype: ["S", "P"],
      color_genotype: ["R", "B"],
      saturation_genotype: ["D", "l"],
      lethal_alleles: { "0": false, "2": false, "3": false, "4": false, "5": false, "6": false, "7": false, "8": true, "9": true, "10": true }
    },
    { 
      id: 12,
      sex: "female",
      label: "Shandy",
      sex_phenotype: "female",
      sex_genotype: ["X", "X"],
      pattern_genotype: ["P", "P"],
      color_genotype: ["R", "g"],
      saturation_genotype: ["D", "l"],
      lethal_alleles: { "1": false, "2": true, "3": false, "4": true, "5": false, "6": true, "7": false, "8": false, "9": false, "10": false }
    },
    { 
      id: 13, 
      sex: "female", 
      label: "Shayla", 
      sex_phenotype: "female", 
      sex_genotype: ["X", "X"], 
      pattern_genotype: ["P", "S"],
      color_genotype: ["R", "g"],
      saturation_genotype: ["l", "l"],
      lethal_alleles: { "1": true, "2": false, "3": true, "4": false, "5": true, "6": false, "7": false, "8": false, "9": false, "10": false }
    },
    { 
      id: 14, 
      sex: "female", 
      label: "Shelly", 
      sex_phenotype: "female", 
      sex_genotype: ["X", "X"], 
      pattern_genotype: ["S", "P"]
    },
    { 
      id: 15, 
      sex: "female", 
      label: "Sherry", 
      sex_phenotype: "female", 
      sex_genotype: ["X", "X"], 
      pattern_genotype: ["S", "P"]
    },
    { 
      id: 16, 
      sex: "female", 
      label: "Shannon", 
      sex_phenotype: "female", 
      sex_genotype: ["X", "X"],
      pattern_genotype: ["S", "S"],
      color_genotype: ["R", "R"],
      saturation_genotype: ["D", "D"],
      lethal_alleles: { "1": false, "2": false, "3": false, "4": false, "5": true, "6": false, "7": true, "8": true, "9": false, "10": false }
    }
  ];
    return shrimpBase.map(shrimp => {
      const color_genotype = shrimp.color_genotype 
        ? [...shrimp.color_genotype] 
        : [getRandomAllele(colorAlleles), getRandomAllele(colorAlleles)];
      const saturation_genotype = shrimp.saturation_genotype 
        ? [...shrimp.saturation_genotype] 
        : [getRandomAllele(saturationAlleles), getRandomAllele(saturationAlleles)];
      const lethal_alleles = shrimp.lethal_alleles 
        ? { ...shrimp.lethal_alleles } 
        : generateLethalAlleles();
      const pattern_genotype = shrimp.pattern_genotype;
      const sex_genotype = shrimp.sex_genotype;

      // Compute image based on pattern and sex genotype
      const image = getShrimpImage(getPatternPhenotype(pattern_genotype), sex_genotype);

      return {
        ...shrimp,
        color_genotype,
        saturation_genotype,
        pattern_genotype,
        sex_genotype,
        image, // always computed
        color_genotype_named: getNamedGenotype(color_genotype, 'color'),
        saturation_genotype_named: getNamedGenotype(saturation_genotype, 'saturation'),
        pattern_genotype_named: getNamedGenotype(pattern_genotype, 'pattern'),
        type: getPatternPhenotype(pattern_genotype),
        pattern_phenotype: getPatternPhenotype(pattern_genotype),
        color: getColorFromGenotype(color_genotype, saturation_genotype),
        lethal_alleles
      };
    });
  }

  const shrimpDataset = generateShrimpDataset();

  // Track lethal overlay mode
  let showLethalOverlay = false;

  // Helper to generate lethal balloons HTML
function getLethalBalloons(lethal_alleles, isMale = false) {
  if (!lethal_alleles) return '';
  const balloons = [];
  let idx = 0;
  const hueShifts = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360];
  for (let i = 1; i <= 10; i++) {
    if (lethal_alleles[String(i)] === true) {

      let rotation = -25 + (idx * 30);
      if (isMale) {
        rotation = -rotation;
      }
      const hue = hueShifts[(i - 1) % hueShifts.length];
      const scaleX = isMale ? 'scaleX(-1)' : '';
      
      balloons.push(
        `<img src="images/lethalBalloon${i}.png" class="lethal-balloon" style="
          position:absolute;
          top:0; left:0;
          width:90px;
          pointer-events:none;
          transform-origin: 100% 100%;
          transform: rotate(${rotation}deg) translate(8px, 20px) ${scaleX};
          z-index:2;
          filter: hue-rotate(${hue}deg);
        ">`
      );
      idx++;
    }
  }
  return balloons.join('');
}


// Generate lethal balloons for shrivelled eggs (loci: array of numbers)
function getShrivelledEggBalloons(loci, isMale = false) {
  if (!loci || loci.length === 0) return '';
  const balloons = [];
  let idx = 0;
  const hueShifts = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360];
  for (const i of loci) {
    let rotation = (idx * 30);
    if (isMale) rotation = rotation;
    const hue = hueShifts[(i - 1) % hueShifts.length];
    const scaleX = isMale ? 'scaleX(1)' : '';
    balloons.push(
      `<img src="images/lethalBalloon${i}.png" class="lethal-balloon" style="
        position:absolute;
        top:0; left:0;
        width:30px;
        pointer-events:none;
        transform-origin: 100% 100%;
        transform: rotate(${rotation}deg) translate(4px, 10px) ${scaleX};
        z-index:2;
        filter: hue-rotate(${hue}deg);
      ">`
    );
    idx++;
  }
  return balloons.join('');
}


  // Update createBoxContent to include lethal balloons if enabled
  function createBoxContent(sex) {
    // Filter shrimp by sex
    let shrimpList = shrimpDataset.filter(shrimp => shrimp.sex === sex);
    // Alternate between shrimp if less than 5
    if (shrimpList.length < 5 && shrimpList.length > 0) {
      const alternated = [];
      let i = 0;
      while (alternated.length < 5) {
        alternated.push(shrimpList[i % shrimpList.length]);
        i++;
      }
      shrimpList = alternated;
    }
    return shrimpList.map(shrimp => ({
      content: `
        <div class="image-container" style="position:relative;">
          <img src="${shrimp.image}" alt="Shrimp">
          <div class="text-box">${shrimp.label}</div>
          ${showLethalOverlay ? getLethalBalloons(shrimp.lethal_alleles, sex === "male") : ''}
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
    return { next, prev, updateBoxContent, currentBoxContent };
  }

  // DOM elements
  const leftCarousel = $(".left-list");
  const rightCarousel = $(".right-list");
  const eggBatchGrid = document.querySelector('.egg-batch-grid');
  const eggBatchGenotype = document.querySelector('.egg-batch-genotype');
  const eggContainer = document.querySelector('.large-image-container');
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
    // Lethal alleles: for each, 50% from each parent, 10% random true
    const lethal_alleles = {};
    for (let i = 1; i <= 10; i++) {
      const key = String(i);
      // Each parent has a boolean for this allele
      const motherAllele = parent2.lethal_alleles[key];
      const fatherAllele = parent1.lethal_alleles[key];
      // 50% chance to inherit each parent's allele
      let allele1 = Math.random() < 0.5 ? motherAllele : false;
      let allele2 = Math.random() < 0.5 ? fatherAllele : false;
      // 10% chance to randomly set to true
      if (Math.random() < 0.00) allele1 = true;
      if (Math.random() < 0.00) allele2 = true;
      lethal_alleles[key] = [allele1, allele2];
    }
    return {
      pattern_genotype: pick(parent1.pattern_genotype, parent2.pattern_genotype),
      color_genotype: pick(parent1.color_genotype, parent2.color_genotype),
      saturation_genotype: pick(parent1.saturation_genotype, parent2.saturation_genotype),
      sex_genotype: [getRandomAllele(parent1.sex_genotype), getRandomAllele(parent2.sex_genotype)],
      lethal_alleles
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
      const isLethal = isLethalEgg(eggGenotype.lethal_alleles);
      let eggImg = getEggImage(pattern);
      if (isLethal) {
        // Use shrivelled image
        switch (pattern) {
          case "spotted": eggImg = "images/shrivelledSpottedEgg.png"; break;
          case "striped": eggImg = "images/shrivelledStripedEgg.png"; break;
          case "plain":   eggImg = "images/shrivelledPlainEgg.png"; break;
          default:        eggImg = "images/shrivelledPlainEgg.png";
        }
      }
      const eggDiv = document.createElement('div');
      eggDiv.style.display = 'flex';
      eggDiv.style.flexDirection = 'column';
      eggDiv.style.alignItems = 'center';

      // For shrivelled eggs, overlay balloons for lethal loci
      if (isLethal) {
        const lethalLoci = getLethalLoci(eggGenotype.lethal_alleles);
        eggDiv.innerHTML = `
          <div style="position:relative; width:60px; height:60px;">
            <img src="${eggImg}" alt="Egg" style="background:${color};border-radius:10px;width:60px;height:60px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
            ${getShrivelledEggBalloons(lethalLoci, eggGenotype.sex_genotype.includes("Y"))}
          </div>
        `;
      } else {
        eggDiv.innerHTML = `
          <img src="${eggImg}" alt="Egg" style="background:${color};border-radius:10px;width:60px;height:60px;box-shadow:0 1px 4px rgba(0,0,0,0.08); cursor:pointer;">
        `;
      }
      eggDiv.eggGenotype = eggGenotype;
      eggDiv.eggPattern = pattern;
      eggDiv.eggColor = color;
      eggDiv.isLethal = isLethal;

      eggDiv.addEventListener('mouseenter', () => {
        eggBatchGenotype.innerHTML = `
          <div class="info-box" style="display:inline-block;">
            Pattern: <b>${eggGenotype.pattern_genotype.join('/')}</b> &nbsp;
            Color: <b>${eggGenotype.color_genotype.join('/')}</b> &nbsp;
            Saturation: <b>${eggGenotype.saturation_genotype.join('/')}</b> &nbsp;
            Sex: <b>${eggGenotype.sex_genotype.join('/')}</b> &nbsp;
            Lethal: <b>${isLethal ? "Yes" : "No"}</b>
          </div>
          ${isLethal ? '<div style="margin-top:6px;color:#e63946;font-weight:bold;">Lethal genotype</div>' : '<div style="margin-top:6px;color:#06D6A0;font-weight:bold;">Click to hatch shrimp</div>'}
        `;
      });
      eggDiv.addEventListener('mouseleave', () => {
        eggBatchGenotype.innerHTML = '<span style="color:#888;">Hover over an egg to see its genotype</span>';
      });

      // Only allow hatching if not lethal
      if (!isLethal) {
        eggDiv.addEventListener('click', () => {
          const name = prompt("Name your new shrimp:");
          if (!name) return;
          // Add to shrimpDataset
          const newShrimp = {
            id: shrimpDataset.length + 1,
            sex: eggGenotype.sex_genotype.includes("Y") ? "male" : "female",
            label: name,
            image: getShrimpImage(eggDiv.eggPattern, eggGenotype.sex_genotype),
            sex_phenotype: eggGenotype.sex_genotype.includes("Y") ? "male" : "female",
            sex_genotype: eggGenotype.sex_genotype,
            pattern_genotype: eggGenotype.pattern_genotype,
            color_genotype: eggGenotype.color_genotype,
            saturation_genotype: eggGenotype.saturation_genotype,
            color_genotype_named: getNamedGenotype(eggGenotype.color_genotype, 'color'),
            saturation_genotype_named: getNamedGenotype(eggGenotype.saturation_genotype, 'saturation'),
            pattern_genotype_named: getNamedGenotype(eggGenotype.pattern_genotype, 'pattern'),
            type: eggDiv.eggPattern,
            pattern_phenotype: eggDiv.eggPattern,
            color: eggDiv.eggColor,
            lethal_alleles: eggGenotype.lethal_alleles // <-- add this line
          };
          shrimpDataset.push(newShrimp);
          alert(`Shrimp "${name}" has hatched and was added to the database!`);
          // Add to carousel immediately
          const boxContent = {
            content: `
              <div class="image-container">
                <img src="${newShrimp.image}" alt="Shrimp">
                <div class="text-box">${newShrimp.label}</div>
              </div>
            `,
            backgroundColor: newShrimp.color
          };
          if (newShrimp.sex === "male") {
            // Rebuild left carousel content with alternation
            const newContent = createBoxContent("male");
            leftBoxContent.length = 0;
            leftBoxContent.push(...newContent);
            leftCarouselObj.currentBoxContent.length = 0;
            leftCarouselObj.currentBoxContent.push(...newContent);
            leftCarouselObj.updateBoxContent();
          } else {
            // Rebuild right carousel content with alternation
            const newContent = createBoxContent("female");
            rightBoxContent.length = 0;
            rightBoxContent.push(...newContent);
            rightCarouselObj.currentBoxContent.length = 0;
            rightCarouselObj.currentBoxContent.push(...newContent);
            rightCarouselObj.updateBoxContent();
          }
          // Update the shrimp grids after hatching a new shrimp
          renderShrimpGrids();
        });
      }

      eggBatchGrid.appendChild(eggDiv);
    }
  }

  // Helper to get shrimp image based on pattern and sex genotype
  function getShrimpImage(pattern, sexGenotype) {
    const isMale = sexGenotype.includes("Y");
    switch (pattern) {
      case "spotted": return isMale ? imagePaths.spottedMale : imagePaths.spottedFemale;
      case "striped": return isMale ? imagePaths.stripedMale : imagePaths.stripedFemale;
      case "plain":   return isMale ? imagePaths.plainMale : imagePaths.plainFemale;
      default:        return isMale ? imagePaths.plainMale : imagePaths.plainFemale;
    }
  }

  // Initial egg display
  //updateEgg();
  updateEggBatchGrid();


  // Event listeners
  document.querySelectorAll('.list').forEach(list => {
    list.addEventListener('pointerdown', () => {
      setPresetButtonsEnabled(true, null); // Enable all preset buttons
      clearPresetInfoBox();                // Hide preset info text
    });
  });

  if (bigBatchBtn) {
    bigBatchBtn.addEventListener('click', () => {
      updateEggBatchGrid();
    });
  }

  function renderShrimpGrids() {
    const leftGrid = document.querySelector('.shrimp-grid-left');
    const rightGrid = document.querySelector('.shrimp-grid-right');
    // Male shrimp
    leftGrid.innerHTML = shrimpDataset
      .filter(s => s.sex === "male")
      .map(s => `
        <div style="background:${s.color}; border-radius:8px; padding:2px; display:flex; flex-direction:column; align-items:center;">
          <div style="background:${s.color}; border-radius:6px; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
            <img src="${s.image}" alt="${s.label}" style="width:38px; height:38px; border-radius:5px; background:transparent;">
          </div>
          <div class="shrimp-grid-label">${s.label}</div>
        </div>
      `).join('');
    // Female shrimp
    rightGrid.innerHTML = shrimpDataset
      .filter(s => s.sex === "female")
      .map(s => `
        <div style="background:${s.color}; border-radius:8px; padding:2px; display:flex; flex-direction:column; align-items:center;">
          <div style="background:${s.color}; border-radius:6px; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
            <img src="${s.image}" alt="${s.label}" style="width:38px; height:38px; border-radius:5px; background:transparent;">
          </div>
          <div class="shrimp-grid-label">${s.label}</div>
        </div>
      `).join('');
  }

  renderShrimpGrids();

  // Preset info text for each button
  const presetInfoTexts = {
    "preset-1-btn": "Despite having a green allele, none of Shamus's offspring will be green, because all the offspring with a green allele will also have a RED or a BLUE allele, which are dominant over green.<br><br>If two alleles have the same dominance, this is 'co-dominance'. In the case of BLUE and RED, they're both expressed equally, and so the phenotype is brown.",

    "preset-2-btn": "With these shrimp, the previously hidden green alleles and previously hidden light alleles have a chance to be expressed in the offspring",

    "preset-3-btn": "This simulation is only looking at lethal genes, because it's very easy to see the effects.<br><br>In reality, the consequences of inbreeding come mainly from the accumulation of many bad recessive alleles, but not always as drastic as lethal genes.<br><br>Inbreeding depression leads to reduced fitness, fertility, and survival rates in populations.",

    "preset-4-btn": "While lethal genes show up all the time, they rarely persist in a population for long.<br><br>So for them to be expressed, the population size must be very small.",

    "preset-5-btn": "No matter how inbred, it only takes a single generation to reverse everything and suppress all lethal genes.<br><br>On a population level, this means you can restore a population's health by introducing even just a little bit of genetic diversity.",
  };

  // Add event listeners to preset buttons to update the info box
  Object.keys(presetInfoTexts).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const infoBox = document.getElementById('preset-info-box');
        if (infoBox) {
          infoBox.innerHTML = presetInfoTexts[btnId]; // Use innerHTML for <br>
        }
      });
    }
  });

  // Helper to spin carousel to a shrimp with a given label
function spinCarouselToLabel(carouselObj, boxContent, label, onDone) {
  if (carouselObj.spinning) return;
  carouselObj.spinning = true;

  const ACT_IDX = 2;
  const boxes = carouselObj.currentBoxContent;
  const targetIdx = boxes.findIndex(c => c.content.includes(`>${label}<`));
  if (targetIdx === -1) {
    carouselObj.spinning = false;
    if (onDone) onDone();
    return;
  }

  const total = boxes.length;
  let spins = (targetIdx - ACT_IDX + total) % total;

  function spinStep() {
    if (spins > 0) {
      carouselObj.next();
      spins--;
      setTimeout(spinStep, 200);
    } else {
      carouselObj.spinning = false;
      if (onDone) onDone();
    }
  }
  spinStep();
}





  function isLethalEgg(lethal_alleles) {
    // If any allele is true for both chromosomes (i.e., true twice), it's lethal
    // Here, since we only have one set per egg, we just check if any value is true
    for (let i = 1; i <= 10; i++) {
      const key = String(i);
      if (lethal_alleles[key][0] && lethal_alleles[key][1]) return true;
    }
    return false;
  }

  // Add event listener for lethal overlay button
  const showLethalBtn = document.getElementById('show-lethal-btn');
  if (showLethalBtn) {
    showLethalBtn.addEventListener('click', () => {
      showLethalOverlay = !showLethalOverlay;
      showLethalBtn.textContent = showLethalOverlay ? "Show Recessive Lethal Alleles" : "Show Recessive Lethal Alleles";

      // Helper to preserve carousel position
      function preserveCarouselPosition(carouselObj, boxContent, sex) {
        // Get the current order of labels in the carousel
        const currentLabels = carouselObj.currentBoxContent.map(
          c => {
            // Extract label from the HTML content
            const match = c.content.match(/<div class="text-box">([^<]+)<\/div>/);
            return match ? match[1] : null;
          }
        );

        // Rebuild content with new overlay state
        const newContent = createBoxContent(sex);

        // Build new array in the same order as currentLabels
        const rotated = currentLabels.map(label =>
          newContent.find(c => c.content.includes(`>${label}<`))
          // fallback: if not found, just use the first
          || newContent[0]
        );

        // Update boxContent and carouselObj.currentBoxContent in place
        boxContent.length = 0;
        boxContent.push(...rotated);
        carouselObj.currentBoxContent.length = 0;
        carouselObj.currentBoxContent.push(...rotated);
        carouselObj.updateBoxContent();
      }

      preserveCarouselPosition(leftCarouselObj, leftBoxContent, "male");
      preserveCarouselPosition(rightCarouselObj, rightBoxContent, "female");
    });
  }

  // Returns an array of loci (as numbers) where both alleles are lethal (true)
  function getLethalLoci(lethal_alleles) {
    const loci = [];
    for (let i = 1; i <= 10; i++) {
      const key = String(i);
      if (lethal_alleles[key] && lethal_alleles[key][0] && lethal_alleles[key][1]) {
        loci.push(i);
      }
    }
    return loci;
  }

  // Overlay logic for preset cover
  const presetCoverOverlay = document.getElementById('preset-cover-overlay');
  const presetCoverImg = document.getElementById('preset-cover-img');
  if (presetCoverOverlay) {
    presetCoverOverlay.addEventListener('click', () => {
      presetCoverOverlay.style.display = 'none';
      // Show the egg matrix/grid again when cover is dismissed
      showEggBatchGrid(true);
    });
  }

  function showPresetCover(num) {
    if (presetCoverOverlay && presetCoverImg) {
      presetCoverImg.src = `images/preset_${num}_cover.png`;
      presetCoverOverlay.style.display = 'flex';
      // Hide the egg matrix/grid when cover is shown
      showEggBatchGrid(false);
    }
  }
const preset1Btn = document.getElementById('preset-1-btn');
if (preset1Btn) {
  preset1Btn.addEventListener('click', () => {
    setPresetButtonsEnabled(false);
    showPresetCover(1);
    let spinsLeft = 2;
    function done() {
      spinsLeft--;
      if (spinsLeft === 0) setPresetButtonsEnabled(true, 1);
    }
    spinCarouselToLabel(leftCarouselObj, leftBoxContent, "Shelton", done);
    spinCarouselToLabel(rightCarouselObj, rightBoxContent, "Shannon", done);
  });
}

const preset2Btn = document.getElementById('preset-2-btn');
if (preset2Btn) {
  preset2Btn.addEventListener('click', () => {
    setPresetButtonsEnabled(false);
    showPresetCover(2);
    let spinsLeft = 2;
    function done() {
      spinsLeft--;
      if (spinsLeft === 0) setPresetButtonsEnabled(true, 2);
    }
    spinCarouselToLabel(leftCarouselObj, leftBoxContent, "Shamus", done);
    spinCarouselToLabel(rightCarouselObj, rightBoxContent, "Shira", done);
  });
}

const preset3Btn = document.getElementById('preset-3-btn');
if (preset3Btn) {
  preset3Btn.addEventListener('click', () => {
    setPresetButtonsEnabled(false);
    showPresetCover(3);
    let spinsLeft = 2;
    function done() {
      spinsLeft--;
      if (spinsLeft === 0) setPresetButtonsEnabled(true, 3);
    }
    spinCarouselToLabel(leftCarouselObj, leftBoxContent, "Shawn", done);
    spinCarouselToLabel(rightCarouselObj, rightBoxContent, "Shira", done);
  });
}

const preset4Btn = document.getElementById('preset-4-btn');
if (preset4Btn) {
  preset4Btn.addEventListener('click', () => {
    setPresetButtonsEnabled(false);
    showPresetCover(4);
    let spinsLeft = 2;
    function done() {
      spinsLeft--;
      if (spinsLeft === 0) setPresetButtonsEnabled(true, 4);
    }
    spinCarouselToLabel(leftCarouselObj, leftBoxContent, "Shawn", done);
    spinCarouselToLabel(rightCarouselObj, rightBoxContent, "Shandy", done);
  });
}

const preset5Btn = document.getElementById('preset-5-btn');
if (preset5Btn) {
  preset5Btn.addEventListener('click', () => {
    setPresetButtonsEnabled(false);
    showPresetCover(5);
    let spinsLeft = 2;
    function done() {
      spinsLeft--;
      if (spinsLeft === 0) setPresetButtonsEnabled(true, 5);
    }
    spinCarouselToLabel(leftCarouselObj, leftBoxContent, "Sharky", done);
    spinCarouselToLabel(rightCarouselObj, rightBoxContent, "Shandy", done);
  });
}

  function setPresetButtonsEnabled(enabled, activeIndex = null) {
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById(`preset-${i}-btn`);
      if (btn) {
        if (activeIndex === i) {
          btn.disabled = true;
          btn.style.opacity = "0.5";
          btn.style.pointerEvents = "none";
          btn.style.filter = "grayscale(1)";
        } else {
          btn.disabled = !enabled;
          btn.style.opacity = enabled ? "1" : "0.5";
          btn.style.pointerEvents = enabled ? "auto" : "none";
          btn.style.filter = enabled ? "" : "grayscale(1)";
        }
      }
    }
  }

  // Helper to clear the preset info box
  function clearPresetInfoBox() {
    const infoBox = document.getElementById('preset-info-box');
    if (infoBox) {
      infoBox.innerHTML = ""; // or infoBox.style.display = "none";
    }
  }

  // Listen for carousel movement to re-enable all preset buttons and hide info
  document.querySelectorAll('.list').forEach(list => {
    list.addEventListener('pointerdown', () => {
      setPresetButtonsEnabled(true, null); // Enable all preset buttons
      clearPresetInfoBox();                // Hide preset info text
    });
  });
});