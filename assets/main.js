// Luxe Express — site interactions
(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  /* Header solid-on-scroll (home page uses a transparent hero header) */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  if (document.body.classList.contains("page-home")) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav toggle */
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      document.documentElement.style.overflow = open ? "hidden" : "";
      document.body.classList.toggle("menu-open", open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.documentElement.style.overflow = "";
        document.body.classList.remove("menu-open");
      });
    });
  }

  /* Active nav link highlighting — only for plain page links (not on-page anchors) */
  var here = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav a, .mobile-nav a").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.indexOf("#") !== -1) return;
    if (href && href === here) {
      link.classList.add("is-active");
    }
  });

  /* Scroll-reveal — content is visible by default in CSS; only arm the
     hidden/reveal state once this same script is confirmed running, so a
     blocked or failed script can never leave content permanently hidden. */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window && revealEls.length) {
    document.documentElement.classList.add("reveal-armed");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Contact form (no backend — client-side confirmation) */
  var form = document.getElementById("bookingForm");
  if (form) {
    var status = document.getElementById("formStatus");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim() || "there";
      if (status) {
        status.textContent =
          "Thanks, " + name + " — we've received your request and will confirm by text shortly.";
        status.classList.add("is-visible");
        status.setAttribute("tabindex", "-1");
        status.focus({ preventScroll: true });
      }
      form.reset();
    });
  }
})();
