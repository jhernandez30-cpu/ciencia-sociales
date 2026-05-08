(() => {
  const boot = () => {
    const gsapReady = window.gsap && window.ScrollTrigger;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;

    if (!gsapReady || reduceMotion) {
      document.documentElement.classList.add(gsapReady ? "motion-reduced" : "no-gsap");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.9 });

    const splitLetters = (element) => {
      const text = element.textContent.trim();
      if (!text) return [];
      element.setAttribute("aria-label", text);
      element.textContent = "";

      return Array.from(text).map((char) => {
        const span = document.createElement("span");
        span.setAttribute("aria-hidden", "true");
        span.textContent = char === " " ? "\u00A0" : char;
        element.appendChild(span);
        return span;
      });
    };

    const splitWords = (element) => {
      const text = element.textContent.trim();
      if (!text) return [];
      element.setAttribute("aria-label", text);
      element.textContent = "";

      return text.split(/\s+/).map((word, index, words) => {
        const wrapper = document.createElement("span");
        wrapper.className = "word-mask";
        wrapper.setAttribute("aria-hidden", "true");

        const inner = document.createElement("span");
        inner.className = "word-inner";
        inner.textContent = word;

        wrapper.appendChild(inner);
        element.appendChild(wrapper);

        if (index < words.length - 1) {
          element.appendChild(document.createTextNode(" "));
        }

        return inner;
      });
    };

    document.querySelectorAll(".typewriter").forEach((element) => {
      const letters = splitLetters(element);
      gsap.fromTo(
        letters,
        { autoAlpha: 0, y: 9, filter: "blur(4px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: isMobile ? 0.008 : 0.018,
          duration: 0.38,
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            once: true
          }
        }
      );
    });

    document.querySelectorAll(".reveal-text").forEach((element) => {
      const words = splitWords(element);
      gsap.fromTo(
        words,
        { yPercent: 105, autoAlpha: 0, filter: "blur(8px)" },
        {
          yPercent: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          stagger: isMobile ? 0.035 : 0.055,
          duration: isMobile ? 0.58 : 0.82,
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true
          }
        }
      );
    });

    gsap.set(".word-mask", {
      display: "inline-block",
      overflow: "hidden",
      verticalAlign: "bottom"
    });

    gsap.set(".word-inner", {
      display: "inline-block"
    });

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".museum-header", { autoAlpha: 0, y: -24, duration: 0.7 })
      .from(".hero .eyebrow", { autoAlpha: 0, y: 18, duration: 0.65 }, "-=0.35")
      .from(".hero-actions", { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.2")
      .from(".hero-frame", {
        autoAlpha: 0,
        scale: 0.9,
        rotateY: isMobile ? 0 : -8,
        rotateX: isMobile ? 0 : 3,
        transformOrigin: "center center",
        duration: 1.15
      }, "-=0.75")
      .to(".hero-frame img", {
        scale: isMobile ? 1.01 : 1.055,
        duration: 5.2,
        ease: "sine.inOut"
      }, "-=0.85");

    gsap.to(".warm-light-a", {
      xPercent: 18,
      yPercent: 8,
      rotation: -10,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".warm-light-b", {
      xPercent: -12,
      yPercent: -8,
      rotation: 10,
      duration: 11,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".hero-frame img", {
      yPercent: isMobile ? 0 : -5,
      scale: isMobile ? 1.02 : 1.09,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.utils.toArray(".museum-scene").forEach((scene, index) => {
      const media = scene.querySelector(".scene-media");
      const image = scene.querySelector(".scene-image");
      const copy = scene.querySelector(".scene-copy");
      const cards = scene.querySelectorAll(".edu-card");
      const fromSide = scene.classList.contains("scene-reverse") ? 38 : -38;

      gsap.fromTo(
        media,
        {
          autoAlpha: 0,
          x: isMobile ? 0 : fromSide,
          y: isMobile ? 34 : 0,
          scale: 0.92,
          rotateY: isMobile ? 0 : -fromSide * 0.15,
          filter: "brightness(0.74) saturate(0.92)"
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateY: 0,
          filter: "brightness(1) saturate(1)",
          duration: 0.95,
          scrollTrigger: {
            trigger: scene,
            start: "top 74%",
            end: "center center",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(
        copy,
        { autoAlpha: 0, y: 46 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          delay: 0.08,
          scrollTrigger: {
            trigger: scene,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(
        cards,
        { autoAlpha: 0, x: isMobile ? 0 : fromSide * 0.5, y: isMobile ? 18 : 0 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          stagger: 0.12,
          duration: 0.58,
          scrollTrigger: {
            trigger: copy,
            start: "top 70%",
            once: true
          }
        }
      );

      gsap.to(image, {
        yPercent: isMobile ? 0 : index % 2 === 0 ? -5 : 5,
        scale: isMobile ? 1.035 : 1.15,
        filter: scene.classList.contains("sober-scene")
          ? "saturate(0.8) brightness(0.88) contrast(1.08)"
          : "brightness(1.08) saturate(1.08)",
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(media, {
        boxShadow: index % 2
          ? "0 30px 88px rgba(15, 99, 182, 0.22), 0 28px 70px rgba(0, 0, 0, 0.54)"
          : "0 30px 88px rgba(214, 165, 66, 0.22), 0 28px 70px rgba(0, 0, 0, 0.54)",
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.12
      });
    });

    gsap.fromTo(
      ".manifesto-art",
      { autoAlpha: 0, x: isMobile ? 0 : -44, y: isMobile ? 36 : 0, scale: 0.94 },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        scrollTrigger: {
          trigger: ".manifesto-section",
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(
      ".manifesto-document",
      { autoAlpha: 0, x: isMobile ? 0 : 44, y: isMobile ? 36 : 0, scale: 0.94 },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        scrollTrigger: {
          trigger: ".manifesto-section",
          start: "top 68%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(
      ".parchment",
      { rotateX: 18, transformOrigin: "center top", filter: "brightness(0.92)" },
      {
        rotateX: 0,
        filter: "brightness(1.04)",
        duration: 1.2,
        scrollTrigger: {
          trigger: ".parchment",
          start: "top 78%",
          once: true
        }
      }
    );

    gsap.to(".manifesto-document", {
      boxShadow: "0 0 44px rgba(245, 211, 132, 0.2), 0 26px 70px rgba(0, 0, 0, 0.46)",
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    const gallery = document.querySelector(".gallery-band");
    const track = document.querySelector(".gallery-track");

    if (gallery && track && !isMobile) {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.14);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: gallery,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    }

    gsap.fromTo(
      ".gallery-card",
      { autoAlpha: 0, y: 52, scale: 0.94 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ".gallery-band",
          start: "top 70%",
          once: true
        }
      }
    );

    gsap.fromTo(
      ".mural-controls",
      { autoAlpha: 0, y: 24, xPercent: -50 },
      {
        autoAlpha: 1,
        y: 0,
        xPercent: -50,
        duration: 0.75,
        delay: 0.8
      }
    );

    window.addEventListener("load", () => ScrollTrigger.refresh());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
