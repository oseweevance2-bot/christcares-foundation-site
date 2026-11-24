const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const hero = document.querySelector(".hero");
const slides = Array.from(document.querySelectorAll(".hero-slide"));
const slideDots = Array.from(document.querySelectorAll(".slide-dot"));
const slideToggle = document.querySelector(".slide-toggle");
const slideNumber = document.querySelector(".hero-caption span:first-child");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let slideshowPaused = reducedMotion.matches;
let slideshowTimer;

function setupScrollReveals() {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const revealTargets = Array.from(document.querySelectorAll(
    "main section:not(.hero) .eyebrow, main section:not(.hero) h2, main section:not(.hero) h3, " +
    "main section:not(.hero) p, main section:not(.hero) li, main section:not(.hero) blockquote, " +
    "main section:not(.hero) .commitment-list span, main section:not(.hero) .text-link, " +
    ".values-grid strong"
  ));

  if (!revealTargets.length) return;

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.documentElement.classList.add("scroll-reveal-ready");
  revealTargets.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${(index % 5) * 70}ms`);
    observer.observe(element);
  });
}

function showSlide(index) {
  slides[activeSlide].classList.remove("is-active");
  slideDots[activeSlide].classList.remove("is-active");
  activeSlide = index;
  slides[activeSlide].classList.add("is-active");
  slideDots[activeSlide].classList.add("is-active");
  slideDots.forEach((dot, dotIndex) => {
    dot.setAttribute("aria-pressed", String(dotIndex === activeSlide));
  });
  slideNumber.textContent = String(activeSlide + 1).padStart(2, "0");
}

function startSlideshow() {
  window.clearInterval(slideshowTimer);
  if (!slideshowPaused && !document.hidden) {
    slideshowTimer = window.setInterval(() => {
      showSlide((activeSlide + 1) % slides.length);
    }, 8000);
  }
}

function updateSlideshowControl() {
  hero.classList.toggle("is-paused", slideshowPaused);
  slideToggle.setAttribute("aria-label", slideshowPaused ? "Play slideshow" : "Pause slideshow");
  startSlideshow();
}

slideDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    startSlideshow();
  });
});

slideToggle.addEventListener("click", () => {
  slideshowPaused = !slideshowPaused;
  updateSlideshowControl();
  setupScrollReveals();
});

document.addEventListener("visibilitychange", startSlideshow);
reducedMotion.addEventListener("change", (event) => {
  if (event.matches) slideshowPaused = true;
  updateSlideshowControl();
});

updateSlideshowControl();
