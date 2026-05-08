(() => {
  const doc = document.documentElement;
  const body = document.body;
  const progress = document.querySelector(".scroll-progress span");
  const particleField = document.getElementById("particle-field");
  const scrollTargets = Array.from(document.querySelectorAll(".scroll-target"));
  const timelineDots = Array.from(document.querySelectorAll(".timeline-dot"));
  const currentLabel = document.getElementById("scene-current");
  const totalLabel = document.getElementById("scene-total");
  const nextButton = document.getElementById("next-scene");
  const prevButton = document.getElementById("prev-scene");
  const modal = document.getElementById("mural-modal");
  const modalPanel = modal?.querySelector(".modal-panel");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalCaption = document.getElementById("modal-caption");
  const modalBody = document.getElementById("modal-body");
  const modalExplore = document.getElementById("modal-explore");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const assetBase = body.dataset.assetBase || "assets/img/";

  let activeIndex = 0;
  let modalNextTarget = "#escena-02";
  let lastFocus = null;

  const pad = (number) => String(number).padStart(2, "0");

  const setProgress = () => {
    if (!progress) return;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  };

  const scrollToTarget = (target) => {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;
    element.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  };

  const setActiveScene = (id) => {
    const index = scrollTargets.findIndex((target) => target.id === id);
    if (index >= 0) activeIndex = index;

    const currentTarget = scrollTargets[activeIndex];
    const currentNumber = pad(activeIndex + 1);

    if (currentLabel) currentLabel.textContent = currentNumber;
    timelineDots.forEach((dot) => {
      dot.classList.toggle("is-active", dot.dataset.target === currentTarget?.id);
    });
  };

  const buildParticles = () => {
    if (!particleField) return;
    const count = window.innerWidth < 640 ? 32 : 76;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";
      particle.style.setProperty("--size", `${Math.random() * 2.6 + 1}px`);
      particle.style.setProperty("--left", `${Math.random() * 100}%`);
      particle.style.setProperty("--top", `${Math.random() * 100 + 20}%`);
      particle.style.setProperty("--opacity", `${Math.random() * 0.42 + 0.18}`);
      particle.style.setProperty("--duration", `${Math.random() * 16 + 14}s`);
      particle.style.setProperty("--delay", `${Math.random() * -24}s`);
      particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
      fragment.appendChild(particle);
    }

    particleField.appendChild(fragment);
  };

  const sceneDataFrom = (trigger) => {
    const image = trigger.dataset.image || trigger.querySelector("img")?.getAttribute("src") || "";
    return {
      title: trigger.dataset.title || "Detalle historico",
      caption: trigger.dataset.caption || "Pieza del mural interactivo.",
      body: trigger.dataset.body || "Esta imagen forma parte del recorrido educativo sobre Sandino.",
      image,
      next: trigger.dataset.next || nextTargetForActive()
    };
  };

  const manifestoData = () => ({
    title: "Manifiesto de San Albino",
    caption: "Documento vivo de dignidad nacional",
    body: "Desde San Albino, la palabra escrita se convierte en accion historica: defensa de la independencia, rechazo a la rendicion y compromiso con la soberania de Nicaragua. Esta seccion propone leer el manifiesto como fuente historica y como llamada a la responsabilidad ciudadana.",
    image: `${assetBase}file_00000000d6e871f895cbcca43b134193.png`,
    next: "#escena-06"
  });

  const nextTargetForActive = () => {
    const next = scrollTargets[Math.min(activeIndex + 1, scrollTargets.length - 1)];
    return next ? `#${next.id}` : "#inicio";
  };

  const openModal = (data, sourceElement) => {
    if (!modal) return;
    lastFocus = sourceElement || document.activeElement;
    modalNextTarget = data.next || nextTargetForActive();

    modalTitle.textContent = data.title;
    modalCaption.textContent = data.caption;
    modalBody.textContent = data.body;
    modalImage.src = data.image;
    modalImage.alt = data.title;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    requestAnimationFrame(() => {
      modalPanel?.focus();
    });
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    modalImage.removeAttribute("src");

    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus({ preventScroll: true });
    }
  };

  const setupModal = () => {
    document.querySelectorAll(".scene-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openModal(sceneDataFrom(trigger), trigger);
      });
    });

    document.querySelectorAll("[data-manifest-open]").forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.stopPropagation();
        openModal(manifestoData(), trigger);
      });

      trigger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(manifestoData(), trigger);
        }
      });
    });

    document.querySelectorAll("[data-modal-close]").forEach((trigger) => {
      trigger.addEventListener("click", closeModal);
    });

    modalExplore?.addEventListener("click", () => {
      const target = modalNextTarget;
      closeModal();
      window.setTimeout(() => scrollToTarget(target), 140);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal?.classList.contains("is-open")) {
        closeModal();
      }
    });
  };

  const setupNavigation = () => {
    if (totalLabel) totalLabel.textContent = pad(scrollTargets.length);
    if (currentLabel) currentLabel.textContent = pad(activeIndex + 1);

    nextButton?.addEventListener("click", () => {
      activeIndex = Math.min(activeIndex + 1, scrollTargets.length - 1);
      scrollToTarget(scrollTargets[activeIndex]);
    });

    prevButton?.addEventListener("click", () => {
      activeIndex = Math.max(activeIndex - 1, 0);
      scrollToTarget(scrollTargets[activeIndex]);
    });

    timelineDots.forEach((dot) => {
      dot.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.getElementById(dot.dataset.target);
        if (target) scrollToTarget(target);
      });
    });
  };

  const setupObserver = () => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          setActiveScene(entry.target.id);
        });
      },
      {
        root: null,
        threshold: 0.38,
        rootMargin: "-18% 0px -42% 0px"
      }
    );

    scrollTargets.forEach((target) => observer.observe(target));
  };

  const setupImagePreload = () => {
    const priorityImages = [
      `${assetBase}file_00000000f3e871fdb42c41a5eed35c4b.png`,
      `${assetBase}file_00000000f2c071f88a00413f01d02394.png`,
      `${assetBase}file_00000000d6e871f895cbcca43b134193.png`
    ];

    priorityImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  };

  window.addEventListener("scroll", setProgress, { passive: true });
  window.addEventListener("resize", setProgress);

  buildParticles();
  setupImagePreload();
  setupModal();
  setupNavigation();
  setupObserver();
  setProgress();
  setActiveScene(scrollTargets[0]?.id || "inicio");
})();
