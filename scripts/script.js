// Mobile navigation and safe scroll behavior.
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

const setMenuState = (isOpen) => {
    if (!hamburger || !navMenu) return;
    hamburger.classList.toggle("active", isOpen);
    navMenu.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
};

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        setMenuState(!navMenu.classList.contains("active"));
    });

    hamburger.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setMenuState(!navMenu.classList.contains("active"));
        }
    });

    document.querySelectorAll(".nav-menu a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });
}

// Smooth scroll for same-page anchors, including links written as page.html#id.
document.querySelectorAll("a[href*='#']").forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        const url = new URL(href, window.location.href);
        const samePage = url.pathname === window.location.pathname;
        if (!samePage || !url.hash) return;

        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (target) {
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            history.pushState(null, "", url.hash);
        }
    });
});

// Premium reveal animation, added only when JavaScript is available.
const revealTargets = document.querySelectorAll(
    ".section-title, .perfil-texto, .card, .formacion-item, .reconocimientos-list, .blog-intro, .blog-card, .blog-note"
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealTargets.length) {
    revealTargets.forEach((element) => {
        if (!element.closest("#inicio")) {
            element.classList.add("premium-reveal");
        }
    });

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -70px 0px" }
        );

        document.querySelectorAll(".premium-reveal").forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        document.querySelectorAll(".premium-reveal").forEach((element) => {
            element.classList.add("is-visible");
        });
    }
}
