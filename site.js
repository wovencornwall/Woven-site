/* WOVEN — gentle movement.
   Sections drift up and fade in as they come into view, and the services carousel moves with
   arrows, swipes and the keyboard. Anything already on screen is shown straight away, and visitors
   who prefer reduced motion see everything still. */
(function () {
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- fade in on scroll ---------- */
  var selectors = [
    "main section > .wrap > *", "main section > .quote-photo", "main section > .wrap.strip > *",
    ".offerings > *", ".page-hero > *", ".page-photo", ".site-footer footer > *:not(.legal)"
  ];
  var targets = [];
  document.querySelectorAll(selectors.join(",")).forEach(function (el) {
    if (el.closest(".hero") || targets.indexOf(el) > -1) return;
    if (el.classList.contains("strip") || el.classList.contains("offerings")) return;
    targets.push(el);
  });
  if (!reduce && "IntersectionObserver" in window) {
    var vh = window.innerHeight;
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.classList.add("reveal");
      if (r.top < vh * .92 && r.bottom > 0) el.classList.add("in");
    });
    // siblings in a row arrive one after another
    document.querySelectorAll(".strip, .offerings, .values, .steps, .gtk").forEach(function (row) {
      Array.prototype.forEach.call(row.children, function (c, i) { c.style.transitionDelay = Math.min(i, 5) * 90 + "ms"; });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -4% 0px", threshold: 0.04 });
    targets.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
  }

  /* ---------- services carousel ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector(".carousel-track");
    var prev = root.querySelector("[data-prev]"), next = root.querySelector("[data-next]");
    var bar = root.querySelector(".carousel-progress span");
    function step() {
      var card = track.children[0];
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var x = track.scrollLeft;
      prev.disabled = x <= 2;
      next.disabled = x >= max - 2;
      if (bar) {
        var shown = track.clientWidth / track.scrollWidth;
        bar.style.width = (shown * 100) + "%";
        bar.style.transform = "translateX(" + (max > 0 ? (x / max) * ((1 - shown) / shown) * 100 : 0) + "%)";
      }
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }); });
    track.addEventListener("scroll", function () { window.requestAnimationFrame(update); }, { passive: true });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); }
    });
    window.addEventListener("resize", update);
    update();
  });
})();
