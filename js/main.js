document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const revealItems = document.querySelectorAll(".reveal");
  const cookieBanner = document.querySelector(".cookie-banner");
  const acceptCookies = document.querySelector("[data-cookie='accept']");
  const rejectCookies = document.querySelector("[data-cookie='reject']");
  const reviewItems = document.querySelectorAll(".review-item");
  const reviewPrev = document.querySelector("[data-review='prev']");
  const reviewNext = document.querySelector("[data-review='next']");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item[data-category]");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxTitle = document.querySelector(".lightbox-title");
  const lightboxText = document.querySelector(".lightbox-text");
  const lightboxClose = document.querySelector(".lightbox-close");

  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll);

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(".main-nav a[data-page]").forEach((link) => {
      if (link.dataset.page === page) {
        link.classList.add("active");
      }
    });
  }

  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const cookieKey = "rmc_cookie_choice";
  if (cookieBanner && !localStorage.getItem(cookieKey)) {
    cookieBanner.classList.add("show");
  }

  const setCookieChoice = (choice) => {
    localStorage.setItem(cookieKey, choice);
    cookieBanner?.classList.remove("show");
  };

  acceptCookies?.addEventListener("click", () => setCookieChoice("accepted"));
  rejectCookies?.addEventListener("click", () => setCookieChoice("rejected"));

  let reviewIndex = 0;
  let reviewTimer;

  const showReview = (idx) => {
    if (!reviewItems.length) return;
    reviewItems.forEach((item, i) => item.classList.toggle("active", i === idx));
  };

  const startReviewAuto = () => {
    if (!reviewItems.length) return;
    reviewTimer = window.setInterval(() => {
      reviewIndex = (reviewIndex + 1) % reviewItems.length;
      showReview(reviewIndex);
    }, 5500);
  };

  if (reviewItems.length) {
    showReview(reviewIndex);
    startReviewAuto();

    reviewPrev?.addEventListener("click", () => {
      clearInterval(reviewTimer);
      reviewIndex = (reviewIndex - 1 + reviewItems.length) % reviewItems.length;
      showReview(reviewIndex);
      startReviewAuto();
    });

    reviewNext?.addEventListener("click", () => {
      clearInterval(reviewTimer);
      reviewIndex = (reviewIndex + 1) % reviewItems.length;
      showReview(reviewIndex);
      startReviewAuto();
    });
  }

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.filter;
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        galleryItems.forEach((item) => {
          const match = category === "all" || item.dataset.category === category;
          item.classList.toggle("hidden", !match);
        });
      });
    });
  }

  const openLightbox = (target) => {
    if (!lightbox || !target || !lightboxImage || !lightboxTitle || !lightboxText) return;
    lightboxImage.src = target.dataset.image || "";
    lightboxImage.alt = target.dataset.title || "Photo de chantier";
    lightboxTitle.textContent = target.dataset.title || "Réalisation";
    lightboxText.textContent = target.dataset.description || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
    item.addEventListener("keypress", (event) => {
      if (event.key === "Enter") openLightbox(item);
    });
  });

  const closeLightbox = () => {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
});
