const IMAGES = {
  benjamin: "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_benjamin_zeledon.jpg",
  benjaminAlt: "https://commons.wikimedia.org/wiki/Special:FilePath/Benjamin_celedon.jpg",
  banderaNicaragua: "https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Nicaragua.svg",
  coyotepe: "https://commons.wikimedia.org/wiki/Special:FilePath/Coyotepe-fortress.jpg",
  coyotepeAlt: "https://commons.wikimedia.org/wiki/Special:FilePath/Coyotepe.JPG",
  sandino: "https://commons.wikimedia.org/wiki/Special:FilePath/Augusto_C%C3%A9sar_Sandino_cph.3b19320.jpg",
  sandinoAlt: "https://commons.wikimedia.org/wiki/Special:FilePath/Sandino.jpg",
  catarinaMapa: "https://commons.wikimedia.org/wiki/Special:FilePath/Masaya_Department_with_Catarina_highlighted.svg",
  fondoHistorico: "https://commons.wikimedia.org/wiki/Special:FilePath/Coyotepe-fortress.jpg"
};

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.getElementById("primaryMenu");
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const backTop = document.getElementById("backTop");

const preloadImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(url);
  image.onerror = reject;
  image.src = url;
});

const getImageUrl = async (key, fallbackKey) => {
  const primary = IMAGES[key];
  const fallback = IMAGES[fallbackKey];

  if (primary) {
    try {
      return await preloadImage(primary);
    } catch (error) {
      // Continue to the fallback below.
    }
  }

  if (fallback) {
    try {
      return await preloadImage(fallback);
    } catch (error) {
      return "";
    }
  }

  return "";
};

const hydrateImages = () => {
  document.querySelectorAll("img[data-image-key]").forEach(async (img) => {
    const key = img.dataset.imageKey;
    const fallbackKey = img.dataset.fallbackKey;
    const url = await getImageUrl(key, fallbackKey);

    if (url) {
      img.src = url;
      img.loading = img.closest(".hero") ? "eager" : "lazy";
      img.decoding = "async";
    } else {
      img.classList.add("is-missing");
      img.closest(".portrait-frame, .brand-mark, .footer")?.classList.add("image-error");
    }
  });

  document.querySelectorAll(".image-bg[data-image-key]").forEach(async (element) => {
    const key = element.dataset.imageKey;
    const fallbackKey = element.dataset.fallbackKey;
    const url = await getImageUrl(key, fallbackKey);

    if (url) {
      element.style.setProperty("--image-url", `url("${url}")`);
      element.classList.remove("image-error");
    } else {
      element.classList.add("image-error");
      element.style.setProperty("--image-url", "linear-gradient(135deg, #071a31, #020814)");
    }
  });
};

hydrateImages();

const setMenuState = (isOpen) => {
  if (!menuToggle || !navMenu) return;
  menuToggle.classList.toggle("is-open", isOpen);
  navMenu.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
};

menuToggle?.addEventListener("click", () => {
  setMenuState(!navMenu.classList.contains("is-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -70px 0px" });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const active = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
    if (active) {
      navLinks.forEach((link) => link.classList.remove("is-active"));
      active.classList.add("is-active");
    }
  });
}, { threshold: 0.32, rootMargin: "-18% 0px -58% 0px" });

document.querySelectorAll(".section-anchor[id]").forEach((section) => {
  sectionObserver.observe(section);
});

window.addEventListener("scroll", () => {
  backTop?.classList.toggle("is-visible", window.scrollY > 700);
});

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const quizAnswers = {
  q1: "a",
  q2: "b",
  q3: "a",
  q4: "b",
  q5: "a"
};

const quizForm = document.getElementById("quizForm");
const quizResult = document.getElementById("quizResult");
const resetQuiz = document.getElementById("resetQuiz");

quizForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  let score = 0;
  const total = Object.keys(quizAnswers).length;

  Object.entries(quizAnswers).forEach(([name, answer]) => {
    const selected = quizForm.querySelector(`input[name="${name}"]:checked`);
    if (selected?.value === answer) {
      score += 1;
    }
  });

  const message = score === total
    ? "Excelente: dominas la lección histórica."
    : score >= 3
      ? "Buen trabajo: repasa la línea de tiempo para reforzar."
      : "Sigue intentando: revisa las tarjetas y vuelve a responder.";

  quizResult.textContent = `Puntuación final: ${score} de ${total}. ${message}`;
});

resetQuiz?.addEventListener("click", () => {
  quizForm.reset();
  quizResult.textContent = "Completa el quiz para ver tu resultado.";
});

const truthList = document.getElementById("truthList");
const truthResult = document.getElementById("truthResult");
const checkTruth = document.getElementById("checkTruth");

truthList?.querySelectorAll("button[data-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".truth-item");
    item.querySelectorAll("button").forEach((option) => option.classList.remove("is-selected"));
    button.classList.add("is-selected");
    item.dataset.choice = button.dataset.choice;
  });
});

checkTruth?.addEventListener("click", () => {
  const items = [...truthList.querySelectorAll(".truth-item")];
  let score = 0;
  let answered = 0;

  items.forEach((item) => {
    if (item.dataset.choice) {
      answered += 1;
      if (item.dataset.choice === item.dataset.answer) {
        score += 1;
      }
    }
  });

  truthResult.textContent = answered < items.length
    ? "Responde todas las afirmaciones antes de revisar."
    : `Resultado: ${score} de ${items.length} respuestas correctas.`;
});

const memoryPairs = [
  { pair: "birth", text: "La Concordia" },
  { pair: "birth", text: "Lugar de nacimiento" },
  { pair: "battle", text: "El Coyotepe" },
  { pair: "battle", text: "Lugar estratégico de resistencia" },
  { pair: "legacy", text: "Augusto C. Sandino" },
  { pair: "legacy", text: "Inspirado por su ejemplo" }
];

const memoryGrid = document.getElementById("memoryGrid");
const memoryResult = document.getElementById("memoryResult");
const resetMemory = document.getElementById("resetMemory");
let flippedCards = [];
let matchedPairs = 0;

const shuffle = (items) => items
  .map((item) => ({ item, order: Math.random() }))
  .sort((a, b) => a.order - b.order)
  .map(({ item }) => item);

const updateMemoryResult = () => {
  memoryResult.textContent = matchedPairs === 3
    ? "Completaste la memoria histórica."
    : `Parejas encontradas: ${matchedPairs} de 3.`;
};

const handleMemoryClick = (card) => {
  if (
    card.classList.contains("is-flipped") ||
    card.classList.contains("is-matched") ||
    flippedCards.length === 2
  ) {
    return;
  }

  card.classList.add("is-flipped");
  flippedCards.push(card);

  if (flippedCards.length !== 2) return;

  const [first, second] = flippedCards;
  if (first.dataset.pair === second.dataset.pair) {
    first.classList.add("is-matched");
    second.classList.add("is-matched");
    matchedPairs += 1;
    flippedCards = [];
    updateMemoryResult();
    return;
  }

  window.setTimeout(() => {
    first.classList.remove("is-flipped");
    second.classList.remove("is-flipped");
    flippedCards = [];
  }, 760);
};

const buildMemory = () => {
  if (!memoryGrid) return;

  memoryGrid.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;
  updateMemoryResult();

  shuffle(memoryPairs).forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.pair = item.pair;
    button.setAttribute("aria-label", `Tarjeta de memoria ${index + 1}`);
    button.innerHTML = `
      <span class="memory-inner">
        <span class="memory-face memory-front">?</span>
        <span class="memory-face memory-back">${item.text}</span>
      </span>
    `;
    button.addEventListener("click", () => handleMemoryClick(button));
    memoryGrid.appendChild(button);
  });
};

resetMemory?.addEventListener("click", buildMemory);
buildMemory();

const toggleAnswers = document.getElementById("toggleAnswers");
const answerPanel = document.getElementById("answerPanel");

toggleAnswers?.addEventListener("click", () => {
  const isOpen = answerPanel.classList.toggle("is-open");
  toggleAnswers.setAttribute("aria-expanded", String(isOpen));
});
