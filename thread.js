/* WOVEN — the thread.
   A fine thread underlines the word "woven", runs down out of the hero photo,
   then drifts faintly down the page behind the content, drawing itself as you scroll.
   Every position is measured relative to the element the drawing sits in, so the
   underline always lands exactly under the word. */
(function () {
  var yr = document.getElementById("yr"); if (yr) yr.textContent = new Date().getFullYear();
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var pageSvg, heroSvg, line, table = [], len = 0, ticking = false;

  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function smooth(pts) {
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
           " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
           " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }
  function el(name, attrs) { var e = document.createElementNS(NS, name); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function fade(id, y1, y2, stops) {
    var g = el("linearGradient", { id: id, gradientUnits: "userSpaceOnUse", x1: 0, x2: 0, y1: y1, y2: y2 });
    stops.forEach(function (s) { g.appendChild(el("stop", { offset: s[0], "stop-opacity": s[1], "class": s[2] || "thread-stop" })); });
    var d = el("defs", {}); d.appendChild(g); return d;
  }

  function build() {
    if (pageSvg) pageSvg.remove(); if (heroSvg) heroSvg.remove(); pageSvg = heroSvg = line = null;
    var word = document.querySelector(".woven");
    if (!word) return;

    var body = document.body, br = body.getBoundingClientRect();
    var W = body.clientWidth, H = body.scrollHeight;
    var wr = word.getBoundingClientRect();
    var hero = document.querySelector(".hero-full"), hr = hero ? hero.getBoundingClientRect() : null;
    var overlay = hero && getComputedStyle(document.querySelector(".hero-text")).position === "absolute";
    var rand = rng(4), start, pts;

    if (overlay) {
      // 1) inside the photo: underline the word, then fall softly to the bottom edge of the photo
      var x0 = wr.left - hr.left + wr.width * 0.03, x1 = wr.right - hr.left - wr.width * 0.06;
      var base = wr.bottom - hr.top - wr.height * 0.04;
      var exitX = Math.min(hr.width * 0.86, x1 + hr.width * 0.22);
      heroSvg = el("svg", { "class": "hero-svg", "aria-hidden": "true", viewBox: "0 0 " + hr.width + " " + hr.height, preserveAspectRatio: "none" });
      heroSvg.appendChild(fade("heroFade", base, hr.height, [["0", ".95", "thread-stop-light"], ["1", ".45", "thread-stop-light"]]));
      heroSvg.appendChild(el("path", {
        d: smooth([[x0, base + 2], [(x0 + x1) / 2, base + 6], [x1, base + 3], [x1 + 60, base + 14], [exitX - 20, hr.height * 0.82], [exitX, hr.height + 2]]),
        "class": "thread-line thread-hero"
      }));
      hero.appendChild(heroSvg);
      // 2) the page thread picks up exactly where the photo ends
      start = [hr.left - br.left + exitX, hr.bottom - br.top];
      pts = [start, [start[0] + 10, start[1] + 140]];
    } else {
      // small screens: words sit above the photo, so the page thread starts under the word itself
      var bx0 = wr.left - br.left + wr.width * 0.03, bx1 = wr.right - br.left - wr.width * 0.06, by = wr.bottom - br.top - wr.height * 0.04;
      start = [bx0, by + 2];
      pts = [start, [(bx0 + bx1) / 2, by + 6], [bx1, by + 3], [W - 12, by + 4], [W - 7, by + 40], [W - 7, by + 220]];
    }

    var y = pts[pts.length - 1][1], right = !overlay;
    while (y < H - 140) {
      y += 480 + rand() * 260;
      right = !right;
      var wide = W > 760;
      var x = right ? (wide ? W * (0.86 + rand() * 0.09) : W - 7 - rand() * 3) : (wide ? W * (0.04 + rand() * 0.08) : 7 + rand() * 3);
      pts.push([x, Math.min(y, H - 60)]);
    }

    pageSvg = el("svg", { "class": "thread-svg", "aria-hidden": "true", width: W, height: H, viewBox: "0 0 " + W + " " + H });
    pageSvg.appendChild(fade("threadFade", start[1], start[1] + 900, overlay ? [["0", ".5"], [".3", ".22"], ["1", ".12"]] : [["0", ".9"], [".08", ".5"], [".35", ".2"], ["1", ".12"]]));
    line = el("path", { d: smooth(pts), "class": "thread-line" });
    pageSvg.appendChild(line);
    body.appendChild(pageSvg);

    len = line.getTotalLength();
    line.style.strokeDasharray = len + " " + len;
    table = []; var maxY = -Infinity;
    for (var s = 0; s <= len; s += 16) { var py = line.getPointAtLength(s).y; if (py >= maxY) { maxY = py; table.push([s, py]); } }
    update();
  }

  function lengthAtY(y) {
    var lo = 0, hi = table.length - 1;
    if (!table.length || y <= table[0][1]) return 0;
    if (y >= table[hi][1]) return len;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (table[mid][1] < y) lo = mid; else hi = mid; }
    var a = table[lo], b = table[hi], t = (y - a[1]) / ((b[1] - a[1]) || 1);
    return a[0] + (b[0] - a[0]) * t;
  }

  function update() {
    ticking = false;
    if (!line) return;
    var viewLine = window.innerHeight * 0.85 - document.body.getBoundingClientRect().top; // in page-thread coordinates
    var drawn = reduce ? len : lengthAtY(viewLine);
    line.style.strokeDashoffset = len - drawn;
  }

  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  var rt; function later(ms) { clearTimeout(rt); rt = setTimeout(build, ms); }
  window.addEventListener("resize", function () { later(150); });
  window.addEventListener("load", function () { later(0); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { later(30); });
  document.querySelectorAll("img").forEach(function (im) { if (!im.complete) im.addEventListener("load", function () { later(200); }); });
  document.querySelectorAll("details").forEach(function (d) { d.addEventListener("toggle", function () { later(60); }); });
  if (document.readyState !== "loading") build(); else document.addEventListener("DOMContentLoaded", build);
})();
